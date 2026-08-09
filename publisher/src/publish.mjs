import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
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
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

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

export async function handler(event) {
  const email = String(getClaims(event).email || "").toLowerCase();
  if (!email || email !== String(process.env.ALLOWED_ADMIN_EMAIL || "").toLowerCase()) return json(403, { message: "게시 권한이 없습니다." });

  try {
    const payload = JSON.parse(event.body || "{}");
    verifyPayload(payload);
    const commitUrl = await commitContent(payload);
    return json(200, { message: "GitHub 커밋과 홈페이지 배포를 시작했습니다.", commitUrl });
  } catch (error) {
    console.error("Publishing failed", error);
    return json(400, { message: error instanceof Error ? error.message : "게시 중 오류가 발생했습니다." });
  }
}
