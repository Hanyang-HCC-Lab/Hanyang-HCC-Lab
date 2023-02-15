<script>
import publicationData from "../publications.json";

// https://s3.ap-northeast-2.amazonaws.com/hcc.hanyang.ac.kr/contents/publications.json

export default {
  data() {
    return {
      publications: publicationData,
      showTopic: "all",
    };
  },

  methods: {
    // v-for문 안에서의 year 값에 따라서 publications data의 값을 가져오기 위해
    // (Filtering) 해당 methods 정의하여 사용
    // filterByYear(arr, year) {
    //   return arr.filter(function (data) {
    //     return data.year === year;
    //   });
    // },

    filterByYear(arr, year, topic) {
      return arr.filter(function (data) {
        if (topic === "all") {
          // showTopic state가 'all'인 경우 (showTopic state default)
          return data.year === year; // year로만 분리
        } else {
          // showTopic state가 특정 topic으로 지정된 경우
          return data.year === year && data.tags.includes(topic); // year + 현재 state의 topic만 가져오기
        }
      });
    },

    changeTopic(targetTopic) {
      this.showTopic = targetTopic;
    },
  },

  computed: {
    years() {
      // publications가 포함하고 있는 총 연도를 모두 획득
      const year_arr = this.publications.map((data) => data.year);
      // Set으로 중복 제거
      return [...new Set(year_arr)];
    },
  },
};
</script>

<template>
  <div class="container mt-5" style="width: 75%">
    <!-- Start Topic Filter -->
    <span class="" style="font-size: 2rem">Topic</span>
    <div class="mb-5 mt-2">
      <label
        class="paper-tag paper-tag-button"
        style="background-color: rgba(89, 155, 210)"
        v-on:click="changeTopic('all')"
      >
        Show All
      </label>
      <label
        class="paper-tag paper-tag-button"
        style="background-color: rgba(176, 226, 246)"
        v-on:click="changeTopic('hai')"
      >
        Human-AI Interaction
      </label>
      <label
        class="paper-tag paper-tag-button"
        style="background-color: rgba(195, 195, 247)"
        v-on:click="changeTopic('vr')"
        >VR/AR/XR</label
      >
      <label
        class="paper-tag paper-tag-button"
        style="background-color: rgba(250, 210, 182)"
        v-on:click="changeTopic('dm')"
        >Data Mining</label
      >
      <!-- <label
        class="paper-tag paper-tag-button"
        style="background-color: rgba(238, 237, 164)"
        v-on:click="changeTopic('cv')"
        >Computer Vision</label
      > -->
      <label
        class="paper-tag paper-tag-button"
        style="background-color: rgba(150, 245, 201)"
        v-on:click="changeTopic('fashion')"
        >Fashion</label
      >
      <label
        class="paper-tag paper-tag-button"
        style="background-color: rgba(247, 194, 230)"
        v-on:click="changeTopic('social')"
        >Social Computing</label
      >
      <label
        class="paper-tag paper-tag-button"
        style="background-color: rgba(217, 236, 179)"
        v-on:click="changeTopic('health')"
        >Digital Health</label
      >
    </div>
    <!-- End Topic Filter -->
    <div class="mb-4" v-for="year in years" :key="year">
      <!-- filterByYear 함수가 return하는 array의 길이를 이용하여, 년도 별로 논문 수가 0인 경우 Year 표출 X -->
      <span
        style="font-size: 2rem"
        v-if="filterByYear(publications, year, showTopic).length"
        >{{ year }}</span
      >
      <!-- Start Publications Form -->
      <div class="mb-4">
        <transition-group name="fade">
          <div
            v-for="paper in filterByYear(publications, year, showTopic)"
            :key="paper.index"
            class="item-content mt-1 mb-2"
          >
            <span class="h5">[{{ paper.index }}]&nbsp;</span>
            <span v-if="paper.link" class="h5">
              <a
                v-if="paper.link.paper"
                :href="paper.link.paper"
                target="_blank"
                style="color: black; font-weight: bold"
                >{{ paper.title }}</a
              >
              <span
                v-if="!paper.link.paper"
                style="color: black; font-weight: bold"
                >{{ paper.title }}</span
              > </span
            ><span
              v-if="!paper.link"
              class="h5"
              style="color: black; font-weight: bold"
              >{{ paper.title }}</span
            ><br />
            <span class="h6">{{ paper.author }}</span
            ><br />
            <i>{{ paper.venue }}</i>

            <!-- KImpact 존재하면 표출-->
            <span class="h7" style="color: red" v-if="paper.kImpact"
              ><i
                >&nbsp;[<span
                  class="h7"
                  style="color: red"
                  v-html="paper.kImpact"
                ></span
                >]</i
              ></span
            >
            <!-- AR 존재하면 표출-->
            <span class="h7" style="color: #a9a9a9" v-if="paper.additional"
              ><i>
                Acceptance Rate:
                <span
                  class="h7"
                  style="color: #a9a9a9"
                  v-html="paper.additional.AR"
                ></span
                >%</i
              >
            </span>

            <!-- Link 존재하면 표출-->
            <span class="h7" style="color: red" v-if="paper.link">
              <br />
              <span class="h7" v-if="paper.link.ACM"
                ><a
                  :href="paper.link.ACM"
                  target="_blank"
                  style="color: rgba(115, 177, 235)"
                  >[ACM DL]</a
                ></span
              >

              <span class="h7" v-if="paper.link.IEEE"
                ><a
                  :href="paper.link.IEEE"
                  target="_blank"
                  style="color: rgba(115, 177, 235)"
                  >[IEEE DL]</a
                ></span
              >

              <span class="h7" v-if="paper.link.slide"
                ><a
                  :href="paper.link.slide"
                  target="_blank"
                  style="color: rgba(115, 177, 235)"
                  >[Slides]</a
                ></span
              >

              <span class="h7" v-if="paper.link.presentation"
                ><a
                  :href="paper.link.presentation"
                  target="_blank"
                  style="color: rgba(115, 177, 235)"
                  >[Video presentation]</a
                ></span
              >

              <span class="h7" v-if="paper.link.demo"
                ><a
                  :href="paper.link.demo"
                  target="_blank"
                  style="color: rgba(115, 177, 235)"
                  >[Demo video]</a
                ></span
              >

              <span class="h7" v-if="paper.link.media"
                ><a
                  :href="paper.link.media"
                  target="_blank"
                  style="color: rgba(115, 177, 235)"
                  >[Media]</a
                ></span
              >
            </span>

            <div class="mt-2">
              <span v-for="tag in paper.tags" :key="tag.id">
                <label
                  class="paper-tag"
                  v-if="tag === 'hai'"
                  style="background-color: rgba(176, 226, 246)"
                  >Human-AI Interaction</label
                >
                <label
                  class="paper-tag"
                  v-if="tag === 'vr'"
                  style="background-color: rgba(195, 195, 247)"
                  >VR/AR/XR</label
                >
                <label
                  class="paper-tag"
                  v-if="tag === 'dm'"
                  style="background-color: rgba(250, 210, 182)"
                  >Data Mining</label
                >
                <label
                  class="paper-tag"
                  v-if="tag === 'cv'"
                  style="background-color: rgba(238, 237, 164)"
                  >Computer Vision</label
                >
                <label
                  class="paper-tag"
                  v-if="tag === 'fashion'"
                  style="background-color: rgba(150, 245, 201)"
                  >Fashion</label
                >
                <label
                  class="paper-tag"
                  v-if="tag === 'social'"
                  style="background-color: rgba(247, 194, 230)"
                  >Social Computing</label
                >
                <label
                  class="paper-tag"
                  v-if="tag === 'health'"
                  style="background-color: rgba(217, 236, 179)"
                  >Digital Health</label
                >
              </span>
            </div>

            <br />
            <br />
          </div>
        </transition-group>
      </div>
      <!-- End Publications Form -->
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Didact+Gothic&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;1,100&display=swap");

.paper-tag {
  /* font-family: "Didact Gothic", sans-serif; */
  font-family: "Roboto:ital", sans-serif;
  color: black;
  display: inline-block;
  font-weight: 700;
  line-height: 1.5;
  min-width: 1rem;

  text-align: center;
  text-decoration: none;
  vertical-align: middle;

  margin-right: 0.15rem !important;
  margin-bottom: 0.15rem !important;
  /* border: 1px solid transparent; */
  padding: 0.35rem 0.35rem;
  font-size: 0.75rem;
  border-radius: 0.4rem;
}

.paper-tag-button {
  font-size: 0.9rem !important;
  margin-right: 0.5rem !important;
}

.paper-tag-button:hover {
  filter: saturate(400%);
}

.fade-enter-active {
  transition: opacity 0.8s ease;
}
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>