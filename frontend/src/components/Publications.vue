<script>
import publicationData from "../publications.json";

export default {
  data() {
    return {
      publications: publicationData,
    };
  },

  computed: {
    pub2017: function () {
      return this.publications.filter(function (data) {
        return data.year === 2017;
      });
    },
    pub2018: function () {
      return this.publications.filter(function (data) {
        return data.year === 2018;
      });
    },
    pub2019: function () {
      return this.publications.filter(function (data) {
        return data.year === 2019;
      });
    },
    pub2020: function () {
      return this.publications.filter(function (data) {
        return data.year === 2020;
      });
    },
    pub2021: function () {
      return this.publications.filter(function (data) {
        return data.year === 2021;
      });
    },
    pub2022: function () {
      return this.publications.filter(function (data) {
        return data.year === 2022;
      });
    },
  },
};
</script>

<template>
  <!-- <div>
    <li class="" v-for="item in pub2017" :key="item.index">
      <div class="category_img" :id="item.index">
        <img :src="item.image_url" />
        <p>{{ item.title }}</p>
      </div>
    </li>
  </div> -->

  <div class="container mt-5" style="width: 75%">
    <!-- Start 2022 Publications -->
    <div class="mb-4">
      <span style="font-size: 2rem">2022</span>
      <div
        v-for="paper in pub2022"
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
    <!-- End 2022 Publications -->

    <!-- Start 2021 Publications -->
    <div class="mb-4">
      <span style="font-size: 2rem">2021</span>
      <div
        v-for="paper in pub2021"
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
    <!-- End 2021 Publications -->

    <!-- Start 2020 Publications -->
    <div class="mb-4">
      <span style="font-size: 2rem">2020</span>
      <div
        v-for="paper in pub2020"
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
    <!-- End 2020 Publications -->

    <!-- Start 2019 Publications -->
    <div class="mb-4">
      <span style="font-size: 2rem">2019</span>
      <div
        v-for="paper in pub2019"
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
    <!-- End 2019 Publications -->

    <!-- Start 2018 Publications -->
    <div class="mb-4">
      <span style="font-size: 2rem">2018</span>
      <div
        v-for="paper in pub2018"
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
    <!-- End 2018 Publications -->

    <!-- Start 2017 Publications -->
    <div class="mb-4">
      <span style="font-size: 2rem">2017</span>
      <div
        v-for="paper in pub2017"
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
    <!-- End 2017 Publications -->
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