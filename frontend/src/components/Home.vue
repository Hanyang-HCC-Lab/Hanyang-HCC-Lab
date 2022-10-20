<script setup>
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark fixed-top bg-secondary"
    id="mainNav"
  >
    <div class="container">
      <a class="navbar-brand" href="#page-top"
        ><img
          style="width: 3rem; height: auto"
          src="../assets/navbar-logo.png"
          alt="..."
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
        <p class="fs-3 secondary">Hanyang Human-Centered Computing Lab</p>
        <ul class="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
          <li class="nav-item"><a class="nav-link" href="#">Research</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Members</a></li>
          <li class="nav-item">
            <a class="nav-link" href="#">Publications</a>
          </li>
          <li class="nav-item"><a class="nav-link" href="#">Courses</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Gallery</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>