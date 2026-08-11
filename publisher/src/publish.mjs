import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { App } from "octokit";

const targets = {
  news: "frontend/src/news.json",
  international: "frontend/src/publications.json",
  domestic: "frontend/src/publications_domestic.json",
  members: "frontend/src/members.json",
  gallery: "frontend/src/gallery.json",
};

const json = (statusCode, body) => ({
  statusCode,
  // SAM configures the OPTIONS preflight response, but Lambda proxy responses
  // need their own CORS header as well. Without this header browsers hide even
  // successful publish results as "Failed to fetch".
  headers: {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "https://hcc.hanyang.ac.kr",
    vary: "Origin",
  },
  body: JSON.stringify(body),
});

const s3 = new S3Client({});
const assetKinds = {
  "member-image": {
    bucket: () => process.env.MEMBER_ASSETS_BUCKET,
    prefix: "image/members",
    publicUrl: (bucket, key, region) => `https://${bucket}.s3.${region}.amazonaws.com/${encodeKey(key)}`,
    extensions: ["jpg", "jpeg", "png", "webp", "gif"],
    contentTypes: { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" },
  },
  "member-cv": {
    bucket: () => process.env.MEMBER_ASSETS_BUCKET,
    prefix: "Lab-members-CV",
    publicUrl: (bucket, key, region) => `https://${bucket}.s3.${region}.amazonaws.com/${encodeKey(key)}`,
    extensions: ["pdf"],
    contentTypes: { pdf: "application/pdf" },
  },
  gallery: {
    bucket: () => process.env.WEBSITE_ASSETS_BUCKET,
    prefix: "image/gallery",
    // hcc.hanyang.ac.kr contains dots, so use S3 path-style URLs to avoid a
    // wildcard-certificate mismatch in browsers.
    publicUrl: (bucket, key, region) => `https://s3.${region}.amazonaws.com/${bucket}/${encodeKey(key)}`,
    extensions: ["jpg", "jpeg", "png", "webp", "gif"],
    contentTypes: { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" },
  },
  publication: {
    bucket: () => process.env.PUBLICATION_ASSETS_BUCKET,
    prefix: null,
    publicUrl: (bucket, key, region) => `https://${bucket}.s3.${region}.amazonaws.com/${encodeKey(key)}`,
    extensions: ["pdf"],
    contentTypes: { pdf: "application/pdf" },
  },
};

function encodeKey(key) {
  return key.split("/").map(encodeURIComponent).join("/");
}

function fileExtension(filename) {
  const extension = String(filename || "").trim().split(".").pop()?.toLowerCase();
  return extension && extension !== String(filename || "").trim().toLowerCase() ? extension : "";
}

function safeFilename(filename) {
  const value = String(filename || "").trim().normalize("NFC");
  if (!value || value.length > 160 || /[\\/\x00-\x1f]/.test(value)) throw new Error("파일 이름을 확인하세요.");
  return value.replace(/\s+/g, " ");
}

export function getUploadTarget(payload) {
  const kind = assetKinds[payload?.kind];
  if (!kind) throw new Error("지원하지 않는 업로드 종류입니다.");
  const filename = safeFilename(payload.filename);
  const extension = fileExtension(filename);
  if (!kind.extensions.includes(extension)) throw new Error(`${kind.extensions.join(", ").toUpperCase()} 파일만 올릴 수 있습니다.`);
  const year = Number(payload.year);
  if (payload.kind === "publication" && (!Number.isInteger(year) || year < 2000 || year > 2100)) {
    throw new Error("논문 자료에는 올바른 연도를 입력하세요.");
  }

  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  const key = payload.kind === "publication"
    ? `${year}/${timestamp}-${filename}`
    : `${kind.prefix}/${timestamp}-${filename}`;
  const bucket = kind.bucket();
  if (!bucket) throw new Error("업로드 버킷 설정이 누락되었습니다.");
  return { bucket, key, contentType: kind.contentTypes[extension], publicUrl: kind.publicUrl(bucket, key, process.env.AWS_REGION || "ap-northeast-2") };
}

function getClaims(event) {
  return event.requestContext?.authorizer?.claims || {};
}

function verifyPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("게시할 콘텐츠 형식이 올바르지 않습니다.");
  for (const key of Object.keys(targets)) {
    if (!(key in payload)) throw new Error(`${key} 데이터가 없습니다.`);
  }
  if (!Array.isArray(payload.news) || !Array.isArray(payload.international) || !Array.isArray(payload.domestic) || !Array.isArray(payload.gallery)) {
    throw new Error("뉴스·논문·갤러리 데이터는 목록이어야 합니다.");
  }
  if (!payload.members || typeof payload.members !== "object" || !Array.isArray(payload.members.people) || !Array.isArray(payload.members.alumni)) {
    throw new Error("멤버 데이터 형식이 올바르지 않습니다.");
  }
}

async function getPrivateKey() {
  const client = new SecretsManagerClient({});
  const result = await client.send(new GetSecretValueCommand({ SecretId: process.env.GITHUB_APP_PRIVATE_KEY_SECRET_ARN }));
  const raw = result.SecretString || "";
  try {
    return JSON.parse(raw).privateKey;
  } catch {
    return raw;
  }
}

async function commitContent(payload) {
  const privateKey = await getPrivateKey();
  if (!privateKey) throw new Error("GitHub App private key를 읽을 수 없습니다.");

  const app = new App({ appId: process.env.GITHUB_APP_ID, privateKey });
  const octokit = await app.getInstallationOctokit(Number(process.env.GITHUB_APP_INSTALLATION_ID));
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_BRANCH;

  const { data: ref } = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
  const parentSha = ref.object.sha;
  const { data: parentCommit } = await octokit.rest.git.getCommit({ owner, repo, commit_sha: parentSha });

  const tree = await Promise.all(Object.entries(targets).map(async ([key, path]) => {
    const content = `${JSON.stringify(payload[key], null, 2)}\n`;
    const { data: blob } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(content).toString("base64"),
      encoding: "base64",
    });
    return { path, mode: "100644", type: "blob", sha: blob.sha };
  }));

  const { data: nextTree } = await octokit.rest.git.createTree({ owner, repo, base_tree: parentCommit.tree.sha, tree });
  const { data: commit } = await octokit.rest.git.createCommit({
    owner,
    repo,
    message: "content: publish website updates from admin",
    tree: nextTree.sha,
    parents: [parentSha],
  });
  await octokit.rest.git.updateRef({ owner, repo, ref: `heads/${branch}`, sha: commit.sha, force: false });
  await octokit.rest.actions.createWorkflowDispatch({
    owner,
    repo,
    workflow_id: "deploy-website.yml",
    ref: branch,
    inputs: { mode: "deploy" },
  });
  return commit.html_url;
}

async function createUploadUrl(payload) {
  const target = getUploadTarget(payload);
  const uploadUrl = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: target.bucket,
    Key: target.key,
    ContentType: target.contentType,
  }), { expiresIn: 120 });
  return { ...target, uploadUrl };
}

export async function handler(event) {
  const email = String(getClaims(event).email || "").toLowerCase();
  if (!email || email !== String(process.env.ALLOWED_ADMIN_EMAIL || "").toLowerCase()) return json(403, { message: "게시 권한이 없습니다." });

  try {
    const payload = JSON.parse(event.body || "{}");
    const path = event.resource || event.requestContext?.resourcePath || event.path || "";
    if (path.endsWith("/upload-url")) {
      const upload = await createUploadUrl(payload);
      return json(200, { message: "업로드 주소를 만들었습니다.", uploadUrl: upload.uploadUrl, publicUrl: upload.publicUrl, contentType: upload.contentType });
    }
    verifyPayload(payload);
    const commitUrl = await commitContent(payload);
    return json(200, { message: "GitHub 커밋과 홈페이지 배포를 시작했습니다.", commitUrl });
  } catch (error) {
    console.error("Publishing failed", error);
    return json(400, { message: error instanceof Error ? error.message : "게시 중 오류가 발생했습니다." });
  }
}
