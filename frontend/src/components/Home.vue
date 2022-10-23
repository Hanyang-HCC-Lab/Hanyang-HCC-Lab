<template>
  <div id="wrap">
    <Nav :page="this.page" @changePage="changePage" />
    <MainPage v-if="page === 'MainPage'" />
    <Members v-if="page === 'Members'" />
    <Publications v-if="page === 'Publications'" />
    <button @click="changePage('Members')">CHANGE</button>
    <Footer />
  </div>
</template>

<style scoped>
#wrapper {
  min-height: 100%;
  position: relative;
  padding-bottom: 180px;
}
</style>

<script>
import Nav from "./base/Nav.vue";
import Footer from "./base/Footer.vue";
import MainPage from "./MainPage.vue";
import Members from "./Members.vue";
import Publications from "./Publications.vue";

export default {
  components: {
    Nav,
    Footer,
    MainPage,
    Members,
    Publications,
  },

  data() {
    // 최초 default page에 대한 선언 (문자열로 page 변수에 선언)
    return {
      // page: "MainPage",
      scrollTarget: "null",
      page: "Publications",
    };
  },

  methods: {
    changePage(value) {
      this.page = value;
      this.scrollingTop(); //Page 이동시 top scrolling
    },
    scrollingTop() {
      scrollTo({ top: 0, behavior: "smooth" });
    },
  },

  mounted() {
    this.scrollTarget = document.querySelector("#wrap");
  },
};
</script>