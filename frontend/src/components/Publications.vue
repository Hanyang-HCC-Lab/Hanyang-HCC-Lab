<script>
import publicationInternational from "../publications.json";
import publicationDomestic from "../publications_domestic.json";

// https://s3.ap-northeast-2.amazonaws.com/hcc.hanyang.ac.kr/contents/publications.json

export default {
  data() {
    return {
      publications: publicationInternational,
      pubInternational: publicationInternational,
      pubDomestic: publicationDomestic,
      showTopic: "all",
      international: true,
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

    changeType() {
      if (this.international == true) {
        this.publications = this.pubDomestic;
      } else {
        this.publications = this.pubInternational;
      }

      this.international = !this.international;
    },

    changeTypeToTaget(targetType) {
      if (targetType == "domestic") {
        this.publications = this.pubDomestic;
        this.international = false;
      } else {
        this.publications = this.pubInternational;
        this.international = true;
      }
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
  <div class="container mt-4" style="width: 75%">
    <!-- Start Topic Filter -->
    <div
        class="mb-3"
        style="
          font-size: 1.9rem;
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 700;
        "
      >
      PUBLICATIONS 
      <span>
              <a
                type="button"
                class="mb-1 btn btn-circle btn-dark btn-sm me-1"
                href="https://scholar.google.co.kr/citations?hl=en&user=9c9apWIAAAAJ"
                target="_blank"
                style="border-radius: 3rem;"
              >
                <font-awesome-icon icon="fa-solid fa-graduation-cap" size="xs" />
              </a>
      </span>
      <span>
              <a
                type="button"
                class="mb-1 btn btn-circle btn-dark btn-sm me-1"
                href="https://www.youtube.com/@hanyanghuman-centeredcomputing"
                target="_blank"
                style="border-radius: 3rem;"
              >
                <font-awesome-icon icon="fa-solid fa-video" size="xs" />
              </a>
      </span>
      </div>
    <div class="mb-3" style="width: 100%">
      <div
        class=""
        style="
          font-size: 1.5rem;
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 700;
        "
      >
        TOPIC
      </div>
      <div>
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: showTopic === 'all' }"
          style="background-color: rgba(89, 155, 210)"
          v-on:click="changeTopic('all')"
        >
          Show All
        </label>
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: showTopic === 'hai' }"
          style="background-color: rgba(176, 226, 246)"
          v-on:click="changeTopic('hai')"
        >
          Human-AI Interaction
        </label>
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: showTopic === 'vr' }"
          style="background-color: rgba(195, 195, 247)"
          v-on:click="changeTopic('vr')"
          >VR/AR/XR</label
        >
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: showTopic === 'dm' }"
          style="background-color: rgba(250, 210, 182)"
          v-on:click="changeTopic('dm')"
          >Data Mining</label
        >
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: showTopic === 'fashion' }"
          style="background-color: rgba(150, 245, 201)"
          v-on:click="changeTopic('fashion')"
          >Fashion</label
        >
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: showTopic === 'social' }"
          style="background-color: rgba(247, 194, 230)"
          v-on:click="changeTopic('social')"
          >Social Computing</label
        >
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: showTopic === 'health' }"
          style="background-color: rgba(217, 236, 179)"
          v-on:click="changeTopic('health')"
          >Digital Health</label
        >
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: showTopic === 'cv' }"
          style="background-color: rgba(238, 237, 164)"
          v-on:click="changeTopic('cv')"
          >Computer Vision</label
        >
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: showTopic === 'nlp' }"
          style="background-color: rgba(180, 235, 40)"
          v-on:click="changeTopic('nlp')"
          >Natural Language Processing</label
        >
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: showTopic === 'safety' }"
          style="background-color: rgba(255, 178, 190)"
          v-on:click="changeTopic('safety')"
          >AI Safety</label
        >
      </div>
    </div>
    <!-- Pub Type (Domestic/International) -->
    <div class="mb-5" style="display: inline-block">
      <div
        class=""
        style="
          font-size: 1.5rem;
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 700;
          <!-- float: right; -->
          margin-right: 1rem;
        "
      >
        TYPE
      </div>
      <div>
        <!-- <label
          class="paper-tag paper-tag-button clicked_button_border"
          style="float: right; background-color: rgba(150, 200, 150)"
          v-on:click="changeType()"
        >
          <span v-show="international" style="font-weight: bold"
            >International</span
          >
          <span v-show="!international" style="font-weight: bold"
            >Domestic</span
          >
        </label> -->
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: international === false }"
          style="float: right; background-color: rgba(150, 200, 150)"
          v-on:click="changeTypeToTaget('domestic')"
        >
          <span style="font-weight: bold">Domestic</span>
        </label>
        <label
          class="paper-tag paper-tag-button"
          :class="{ clicked_button_border: international === true }"
          style="float: right; background-color: rgba(150, 200, 150)"
          v-on:click="changeTypeToTaget('international')"
        >
          <span style="font-weight: bold">International</span>
        </label>
      </div>
    </div>

    <!-- End Topic Filter -->
    <div class="mb-4" v-for="year in years" :key="year">
      <!-- filterByYear 함수가 return하는 array의 길이를 이용하여, 년도 별로 논문 수가 0인 경우 Year 표출 X -->
      <span
        style="
          font-size: 2rem;
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 700;
        "
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
            >
            <v v-if="paper.venue"><br /></v>
            <i>{{ paper.venue }}</i>&nbsp;<i>{{ paper.date }}</i>
            

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
            <span class="h7" style="color: #a9a9a9" v-if="paper.acceptance_rate"
              ><i>
                Acceptance Rate:
                <span
                  class="h7"
                  style="color: #a9a9a9"
                  v-html="paper.acceptance_rate.AR"
                ></span
                >%</i
              >
            </span>
            <!-- Oral AR 존재하면 표출-->
            <!-- AR 값이 존재하고 0보다 클 때 -->
            <span class="h7" style="color: #a9a9a9" v-if="paper.oral_acceptance_rate && paper.oral_acceptance_rate.AR > 0">
              <i>
                <span style="color: black;"> Accepted as Oral Presentation</span>
                (<span class="h7" style="color: #a9a9a9" v-html="paper.oral_acceptance_rate.AR"></span>% acceptance rate for oral-presentation papers)
              </i>
            </span>

            <!-- AR 값이 0일 때 -->
            <span class="h7" style="color: #a9a9a9" v-else-if="paper.oral_acceptance_rate && paper.oral_acceptance_rate.AR === 0">
              <i><span style="color: black;">[Accepted as Oral Presentation]</span></i>
            </span>

            
            <!-- Award 존재하면 표출-->
            <span class="h7" style="color: #999900" v-if="paper.award">
              <br />
              <!-- <font-awesome-icon icon="fas fa-medal" size="xs" /> -->
              <font-awesome-icon icon="fas fa-trophy" size="xs" />
              <span class="h7" v-if="paper.award.best_paper"
                ><a
                  :href="paper.award.best_paper"
                  target="_blank"
                  style="color: #999900"
                  > Best Paper Award</a
                ></span
              >

              <span class="h7" v-if="paper.award.grand_paper"
                ><a
                  :href="paper.award.grand_paper"
                  target="_blank"
                  style="color: #999900"
                  > Grand Paper Award</a
                ></span
              >

              <span class="h7" v-if="paper.award.honorable_mention"
                ><a
                  :href="paper.award.honorable_mention"
                  target="_blank"
                  style="color: #999900"
                  > Honorable Mention Award</a
                ></span
              >

              <span class="h7" v-if="paper.award.best_presentation"
                ><a
                  :href="paper.award.best_presentation"
                  target="_blank"
                  style="color: #999900"
                  > Best Presentation Award</a
                ></span
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

              <span class="h7" v-if="paper.link.DOI"
                ><a
                  :href="paper.link.DOI"
                  target="_blank"
                  style="color: rgba(115, 177, 235)"
                  >[DOI]</a
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

              <span class="h7" v-if="paper.link.ACL"
                ><a
                  :href="paper.link.ACL"
                  target="_blank"
                  style="color: rgba(115, 177, 235)"
                  >[ACL Anthology]</a
                ></span
              >

              <span class="h7" v-if="paper.link.ECVA"
                ><a
                  :href="paper.link.ECVA"
                  target="_blank"
                  style="color: rgba(115, 177, 235)"
                  >[ECVA DL]</a
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

              <span class="h7" v-if="paper.link.poster"
                ><a
                  :href="paper.link.poster"
                  target="_blank"
                  style="color: rgba(115, 177, 235)"
                  >[Poster]</a
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
                <label
                  class="paper-tag"
                  v-if="tag === 'nlp'"
                  style="background-color: rgba(180, 235, 40)"
                  >Natural Language Processing</label
                >
                <label
                  class="paper-tag"
                  v-if="tag === 'safety'"
                  style="background-color: rgba(255, 178, 190)"
                  >AI Safety</label
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

.clicked_button_border {
  border: 1.75px solid rgba(1, 1, 1);
}
</style>