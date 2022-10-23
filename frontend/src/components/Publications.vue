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
    <div>
      <span style="font-size: 2rem">2022</span>
      <div
        v-for="paper in pub2022"
        :key="paper.index"
        class="item-content mt-3"
      >
        <span class="h5">[{{ paper.index }}]&nbsp;</span>
        <span class="h5">{{ paper.title }}</span
        ><br />
        <span class="h6">{{ paper.author }}</span
        ><br />
        <i>{{ paper.venue }}</i
        ><br />
        <!-- <span class="h6">{{ paper.tags }}</span
        ><br />
        <span class="h6">{{ paper.kImpact }}</span
        ><br /> -->
      </div>
    </div>
    <!-- End 2022 Publications -->

    <!-- Start 2021 Publications -->
    <div class="mt-5">
      <span style="font-size: 2rem">2021</span>
      <div
        v-for="paper in pub2021"
        :key="paper.index"
        class="item-content mt-3"
      >
        <span class="h5">[{{ paper.index }}]&nbsp;</span>
        <span class="h5">{{ paper.title }}</span
        ><br />
        <span class="h6">{{ paper.author }}</span
        ><br />
        <i>{{ paper.venue }}</i
        ><br />
        <!-- <span class="h6">{{ paper.tags }}</span
        ><br />
        <span class="h6">{{ paper.kImpact }}</span
        ><br /> -->
      </div>
    </div>
    <!-- End 2022 Publications -->
  </div>
</template>