<script setup>
import { computed, ref, watch } from "vue";
import initialNews from "../../frontend/src/news.json";
import initialInternational from "../../frontend/src/publications.json";
import initialDomestic from "../../frontend/src/publications_domestic.json";
import initialMembers from "../../frontend/src/members.json";
import initialGallery from "../../frontend/src/gallery.json";

const STORAGE_KEY = "hcc-lab-admin-draft-v2";
const tags = ["hai", "vr", "dm", "fashion", "social", "health", "cv", "nlp", "safety"];
const tagLabels = {
  hai: "Human-AI Interaction", vr: "VR/AR/XR", dm: "Data Mining", fashion: "Fashion",
  social: "Social Computing", health: "Digital Health", cv: "Computer Vision",
  nlp: "Natural Language Processing", safety: "AI Safety",
};
const deepCopy = (value) => JSON.parse(JSON.stringify(value));
const sourceState = () => ({
  news: deepCopy(initialNews),
  international: deepCopy(initialInternational),
  domestic: deepCopy(initialDomestic),
  members: deepCopy(initialMembers.people),
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
function stateFromDraft(draft) {
  const baseline = sourceState();
  if (!draft || typeof draft !== "object" || Array.isArray(draft)) return baseline;

  return Object.fromEntries(
    Object.keys(baseline).map((key) => [key, Array.isArray(draft[key]) ? draft[key] : baseline[key]]),
  );
}

const initialState = stateFromDraft(storedDraft);

const section = ref("news");
const state = ref(initialState);
const selectedIndex = ref(0);
const message = ref(storedDraft ? "이 브라우저에 저장된 초안을 불러왔습니다." : "현재 홈페이지의 JSON 데이터를 불러왔습니다.");
const checked = ref(false);
const validationErrors = ref([]);

const navItems = [
  ["overview", "개요"], ["news", "소식"], ["international", "국제 논문"],
  ["domestic", "국내 논문"], ["members", "멤버"], ["gallery", "갤러리"], ["deployment", "배포"],
];
const isPublication = computed(() => ["international", "domestic"].includes(section.value));
const currentItems = computed(() => state.value[section.value] || []);
const selected = computed(() => currentItems.value[selectedIndex.value]);
const dirty = computed(() => JSON.stringify(state.value) !== JSON.stringify(sourceState()));

watch(state, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true });

function ensurePublication(item) {
  if (!item.link) item.link = {};
  if (!item.acceptance_rate) item.acceptance_rate = {};
  if (!item.award) item.award = {};
}

function chooseSection(next) {
  if (["international", "domestic"].includes(next)) {
    state.value[next].forEach(ensurePublication);
  }
  section.value = next;
  selectedIndex.value = 0;
  checked.value = false;
  validationErrors.value = [];
  message.value = next === "deployment"
      ? "실제 배포는 GitHub Actions에서 직접 실행합니다. 이 화면은 AWS 권한을 보유하지 않습니다."
    : "";
}

function selectItem(index) {
  if (isPublication.value) ensurePublication(currentItems.value[index]);
  selectedIndex.value = index;
}

function labelFor(item) {
  if (section.value === "news") return item.content.replace(/<[^>]*>/g, "").slice(0, 68);
  if (section.value === "members") return item.name;
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
    items.unshift({ index: max + 1, year: 2026, title: "새 논문 제목.", author: "", venue: "", date: "", tags: ["hai"], link: {}, acceptance_rate: {}, award: {} });
  } else if (section.value === "members") {
    state.value.members.push({ index: Date.now(), group: "M.S. Students", name: "New member", nameKo: "새 멤버", image: "", email: "", link: "" });
  } else if (section.value === "gallery") {
    state.value.gallery.unshift({ index: Date.now(), image: "", caption: "[2026.08] New gallery item" });
  }
  selectedIndex.value = 0;
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

  state.value.members.forEach((item, index) => {
    const label = `멤버 ${index + 1}`;
    if (!text(item.group) || !text(item.name) || !text(item.nameKo)) errors.push(`${label}: 구분과 이름을 확인하세요.`);
    if (!isWebAddress(item.image) || !isWebAddress(item.link)) errors.push(`${label}: 사진 또는 링크 주소가 올바르지 않습니다.`);
  });
  state.value.gallery.forEach((item, index) => {
    if (!text(item.caption) || !isWebAddress(item.image)) errors.push(`갤러리 ${index + 1}: 설명과 이미지 주소를 확인하세요.`);
  });

  validationErrors.value = errors;
  checked.value = true;
  message.value = errors.length
    ? `${errors.length}개의 확인 항목이 있습니다. 수정한 뒤 다시 검사하세요.`
    : "검사를 통과했습니다. JSON을 내려받아 검토하거나 GitHub 변경으로 옮길 수 있습니다.";
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
  const payload = currentItems.value;
  const filename = { news: "news.json", international: "publications.json", domestic: "publications_domestic.json", members: "members.json", gallery: "gallery.json" }[section.value];
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
  state.value = sourceState();
  selectedIndex.value = 0;
  checked.value = false;
  validationErrors.value = [];
  message.value = "초안을 초기화했습니다.";
}
</script>

<template>
  <main class="shell">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">H</span><span>HCC Lab</span></div>
      <nav aria-label="관리 메뉴">
        <button v-for="[key, label] in navItems" :key="key" class="nav-item" :class="{ active: section === key }" @click="chooseSection(key)">
          <span class="nav-indicator" aria-hidden="true"></span>{{ label }}
        </button>
      </nav>
      <div class="sidebar-foot">Content manager<br /><span>안전한 로컬 초안</span></div>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div>
          <p class="crumb">HCC Lab website</p>
          <h1>{{ section === "overview" ? "콘텐츠 관리" : navItems.find((item) => item[0] === section)?.[1] }}</h1>
        </div>
        <div class="draft-state"><span :class="{ changed: dirty }"></span>{{ dirty ? "변경된 로컬 초안" : "저장소 기준 데이터" }}</div>
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
          <p class="lead">실제 사이트 반영은 GitHub Actions에서만 실행됩니다. 이 관리자 화면은 AWS 자격 증명이나 GitHub 토큰을 보관하지 않습니다.</p>
          <ol><li>편집한 JSON을 내려받아 검토합니다.</li><li>검토된 변경을 저장소의 JSON 파일에 반영하고 GitHub에 푸시합니다.</li><li>GitHub Actions에서 먼저 <strong>dry-run</strong>을 실행합니다.</li><li>확인 후 <strong>deploy</strong>를 실행하면 S3 업로드와 CloudFront 캐시 갱신이 진행됩니다.</li></ol>
          <a class="primary action-link" href="https://github.com/Hanyang-HCC-Lab/Hanyang-HCC-Lab/actions/workflows/deploy-website.yml" target="_blank" rel="noreferrer">GitHub Actions 열기</a>
        </div>
      </template>

      <template v-else>
        <div class="content-head">
          <p>{{ section === "news" ? "홈페이지에 표시할 새 소식을 관리합니다." : section === "members" ? "사진·CV·개인 링크를 관리합니다." : section === "gallery" ? "S3 갤러리 이미지 주소와 설명을 관리합니다." : "논문 정보와 표시 태그를 관리합니다." }}</p>
          <div class="actions"><button class="secondary" @click="validateDraft">검사</button><button class="secondary" @click="downloadDraft">JSON 내려받기</button><button class="primary" @click="addItem">{{ section === "news" ? "새 뉴스 추가" : section === "members" ? "새 멤버 추가" : section === "gallery" ? "새 사진 추가" : "새 논문 추가" }}</button></div>
        </div>
        <p v-if="message" class="notice" role="status">{{ message }}</p>
        <ul v-if="checked && validationErrors.length" class="validation-errors"><li v-for="error in validationErrors" :key="error">{{ error }}</li></ul>
        <div class="editor-grid">
          <section class="list-panel" aria-label="콘텐츠 목록">
            <button v-for="(item, index) in currentItems" :key="item.index" class="content-row" :class="{ selected: selectedIndex === index }" @click="selectItem(index)">
              <span class="item-index">{{ item.index }}</span><span><strong>{{ labelFor(item) }}</strong><small>{{ section === "news" ? item.date : section === "members" ? item.group : section === "gallery" ? "갤러리 이미지" : `${item.year} · ${item.venue || "학회/저널 미입력"}` }}</small></span>
            </button>
          </section>
          <form v-if="selected" class="edit-panel" @submit.prevent>
            <div class="form-head"><div><h2>{{ section === "news" ? "뉴스 편집" : section === "members" ? "멤버 편집" : section === "gallery" ? "갤러리 편집" : "논문 편집" }}</h2><p>수정 내용은 즉시 로컬 초안에 저장됩니다.</p></div><button class="danger" type="button" @click="deleteItem">삭제</button></div>
            <div v-if="section === 'news'" class="fields">
              <label>번호<input v-model.number="selected.index" type="number" /></label><label>날짜<input v-model="selected.date" placeholder="Aug. 2026" /></label><label class="full">내용<textarea v-model="selected.content" rows="8" placeholder="뉴스 내용을 입력하세요."></textarea><small>현재 공개 사이트와 동일하게 HTML 강조·링크를 사용할 수 있습니다.</small></label>
            </div>
            <div v-else-if="section === 'members'" class="fields">
              <label>구분<input v-model="selected.group" placeholder="M.S. Students" /></label><label>번호<input v-model.number="selected.index" type="number" /></label><label>영문 이름<input v-model="selected.name" /></label><label>한글 이름<input v-model="selected.nameKo" /></label><label class="full">사진 주소<input v-model="selected.image" type="url" placeholder="https://…" /></label><label>이메일<input v-model="selected.email" type="email" /></label><label>CV·개인 웹사이트<input v-model="selected.link" type="url" placeholder="https://…" /></label><label class="full">표시 문구<input v-model="selected.note" placeholder="선택 사항" /></label>
            </div>
            <div v-else-if="section === 'gallery'" class="fields">
              <label>번호<input v-model.number="selected.index" type="number" /></label><label class="full">설명<input v-model="selected.caption" placeholder="[2026.08] Event name" /></label><label class="full">이미지 주소<input v-model="selected.image" type="url" placeholder="https://…" /></label>
            </div>
            <div v-else class="fields">
              <label>번호<input v-model.number="selected.index" type="number" /></label><label>연도<input v-model.number="selected.year" type="number" /></label><label class="full">제목<input v-model="selected.title" /></label><label class="full">저자<input v-model="selected.author" /></label><label>학회·저널<input v-model="selected.venue" /></label><label>발행 정보<input v-model="selected.date" /></label><label>논문 링크<input v-model="selected.link.paper" type="url" placeholder="https://…" /></label><label>ACM/공식 링크<input v-model="selected.link.ACM" type="url" placeholder="https://…" /></label><label>발표 영상<input v-model="selected.link.presentation" type="url" placeholder="https://…" /></label><label>슬라이드 PDF<input v-model="selected.link.slide" type="url" placeholder="https://…" /></label><label>포스터 PDF<input v-model="selected.link.poster" type="url" placeholder="https://…" /></label><label>수락률 (%)<input v-model.number="selected.acceptance_rate.AR" type="number" min="0" max="100" step="0.1" /></label><label class="full">수상·인증 링크<input v-model="selected.award.honorable_mention" type="url" placeholder="https://…" /></label><fieldset class="full"><legend>연구 태그</legend><button v-for="tag in tags" :key="tag" type="button" class="tag" :class="{ chosen: selected.tags?.includes(tag) }" @click="toggleTag(tag)">{{ tagLabels[tag] }}</button></fieldset>
            </div>
          </form>
        </div>
      </template>

      <footer class="publish-bar"><span>로컬 초안 · 아직 게시되지 않음</span><div><button class="text-button" @click="resetDraft">초안 초기화</button><button class="publish" disabled title="GitHub 자동 게시 연동 후 활성화됩니다.">게시 준비</button></div></footer>
    </section>
  </main>
</template>
