<template>
  <div id="wrap">
    <Nav :page="this.page" @changePage="changePage" />
    <transition name="fade">
      <MainPage v-show="page === 'MainPage'" />
    </transition>
    <transition name="fade">
      <Members v-show="page === 'Members'" />
    </transition>
    <transition name="fade">
      <Publications v-show="page === 'Publications'" />
    </transition>
    <transition name="fade">
      <Courses v-show="page === 'Courses'" />
    </transition>
    <!-- <button @click="changePage('Members')">CHANGE</button> -->
    <Footer />
  </div>
</template>

<style scoped>
#wrapper {
  min-height: 100%;
  position: relative;
  padding-bottom: 180px;
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

<script>
import Nav from "./base/Nav.vue";
import Footer from "./base/Footer.vue";
import MainPage from "./MainPage.vue";
import Members from "./Members.vue";
import Publications from "./Publications.vue";
import Courses from "./Courses.vue";

export default {
  components: {
    Nav,
    Footer,
    MainPage,
    Members,
    Publications,
    Courses,
  },

  data() {
    // 최초 default page에 대한 선언 (문자열로 page 변수에 선언)
    return {
      page: "MainPage",
      scrollTarget: "null",
      // page: "Courses",
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