<script setup>
import Nav from "./base/Nav.vue";
import Footer from "./base/Footer.vue";
import MainPage from "./MainPage.vue";
</script>

<template>
  <div id="wrap">
    <Nav />
    <MainPage />
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