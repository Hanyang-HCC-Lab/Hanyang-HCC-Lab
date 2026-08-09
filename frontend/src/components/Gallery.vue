<script>
import gallery from "../gallery.json";

export default {
  data() {
    return { gallery };
  },
};
</script>

<template>
  <div class="container mt-5 text-center" style="width: 100%">
    <div class="row">
      <div v-for="item in gallery" :key="item.index" class="col-md-4 text-center mb-3">
        <div class="card img-wrapper">
          <img :src="item.image" :alt="item.caption" style="max-height: 20rem" />
          <div class="card-body">
            <span class="h6 card-text">{{ item.caption }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.img-wrapper { position: relative; width: 95%; height: 25rem; max-height: 95%; }
img { top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; margin: auto; }
</style>
