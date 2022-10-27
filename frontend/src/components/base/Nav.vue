<style>
@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@500&family=IBM+Plex+Sans:wght@600&display=swap");
</style>
<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark fixed-top bg-black"
    id="mainNav"
    style="height: 5.5rem"
  >
    <div class="container">
      <a class="navbar-brand" style="width: 3rem"
        ><img
          style="width: 100%; height: auto"
          src="https://s3.ap-northeast-2.amazonaws.com/hcc.hanyang.ac.kr/image/hccl_logo(white+width_add).png"
          @click.self="$emit('changePage', 'MainPage')"
      /></a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        Menu
        <i class="fas fa-bars ms-1"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <p
          class="fs-3"
          style="
            margin: 0;
            color: white;
            font-family: 'IBM Plex Sans', sans-serif;
          "
        >
          HANYANG
          <span style="color: rgba(253, 193, 58)">HUMAN-CENTERED</span>
          COMPUTING LAB
        </p>
        <ul class="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
          <li class="nav-item">
            <a
              class="nav-link"
              @click.self="$emit('changePage', 'MainPage')"
              data-bs-toggle="collapse"
              data-bs-target=".navbar-collapse.show"
              >Home</a
            >
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link" href="/main/research.html">Research</a>
          </li> -->
          <li class="nav-item">
            <a
              class="nav-link"
              @click.self="$emit('changePage', 'Members')"
              data-bs-toggle="collapse"
              data-bs-target=".navbar-collapse.show"
              >Members</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              @click.self="$emit('changePage', 'Publications')"
              data-bs-toggle="collapse"
              data-bs-target=".navbar-collapse.show"
              >Publications</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              @click.self="$emit('changePage', 'Courses')"
              data-bs-toggle="collapse"
              data-bs-target=".navbar-collapse.show"
              >Courses</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              @click.self="$emit('changePage', 'Gallery')"
              data-bs-toggle="collapse"
              data-bs-target=".navbar-collapse.show"
              >Gallery</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    page: String,
    changePage: Function,
  },
};
</script>

<style scoped>
.nav-link {
  color: white;
}
</style>