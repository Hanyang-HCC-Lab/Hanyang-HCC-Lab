<script>
import publicationData from "../publications.json";

export default {
  data() {
    return {
      publications: publicationData,
    };
  },

  methods: {
    // v-for문 안에서의 year 값에 따라서 publications data의 값을 가져오기 위해
    // (Filtering) 해당 methods 정의하여 사용
    filterByYear(arr, year) {
      return arr.filter(function (data) {
        return data.year === year;
      });
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
    <div class="mb-4" v-for="year in years" :key="year">
      <span style="font-size: 2rem">{{ year }}</span>

      <!-- Start Publications Form -->
      <div class="mb-4">
        <div
          v-for="paper in filterByYear(publications, year)"
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

          <!-- KImpact 존재하면 표출-->
          <span class="h7" style="color: red" v-if="paper.kImpact"
            ><br />[<span
              class="h7"
              style="color: red"
              v-html="paper.kImpact"
            ></span
            >]</span
          >

          <!-- Link 존재하면 표출-->
          <span class="h7" style="color: red" v-if="paper.link"
            ><span class="h7" v-if="paper.link.ACM"
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
            <span class="h7" v-if="paper.link.presentation"
              ><a
                :href="paper.link.presentation"
                target="_blank"
                style="color: rgba(115, 177, 235)"
                >[Presentation video]</a
              ></span
            >
          </span>
          <br />
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
      </div>
      <!-- End Publications Form -->
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Didact+Gothic&display=swap");

.paper-tag {
  font-family: "Didact Gothic", sans-serif;
  color: black;
  display: inline-block;
  font-weight: 600;
  line-height: 1.5;
  min-width: 2rem;

  text-align: center;
  text-decoration: none;
  vertical-align: middle;

  /* border: 1px solid transparent; */
  margin-left: 0.15rem;
  padding: 0.25rem 0.25rem;
  font-size: 0.7rem;
  border-radius: 0.5rem;
}
</style>