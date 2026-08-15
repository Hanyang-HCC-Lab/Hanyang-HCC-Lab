<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import initialNews from "../../frontend/src/news.json";
import initialInternational from "../../frontend/src/publications.json";
import initialDomestic from "../../frontend/src/publications_domestic.json";
import initialMembers from "../../frontend/src/members.json";
import initialGallery from "../../frontend/src/gallery.json";
import { publishingConfig, publishingConfigured } from "./publish-config";

const STORAGE_KEY = "hcc-lab-admin-draft-v2";
const tags = ["hai", "vr", "dm", "fashion", "social", "health", "cv", "nlp", "safety"];
const tagLabels = {
  hai: "Human-AI Interaction", vr: "VR/AR/XR", dm: "Data Mining", fashion: "Fashion",
  social: "Social Computing", health: "Digital Health", cv: "Computer Vision",
  nlp: "Natural Language Processing", safety: "AI Safety",
};
const memberGroups = [
  "Professor",
  "Ph.D. Candidates",
  "Ph.D. Students",
  "Research Associates",
  "M.S. Students",
  "Undergraduate Students",
  "Administrative Staff",
];
const awardOptions = [
  ["", "수상 없음"],
  ["best_paper", "Best Paper Award"],
  ["grand_paper", "Grand Paper Award"],
  ["outstanding_paper", "Outstanding Paper Award"],
  ["honorable_mention", "Honorable Mention Award"],
  ["best_presentation", "Best Presentation Award"],
  ["new_challenge", "New Challenge Award"],
];
const kImpactLabel = "컴퓨터공학분야 우수국제학술대회";
const publicationLinkFields = [
  ["paper", "논문 PDF·공식 링크"], ["ACM", "ACM 링크"], ["DOI", "DOI 링크"],
  ["ACL", "ACL Anthology 링크"], ["IEEE", "IEEE 링크"], ["ECVA", "ECVA 링크"],
  ["presentation", "발표 영상"], ["slide", "슬라이드 PDF"], ["poster", "포스터 PDF"],
  ["demo", "데모 링크"], ["media", "언론·미디어 링크"],
];
const deepCopy = (value) => JSON.parse(JSON.stringify(value));
const sourceState = () => ({
  news: deepCopy(initialNews),
  international: deepCopy(initialInternational),
  domestic: deepCopy(initialDomestic),
  members: deepCopy(initialMembers),
  gallery: deepCopy(initialGallery),
});
let storedDraft = null;
try {
  storedDraft = JSON.parse(localStorage.getItem(STORAGE_KEY));
} catch {
  localStorage.removeItem(STORAGE_KEY);
}
// Older browser drafts predate the members/gallery editor. Keep the user's
// existing news/publication edits, but seed any newly introduced section from
// the repository so its editor never opens empty.
function stateFromDraft(draft, baseline = sourceState()) {
  const next = deepCopy(baseline);
  if (!draft || typeof draft !== "object" || Array.isArray(draft)) return next;

  ["news", "international", "domestic", "gallery"].forEach((key) => {
    if (Array.isArray(draft[key])) next[key] = draft[key];
  });
  // v2 stored only the active-member array. Preserve it while retaining the
  // alumni collection required by the public Members component.
  if (Array.isArray(draft.members)) next.members.people = draft.members;
  if (draft.members && typeof draft.members === "object" && !Array.isArray(draft.members)) {
    if (Array.isArray(draft.members.people)) next.members.people = draft.members.people;
    if (Array.isArray(draft.members.alumni)) next.members.alumni = draft.members.alumni;
  }
  return next;
}

const baselineState = ref(sourceState());
const initialState = stateFromDraft(storedDraft, baselineState.value);

const section = ref("news");
const state = ref(initialState);
const selectedIndex = ref(0);
const query = ref("");
const searchInput = ref(null);
const editorMode = ref("edit");
const previewViewport = ref("desktop");
const message = ref(storedDraft ? "이 브라우저에 저장된 초안을 불러왔습니다." : "현재 홈페이지의 JSON 데이터를 불러왔습니다.");
const checked = ref(false);
const validationErrors = ref([]);
const loginEmail = ref("");
const loginPassword = ref("");
const loginMessage = ref("");
const isAuthenticated = ref(false);
const publishing = ref(false);
const uploading = ref("");
const uploadMessage = ref("");

const navItems = [
  ["overview", "개요"], ["news", "소식"], ["international", "국제 논문"],
  ["domestic", "국내 논문"], ["members", "멤버"], ["alumni", "Alumni"], ["gallery", "갤러리"], ["deployment", "배포"],
];
const isPublication = computed(() => ["international", "domestic"].includes(section.value));
const currentItems = computed(() => {
  if (section.value === "members") return state.value.members.people;
  if (section.value === "alumni") return state.value.members.alumni;
  return state.value[section.value] || [];
});
const selected = computed(() => currentItems.value[selectedIndex.value]);
const dirty = computed(() => JSON.stringify(state.value) !== JSON.stringify(baselineState.value));
const matchingItemCount = computed(() => currentItems.value.filter(matchesQuery).length);
const workflowStep = computed(() => {
  if (!dirty.value) return 1;
  if (!checked.value || validationErrors.value.length) return 2;
  return 3;
});
const sectionDescription = computed(() => section.value === "news"
  ? "홈페이지에 표시할 새 소식을 관리합니다."
  : section.value === "members"
    ? "사진·CV·개인 링크를 관리합니다."
    : section.value === "alumni"
      ? "졸업생·수료생의 소개와 현재 소속 링크를 관리합니다."
      : section.value === "gallery"
        ? "S3 갤러리 이미지 주소와 설명을 관리합니다."
        : "논문 정보와 표시 태그를 관리합니다.");

watch(state, (value) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  checked.value = false;
  validationErrors.value = [];
}, { deep: true });

function ensurePublication(item) {
  if (!item.link) item.link = {};
  if (!item.acceptance_rate) item.acceptance_rate = {};
  if (!item.oral_acceptance_rate) item.oral_acceptance_rate = {};
  if (!item.award) item.award = {};
  if (!item.additional) item.additional = {};
  if (!Array.isArray(item.kImpact)) item.kImpact = [];
}

function chooseSection(next) {
  if (["international", "domestic"].includes(next)) {
    state.value[next].forEach(ensurePublication);
  }
  section.value = next;
  selectedIndex.value = 0;
  query.value = "";
  editorMode.value = "edit";
  checked.value = false;
  validationErrors.value = [];
  message.value = next === "deployment"
      ? "실제 배포는 GitHub Actions에서 직접 실행합니다. 이 화면은 AWS 권한을 보유하지 않습니다."
    : "";
}

function matchesQuery(item) {
  const needle = query.value.trim().toLocaleLowerCase();
  if (!needle) return true;
  if (!item) return false;
  return JSON.stringify(item).toLocaleLowerCase().includes(needle);
}

watch(query, () => {
  const firstMatch = currentItems.value.findIndex(matchesQuery);
  if (firstMatch !== -1 && !matchesQuery(selected.value)) selectedIndex.value = firstMatch;
});

function selectItem(index) {
  if (isPublication.value) ensurePublication(currentItems.value[index]);
  selectedIndex.value = index;
}

function labelFor(item) {
  if (section.value === "news") return item.content.replace(/<[^>]*>/g, "").slice(0, 68);
  if (section.value === "members") return item.name;
  if (section.value === "alumni") return item.name.replace(/&nbsp;/g, "").trim();
  if (section.value === "gallery") return item.caption;
  return item.title;
}

function addItem() {
  if (section.value === "news") {
    const max = Math.max(0, ...state.value.news.map((item) => Number(item.index) || 0));
    state.value.news.unshift({ index: max + 1, date: "Aug. 2026", content: "새 연구실 소식" });
  } else if (isPublication.value) {
    const items = state.value[section.value];
    const max = Math.max(0, ...items.map((item) => Number(item.index) || 0));
    items.unshift({ index: max + 1, year: 2026, title: "새 논문 제목.", author: "", venue: "", date: "", tags: ["hai"], link: {}, acceptance_rate: {}, oral_acceptance_rate: {}, additional: {}, award: {}, kImpact: [] });
  } else if (section.value === "members") {
    state.value.members.people.push({ index: Date.now(), group: "M.S. Students", name: "New member", nameKo: "새 멤버", image: "", email: "", link: "" });
  } else if (section.value === "alumni") {
    const max = Math.max(0, ...state.value.members.alumni.map((item) => Number(item.index) || 0));
    state.value.members.alumni.unshift({ index: max + 1, name: "New alumni", description: "" });
  } else if (section.value === "gallery") {
    state.value.gallery.unshift({ index: Date.now(), image: "", caption: "[2026.08] New gallery item" });
  }
  selectedIndex.value = 0;
  editorMode.value = "edit";
  message.value = "새 항목을 만들었습니다. 저장하면 이 브라우저의 초안에 반영됩니다.";
}

function deleteItem() {
  if (!selected.value || !confirm("선택한 항목을 초안에서 삭제할까요?")) return;
  currentItems.value.splice(selectedIndex.value, 1);
  selectedIndex.value = Math.max(0, selectedIndex.value - 1);
  message.value = "초안에서 삭제했습니다. 운영 홈페이지에는 아직 반영되지 않았습니다.";
}

function toggleTag(tag) {
  const paperTags = selected.value.tags || (selected.value.tags = []);
  const index = paperTags.indexOf(tag);
  index === -1 ? paperTags.push(tag) : paperTags.splice(index, 1);
}

function awardType(award) {
  return awardOptions.find(([key]) => key && Object.prototype.hasOwnProperty.call(award || {}, key))?.[0] || "";
}

function setAwardType(type) {
  selected.value.award = type ? { [type]: "" } : {};
}

function hasKImpact(item) {
  return Array.isArray(item.kImpact) && item.kImpact.includes(kImpactLabel);
}

function toggleKImpact(enabled) {
  const labels = Array.isArray(selected.value.kImpact) ? selected.value.kImpact : [];
  const index = labels.indexOf(kImpactLabel);
  if (enabled && index === -1) labels.push(kImpactLabel);
  if (!enabled && index !== -1) labels.splice(index, 1);
  selected.value.kImpact = labels;
}

function kImpactText(item) {
  return Array.isArray(item.kImpact) ? item.kImpact.join("\n") : "";
}

function setKImpactText(value) {
  selected.value.kImpact = value.split("\n").map((label) => label.trim()).filter(Boolean);
}

function text(value) {
  return String(value || "").trim();
}

function isWebAddress(value) {
  if (!text(value)) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validateDraft() {
  const errors = [];
  state.value.news.forEach((item, index) => {
    const label = `소식 ${index + 1}`;
    if (!Number.isFinite(Number(item.index))) errors.push(`${label}: 번호가 필요합니다.`);
    if (!text(item.date)) errors.push(`${label}: 날짜가 필요합니다.`);
    if (!text(item.content)) errors.push(`${label}: 내용이 필요합니다.`);
  });

  ["international", "domestic"].forEach((collection) => {
    state.value[collection].forEach((item, index) => {
      const label = `${collection === "international" ? "국제" : "국내"} 논문 ${index + 1}`;
      if (!Number.isFinite(Number(item.index))) errors.push(`${label}: 번호가 필요합니다.`);
      if (!Number.isInteger(Number(item.year)) || Number(item.year) < 1900 || Number(item.year) > 2100) errors.push(`${label}: 연도를 확인하세요.`);
      if (!text(item.title)) errors.push(`${label}: 제목이 필요합니다.`);
      if (!text(item.author)) errors.push(`${label}: 저자 정보가 필요합니다.`);
      if ((item.tags || []).some((tag) => !tags.includes(tag))) errors.push(`${label}: 지원하지 않는 태그가 있습니다.`);
      Object.entries(item.link || {}).forEach(([key, value]) => {
        if (!isWebAddress(value)) errors.push(`${label}: ${key} 링크가 올바른 주소가 아닙니다.`);
      });
    });
  });

  state.value.members.people.forEach((item, index) => {
    const label = `멤버 ${index + 1}`;
    if (!text(item.group) || !text(item.name) || !text(item.nameKo)) errors.push(`${label}: 구분과 이름을 확인하세요.`);
    if (!isWebAddress(item.image) || !isWebAddress(item.link)) errors.push(`${label}: 사진 또는 링크 주소가 올바르지 않습니다.`);
  });
  state.value.members.alumni.forEach((item, index) => {
    if (!text(item.name)) errors.push(`Alumni ${index + 1}: 이름이 필요합니다.`);
    if (!isWebAddress(item.link)) errors.push(`Alumni ${index + 1}: 링크 주소가 올바르지 않습니다.`);
  });
  state.value.gallery.forEach((item, index) => {
    if (!text(item.caption) || !isWebAddress(item.image)) errors.push(`갤러리 ${index + 1}: 설명과 이미지 주소를 확인하세요.`);
  });

  validationErrors.value = errors;
  checked.value = true;
  message.value = errors.length
    ? `${errors.length}개의 확인 항목이 있습니다. 수정한 뒤 다시 검사하세요.`
    : publishingConfigured ? "검사를 통과했습니다. 로그인 후 게시하면 홈페이지 배포가 자동으로 시작됩니다." : "검사를 통과했습니다. JSON을 내려받아 검토할 수 있습니다.";
}

function downloadJson(payload, filename) {
  const file = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadDraft() {
  const payload = ["members", "alumni"].includes(section.value) ? state.value.members : currentItems.value;
  const filename = { news: "news.json", international: "publications.json", domestic: "publications_domestic.json", members: "members.json", alumni: "members.json", gallery: "gallery.json" }[section.value];
  downloadJson(payload, filename);
  message.value = `${filename} 초안을 내려받았습니다. 자동 게시 연결 전에도 검토용으로 사용할 수 있습니다.`;
}

function downloadAllDrafts() {
  downloadJson(state.value, "hcc-lab-content-draft.json");
  message.value = "뉴스·논문·멤버·갤러리 전체 초안을 하나의 검토 파일로 내려받았습니다.";
}

function resetDraft() {
  if (!confirm("브라우저에 저장된 모든 초안을 버리고 현재 저장소 데이터로 되돌릴까요?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state.value = deepCopy(baselineState.value);
  selectedIndex.value = 0;
  checked.value = false;
  validationErrors.value = [];
  message.value = "초안을 초기화했습니다.";
}

function setEditorMode(mode) {
  editorMode.value = mode;
}

function handleKeyboardShortcut(event) {
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
  if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLocaleLowerCase() === "p") {
    event.preventDefault();
    editorMode.value = editorMode.value === "edit" ? "preview" : "edit";
    return;
  }
  if (event.key === "/" && !isTyping && !["overview", "deployment"].includes(section.value)) {
    event.preventDefault();
    nextTick(() => searchInput.value?.focus());
  }
  if (event.key === "Escape" && query.value) {
    query.value = "";
    searchInput.value?.blur();
  }
}

function getCognitoPool() {
  if (!publishingConfigured) throw new Error("게시 서비스 설정이 아직 완료되지 않았습니다.");
  return new CognitoUserPool({ UserPoolId: publishingConfig.userPoolId, ClientId: publishingConfig.clientId });
}

function restoreSession() {
  if (!publishingConfigured) return;
  const user = getCognitoPool().getCurrentUser();
  if (!user) return;
  user.getSession((error, session) => {
    isAuthenticated.value = !error && Boolean(session?.isValid());
    if (isAuthenticated.value) loginMessage.value = "관리자 로그인 상태입니다.";
  });
}

function signIn() {
  loginMessage.value = "";
  try {
    const user = new CognitoUser({ Username: loginEmail.value.trim(), Pool: getCognitoPool() });
    user.authenticateUser(new AuthenticationDetails({ Username: loginEmail.value.trim(), Password: loginPassword.value }), {
      onSuccess: () => {
        isAuthenticated.value = true;
        loginPassword.value = "";
        loginMessage.value = "로그인했습니다. 이제 게시할 수 있습니다.";
      },
      onFailure: (error) => { loginMessage.value = error.message || "로그인에 실패했습니다."; },
      newPasswordRequired: () => { loginMessage.value = "임시 비밀번호입니다. AWS 콘솔에서 영구 비밀번호를 설정한 뒤 다시 로그인하세요."; },
    });
  } catch (error) {
    loginMessage.value = error instanceof Error ? error.message : "로그인 설정을 확인하세요.";
  }
}

function getIdToken() {
  return new Promise((resolve, reject) => {
    const user = getCognitoPool().getCurrentUser();
    if (!user) return reject(new Error("배포 탭에서 먼저 로그인하세요."));
    user.getSession((error, session) => {
      if (error || !session?.isValid()) return reject(new Error("로그인 세션이 만료되었습니다. 다시 로그인하세요."));
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

async function uploadAsset(event, kind, targetKey) {
  const file = event.target.files?.[0];
  // Let a person select the exact same file again after fixing an error.
  event.target.value = "";
  if (!file) return;
  if (!publishingConfigured) {
    uploadMessage.value = "업로드 서비스 설정이 아직 완료되지 않았습니다.";
    return;
  }
  if (!isAuthenticated.value) {
    uploadMessage.value = "파일 업로드는 배포 탭에서 로그인한 뒤 사용할 수 있습니다.";
    section.value = "deployment";
    return;
  }

  uploading.value = `${kind}:${targetKey}`;
  uploadMessage.value = `“${file.name}” 파일을 올릴 준비를 하고 있습니다…`;
  try {
    const token = await getIdToken();
    const response = await fetch(`${publishingConfig.apiUrl.replace(/\/$/, "")}/upload-url`, {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ kind, filename: file.name, year: selected.value?.year }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "업로드 주소를 만들지 못했습니다.");

    const uploadResponse = await fetch(result.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": result.contentType },
      body: file,
    });
    if (!uploadResponse.ok) throw new Error("S3에 파일을 올리지 못했습니다.");

    if (targetKey === "image") selected.value.image = result.publicUrl;
    else if (targetKey === "link") selected.value.link = result.publicUrl;
    else selected.value.link[targetKey] = result.publicUrl;
    uploadMessage.value = "업로드했습니다. 링크 칸에 주소를 자동으로 넣었습니다. 게시 버튼을 누르면 홈페이지에 반영됩니다.";
  } catch (error) {
    const reason = error instanceof Error ? error.message : "파일 업로드 중 오류가 발생했습니다.";
    uploadMessage.value = `${reason} S3 CORS 설정이 아직 없으면 한 번만 추가해야 합니다.`;
  } finally {
    uploading.value = "";
  }
}

function uploadingAsset(kind, targetKey) {
  return uploading.value === `${kind}:${targetKey}`;
}

async function publishDraft() {
  validateDraft();
  if (validationErrors.value.length) return;
  if (!publishingConfigured) {
    section.value = "deployment";
    message.value = "게시 연결 설정이 아직 완료되지 않았습니다.";
    return;
  }
  publishing.value = true;
  try {
    const token = await getIdToken();
    const response = await fetch(`${publishingConfig.apiUrl.replace(/\/$/, "")}/publish`, {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(state.value),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "게시 요청에 실패했습니다.");
    baselineState.value = deepCopy(state.value);
    message.value = `${result.message} GitHub Actions가 끝나면 공개 홈페이지에 반영됩니다.`;
    loginMessage.value = result.commitUrl ? `게시 요청 완료: ${result.commitUrl}` : "게시 요청을 완료했습니다.";
  } catch (error) {
    loginMessage.value = error instanceof Error ? error.message : "게시 중 오류가 발생했습니다.";
  } finally {
    publishing.value = false;
  }
}

async function loadRepositoryData() {
  const root = "https://raw.githubusercontent.com/Hanyang-HCC-Lab/Hanyang-HCC-Lab/main/frontend/src";
  try {
    const [news, international, domestic, members, gallery] = await Promise.all([
      "news.json", "publications.json", "publications_domestic.json", "members.json", "gallery.json",
    ].map(async (file) => {
      const response = await fetch(`${root}/${file}`);
      if (!response.ok) throw new Error(`${file}을 불러오지 못했습니다.`);
      return response.json();
    }));
    baselineState.value = { news, international, domestic, members, gallery };
    let latestDraft = storedDraft;
    try { latestDraft = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { /* use initial draft */ }
    state.value = stateFromDraft(latestDraft, baselineState.value);
    if (!latestDraft) message.value = "저장소의 최신 JSON 데이터를 불러왔습니다.";
  } catch {
    if (!storedDraft) message.value = "기본 데이터를 불러왔습니다. 최신 저장소 확인은 현재 사용할 수 없습니다.";
  }
}

onMounted(() => {
  restoreSession();
  loadRepositoryData();
  window.addEventListener("keydown", handleKeyboardShortcut);
});

onBeforeUnmount(() => window.removeEventListener("keydown", handleKeyboardShortcut));
</script>

<template>
  <main class="shell">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">H</span><span>HCC Lab</span></div>
      <nav aria-label="관리 메뉴">
        <button v-for="[key, label] in navItems" :key="key" class="nav-item" :class="{ active: section === key }" :aria-current="section === key ? 'page' : undefined" @click="chooseSection(key)">
          <span class="nav-icon" aria-hidden="true">
            <svg v-if="key === 'overview'" viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" /></svg>
            <svg v-else-if="key === 'news'" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
            <svg v-else-if="key === 'international'" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z" /></svg>
            <svg v-else-if="key === 'domestic'" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>
            <svg v-else-if="key === 'members'" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M15 14.5a5 5 0 0 1 6 4.8v.7" /></svg>
            <svg v-else-if="key === 'alumni'" viewBox="0 0 24 24"><path d="m3 8 9-5 9 5-9 5Z" /><path d="M7 11v5c2.8 2.7 7.2 2.7 10 0v-5M21 8v7" /></svg>
            <svg v-else-if="key === 'gallery'" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m4 17 4.5-4.5 3.5 3 2.5-2.5 5.5 5" /></svg>
            <svg v-else viewBox="0 0 24 24"><path d="m21 3-7.5 18-3.6-7.9L2 9.5Z" /><path d="M9.9 13.1 21 3" /></svg>
          </span>
          <span>{{ label }}</span>
        </button>
      </nav>
      <div class="sidebar-foot">Content manager<br /><span><i aria-hidden="true"></i>안전한 로컬 초안</span></div>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div class="title-block">
          <p class="crumb">HCC LAB WEBSITE</p>
          <h1>{{ section === "overview" ? "콘텐츠 관리" : navItems.find((item) => item[0] === section)?.[1] }}</h1>
          <p class="section-summary">{{ section === "overview" ? "연구실 홈페이지 콘텐츠를 한곳에서 관리합니다." : section === "deployment" ? "검사된 변경사항을 안전하게 공개합니다." : sectionDescription }}</p>
        </div>
        <div class="status-rail" aria-label="게시 상태">
          <div :class="{ active: workflowStep === 1, complete: workflowStep > 1 }"><strong><i aria-hidden="true"></i>DRAFT</strong><span>{{ dirty ? "초안 편집 중" : "저장소와 동일" }}</span><small>{{ dirty ? "자동 저장됨" : "변경 없음" }}</small></div>
          <div :class="{ active: workflowStep === 2, complete: workflowStep > 2 }"><strong><i aria-hidden="true"></i>CHECK</strong><span>{{ validationErrors.length ? `${validationErrors.length}개 확인 필요` : checked ? "검사 완료" : "검사 대기" }}</span><small>{{ checked && !validationErrors.length ? "오류 없음" : "미검사" }}</small></div>
          <div :class="{ active: workflowStep === 3 }"><strong><i aria-hidden="true"></i>PUBLISH</strong><span>{{ workflowStep === 3 ? "게시 준비" : "게시 대기" }}</span><small>{{ dirty ? "미게시" : "변경 없음" }}</small></div>
        </div>
      </header>

      <template v-if="section === 'overview'">
        <div class="overview">
          <p class="lead">이 페이지에서 뉴스·논문·멤버·갤러리 정보를 안전한 로컬 초안으로 편집할 수 있습니다. 저장소·S3·CloudFront는 직접 변경하지 않습니다.</p>
          <dl class="counts"><div><dt>News</dt><dd>{{ state.news.length }}</dd></div><div><dt>International</dt><dd>{{ state.international.length }}</dd></div><div><dt>Domestic</dt><dd>{{ state.domestic.length }}</dd></div></dl>
          <div class="next-step"><strong>현재 가능한 작업</strong><p>뉴스·논문 초안 편집 → 검사 → JSON 검토 파일 내려받기. 실제 배포는 GitHub Actions에서 수동으로 실행합니다.</p><div class="overview-actions"><button class="secondary" @click="validateDraft">전체 검사</button><button class="primary" @click="downloadAllDrafts">전체 초안 내려받기</button></div></div>
        </div>
      </template>

      <template v-else-if="section === 'deployment'">
        <div class="deployment">
          <div class="deployment-draft">
            <div><p class="deployment-kicker">LOCAL DRAFT</p><h2>{{ dirty ? "게시 전 확인이 필요합니다." : "저장소와 동일합니다." }}</h2><p>{{ dirty ? checked && !validationErrors.length ? "검사를 통과한 초안입니다. 아래 게시 영역에서 공개할 수 있습니다." : "변경사항을 검사한 뒤 게시할 수 있습니다." : "현재 브라우저에 게시할 변경사항이 없습니다." }}</p></div>
            <div class="deployment-actions"><button class="secondary" type="button" @click="validateDraft">전체 검사</button><button class="secondary" type="button" @click="downloadAllDrafts">전체 JSON 내려받기</button><button class="danger" type="button" :disabled="!dirty" @click="resetDraft">초안 초기화</button></div>
          </div>
          <p v-if="message" class="deployment-feedback" role="status">{{ message }}</p>
          <ul v-if="checked && validationErrors.length" class="deployment-errors"><li v-for="error in validationErrors" :key="error">{{ error }}</li></ul>
          <p class="lead">게시 권한은 AWS 서버에만 있고, 이 브라우저에는 GitHub·AWS 비밀키가 저장되지 않습니다.</p>
          <template v-if="publishingConfigured">
            <div v-if="isAuthenticated" class="auth-state"><strong>로그인됨</strong><p>검사를 통과한 초안은 JSON 5개를 한 번에 커밋하고, 공개 홈페이지 배포를 자동으로 시작합니다.</p><button class="primary" :disabled="publishing || !dirty || !checked || validationErrors.length" @click="publishDraft">{{ publishing ? "게시 요청 중…" : dirty ? checked && !validationErrors.length ? "지금 게시" : "검사 후 게시 가능" : "게시할 변경 없음" }}</button></div>
            <form v-else class="login-form" @submit.prevent="signIn"><label>관리자 이메일<input v-model="loginEmail" type="email" autocomplete="username" required /></label><label>비밀번호<input v-model="loginPassword" type="password" autocomplete="current-password" required /></label><button class="primary" type="submit">로그인</button></form>
            <p v-if="loginMessage" class="notice" role="status">{{ loginMessage }}</p>
          </template>
          <template v-else>
            <strong>게시 연결을 준비 중입니다.</strong><p>GitHub App, AWS Cognito, 게시 API를 연결하면 이 화면에서 로그인 후 바로 게시할 수 있습니다.</p>
          </template>
        </div>
      </template>

      <template v-else>
        <p v-if="message" class="notice" role="status">{{ message }}</p>
        <p v-if="uploadMessage" class="notice upload-notice" role="status">{{ uploadMessage }}</p>
        <ul v-if="checked && validationErrors.length" class="validation-errors"><li v-for="error in validationErrors" :key="error">{{ error }}</li></ul>
        <div class="editor-grid">
          <section class="list-panel" aria-label="콘텐츠 목록">
            <div class="list-toolbar">
              <label><span class="search-icon" aria-hidden="true"></span><input ref="searchInput" v-model="query" type="search" placeholder="목록 검색" aria-label="목록 검색" /><kbd>/</kbd></label>
              <span class="list-count">{{ query ? `${matchingItemCount}/${currentItems.length}` : currentItems.length }}건</span>
            </div>
            <button v-for="(item, index) in currentItems" v-show="matchesQuery(item)" :key="item.index" class="content-row" :class="{ selected: selectedIndex === index }" :aria-pressed="selectedIndex === index" @click="selectItem(index)">
              <span class="item-index">{{ item.index }}</span><span><strong>{{ labelFor(item) }}</strong><small>{{ section === "news" ? item.date : section === "members" ? item.group : section === "alumni" ? item.description : section === "gallery" ? "갤러리 이미지" : `${item.year} · ${item.venue || "학회/저널 미입력"}` }}</small></span>
            </button>
            <p v-if="query && !matchingItemCount" class="empty-search">일치하는 항목이 없습니다.<br /><button type="button" @click="query = ''">검색어 지우기</button></p>
          </section>
          <section class="inspector">
            <div class="inspector-toolbar">
              <div class="mode-switch" aria-label="편집 화면 모드">
                <button type="button" :class="{ active: editorMode === 'edit' }" :aria-pressed="editorMode === 'edit'" @click="setEditorMode('edit')">EDIT</button>
                <button type="button" :class="{ active: editorMode === 'preview' }" :aria-pressed="editorMode === 'preview'" @click="setEditorMode('preview')">LIVE PREVIEW</button>
                <kbd>⌘⇧P</kbd>
              </div>
              <span class="autosave-state"><i aria-hidden="true"></i>AUTOSAVE</span>
              <div class="actions"><button class="secondary" type="button" @click="validateDraft">검사</button><button class="secondary" type="button" @click="downloadDraft">JSON 내려받기</button><button class="primary" type="button" @click="addItem"><span class="button-plus" aria-hidden="true">+</span>{{ section === "news" ? "새 뉴스 추가" : section === "members" ? "새 멤버 추가" : section === "alumni" ? "새 Alumni 추가" : section === "gallery" ? "새 사진 추가" : "새 논문 추가" }}</button></div>
            </div>
            <Transition name="panel-swap" mode="out-in">
              <form v-if="selected && editorMode === 'edit'" key="edit" class="edit-panel" @submit.prevent>
            <div class="form-head"><div><h2>{{ section === "news" ? "뉴스 편집" : section === "members" ? "멤버 편집" : section === "alumni" ? "Alumni 편집" : section === "gallery" ? "갤러리 편집" : "논문 편집" }}</h2><p>수정 내용은 즉시 로컬 초안에 저장됩니다.</p></div><button class="danger" type="button" @click="deleteItem">삭제</button></div>
            <div v-if="section === 'news'" class="fields">
              <label>번호<input v-model.number="selected.index" type="number" /></label><label>날짜<input v-model="selected.date" placeholder="Aug. 2026" /></label><label class="full">내용<textarea v-model="selected.content" rows="8" placeholder="뉴스 내용을 입력하세요."></textarea><small>현재 공개 사이트와 동일하게 HTML 강조·링크를 사용할 수 있습니다.</small></label>
            </div>
            <div v-else-if="section === 'members'" class="fields">
              <label>구분<select v-model="selected.group"><option v-for="group in memberGroups" :key="group" :value="group">{{ group }}</option></select></label><label>번호<input v-model.number="selected.index" type="number" /></label><label>영문 이름<input v-model="selected.name" /></label><label>한글 이름<input v-model="selected.nameKo" /></label><div class="asset-field full"><label>사진 주소</label><div class="asset-input"><input v-model="selected.image" type="url" placeholder="https://hyhccl.s3.ap-northeast-2.amazonaws.com/image/members/…" /><label class="upload-button">{{ uploadingAsset('member-image', 'image') ? '업로드 중…' : '사진 파일 올리기' }}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" :disabled="uploadingAsset('member-image', 'image')" @change="uploadAsset($event, 'member-image', 'image')" /></label></div><small>JPG, PNG, WEBP, GIF 파일을 선택하면 주소가 자동으로 입력됩니다.</small></div><label>이메일<input v-model="selected.email" type="email" /></label><div class="asset-field"><label>CV·개인 웹사이트</label><div class="asset-input"><input v-model="selected.link" type="url" placeholder="https://…" /><label class="upload-button">{{ uploadingAsset('member-cv', 'link') ? '업로드 중…' : 'CV PDF 올리기' }}<input type="file" accept="application/pdf,.pdf" :disabled="uploadingAsset('member-cv', 'link')" @change="uploadAsset($event, 'member-cv', 'link')" /></label></div><small>PDF를 올리면 기존 링크를 그 CV 주소로 바꿉니다.</small></div><label>표시 문구<input v-model="selected.note" placeholder="선택 사항" /></label><label>기타 설명<input v-model="selected.description" placeholder="선택 사항" /></label>
            </div>
            <div v-else-if="section === 'alumni'" class="fields">
              <label>번호<input v-model.number="selected.index" type="number" /></label><label>이름<input v-model="selected.name" placeholder="예: Hong Gil-dong" /></label><label class="full">소개·현재 소속<input v-model="selected.description" placeholder="예: MS 2026 (Currently @ …)" /></label><label class="full">개인 웹사이트·현재 소속 링크<input v-model="selected.link" type="url" placeholder="https://… (선택 사항)" /></label>
            </div>
            <div v-else-if="section === 'gallery'" class="fields">
              <label>번호<input v-model.number="selected.index" type="number" /></label><label class="full">설명<input v-model="selected.caption" placeholder="[2026.08] Event name" /></label><div class="asset-field full"><label>이미지 주소</label><div class="asset-input"><input v-model="selected.image" type="url" placeholder="https://…" /><label class="upload-button">{{ uploadingAsset('gallery', 'image') ? '업로드 중…' : '갤러리 사진 올리기' }}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" :disabled="uploadingAsset('gallery', 'image')" @change="uploadAsset($event, 'gallery', 'image')" /></label></div><small>JPG, PNG, WEBP, GIF 파일을 선택하면 갤러리 S3 경로를 자동으로 넣습니다.</small></div>
            </div>
            <div v-else class="fields">
              <label>번호<input v-model.number="selected.index" type="number" /></label><label>연도<input v-model.number="selected.year" type="number" /></label><label class="full">제목<input v-model="selected.title" /></label><label class="full">저자<input v-model="selected.author" /></label><label>학회·저널<input v-model="selected.venue" /></label><label>발행 정보<input v-model="selected.date" /></label><template v-for="[key, label] in publicationLinkFields" :key="key"><div v-if="['paper', 'slide', 'poster'].includes(key)" class="asset-field"><label>{{ label }}</label><div class="asset-input"><input v-model="selected.link[key]" type="url" placeholder="https://…" /><label class="upload-button">{{ uploadingAsset('publication', key) ? '업로드 중…' : 'PDF 올리기' }}<input type="file" accept="application/pdf,.pdf" :disabled="uploadingAsset('publication', key)" @change="uploadAsset($event, 'publication', key)" /></label></div><small>{{ selected.year }}년 폴더에 PDF를 올리고 링크를 자동으로 넣습니다.</small></div><label v-else>{{ label }}<input v-model="selected.link[key]" type="url" placeholder="https://…" /></label></template><label>수락률 (%)<input v-model.number="selected.acceptance_rate.AR" type="number" min="0" max="100" step="0.1" /></label><label>Oral 수락률 (%)<input v-model.number="selected.oral_acceptance_rate.AR" type="number" min="0" max="100" step="0.1" /></label><label>기타 수락률·통계 (%)<input v-model.number="selected.additional.AR" type="number" min="0" max="100" step="0.1" /></label><label class="checkbox-field"><input type="checkbox" :checked="hasKImpact(selected)" @change="toggleKImpact($event.target.checked)" />컴퓨터공학분야 우수국제학술대회</label><label>수상 종류<select :value="awardType(selected.award)" @change="setAwardType($event.target.value)"><option v-for="[value, label] in awardOptions" :key="value" :value="value">{{ label }}</option></select></label><label v-if="awardType(selected.award)">수상 인증 링크<input v-model="selected.award[awardType(selected.award)]" type="url" placeholder="https://…" /></label><label class="full">학술지·학회 등재 정보<textarea :value="kImpactText(selected)" @input="setKImpactText($event.target.value)" rows="3" placeholder="한 줄에 하나씩 입력하세요."></textarea><small>예: 컴퓨터공학분야 우수국제학술대회, SCI(E) Q1, KCI 등재 학술지</small></label><fieldset class="full"><legend>연구 태그</legend><button v-for="tag in tags" :key="tag" type="button" class="tag" :class="{ chosen: selected.tags?.includes(tag) }" @click="toggleTag(tag)">{{ tagLabels[tag] }}</button></fieldset>
            </div>
              </form>
              <section v-else-if="selected" key="preview" class="preview-panel" aria-label="공개 화면 미리보기">
                <div class="preview-toolbar">
                  <span>ACTUAL SITE VIEW <i aria-hidden="true"></i></span>
                  <div class="viewport-switch" aria-label="미리보기 너비">
                    <button type="button" :class="{ active: previewViewport === 'desktop' }" aria-label="데스크톱 미리보기" @click="previewViewport = 'desktop'"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="1" /><path d="M8 21h8M12 17v4" /></svg></button>
                    <button type="button" :class="{ active: previewViewport === 'mobile' }" aria-label="모바일 미리보기" @click="previewViewport = 'mobile'"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg></button>
                  </div>
                </div>
                <div class="public-preview-wrap" :class="{ 'is-mobile': previewViewport === 'mobile' }">
                  <article class="public-preview site-preview">
                    <header class="site-nav"><img class="site-logo" src="https://s3.ap-northeast-2.amazonaws.com/hcc.hanyang.ac.kr/image/hccl_logo(white+width_add).png" alt="HCC Lab" /><strong>HANYANG <em>HUMAN-CENTERED</em> COMPUTING LAB</strong><nav aria-label="공개 홈페이지 메뉴"><span>HOME</span><span>MEMBERS</span><span>PUBLICATIONS</span><span>COURSES</span><span>GALLERY</span></nav><i aria-hidden="true"></i></header>
                    <div v-if="section === 'news'" class="site-content site-news">
                      <h2 class="site-section-title">Recent News</h2>
                      <div class="site-news-row"><time>[{{ selected.date }}]&nbsp;</time><span v-html="selected.content"></span></div>
                    </div>
                    <div v-else-if="isPublication" class="site-content site-publication">
                      <h2 class="site-page-title">PUBLICATIONS</h2>
                      <section class="site-filter"><strong>TOPIC</strong><div><span class="site-topic active">Show All</span><span v-for="tag in selected.tags" :key="tag" class="site-topic">{{ tagLabels[tag] || tag }}</span></div></section>
                      <section class="site-filter"><strong>TYPE</strong><div><span class="site-topic type" :class="{ active: section === 'domestic' }">Domestic</span><span class="site-topic type" :class="{ active: section === 'international' }">International</span></div></section>
                      <h3 class="site-year">{{ selected.year }}</h3>
                      <div class="site-paper"><span>[{{ selected.index }}]&nbsp;</span><strong>{{ selected.title }}</strong><p>{{ selected.author }}</p><i>{{ selected.venue }}&nbsp;{{ selected.date }}</i><div class="site-paper-links"><a v-for="[key, label] in publicationLinkFields" v-show="selected.link?.[key]" :key="key" :href="selected.link[key]" target="_blank">[{{ label.replace(' 링크', '').replace('논문 PDF·공식', 'Paper') }}]</a></div><div class="site-paper-tags"><span v-for="tag in selected.tags" :key="tag">{{ tagLabels[tag] || tag }}</span></div></div>
                    </div>
                    <div v-else-if="section === 'members'" class="site-content site-members">
                      <h2>{{ selected.group }}</h2><div class="site-member-card"><img v-if="selected.image" :src="selected.image" :alt="selected.name" /><div v-else class="site-member-placeholder">{{ selected.name?.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() }}</div><strong>{{ selected.name }}</strong><span>{{ selected.nameKo }}</span><small v-if="selected.note">{{ selected.note }}</small><div><span v-if="selected.email" class="site-contact">✉</span><span v-if="selected.link" class="site-contact">↗</span></div></div>
                    </div>
                    <div v-else-if="section === 'alumni'" class="site-content site-alumni">
                      <h2>Alumni</h2><p><a v-if="selected.link" :href="selected.link" target="_blank">{{ selected.name.replace(/&nbsp;/g, '').trim() }}</a><strong v-else>{{ selected.name.replace(/&nbsp;/g, '').trim() }}</strong><span>&nbsp;|&nbsp; {{ selected.description }}</span></p>
                    </div>
                    <div v-else class="site-content site-gallery">
                      <div class="site-gallery-card"><img v-if="selected.image" :src="selected.image" :alt="selected.caption" /><div>{{ selected.caption }}</div></div>
                    </div>
                  </article>
                </div>
              </section>
            </Transition>
          </section>
        </div>
      </template>
    </section>
  </main>
</template>
