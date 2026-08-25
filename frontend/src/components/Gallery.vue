<script>
import gallery from "../gallery.json";

export default {
  data() {
    return {
      gallery,
      activeImageByItem: {},
      touchStartByItem: {},
    };
  },
  methods: {
    itemImages(item) {
      const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
      return images.length ? images : item.image ? [item.image] : [];
    },
    activeImageIndex(item) {
      const images = this.itemImages(item);
      if (!images.length) return 0;
      const current = Number(this.activeImageByItem[item.index]) || 0;
      return Math.min(current, images.length - 1);
    },
    activeImage(item) {
      return this.itemImages(item)[this.activeImageIndex(item)] || "";
    },
    stepImage(item, direction) {
      const images = this.itemImages(item);
      if (images.length < 2) return;
      const next = (this.activeImageIndex(item) + direction + images.length) % images.length;
      this.activeImageByItem[item.index] = next;
    },
    handleTouchStart(item, event) {
      this.touchStartByItem[item.index] = event.changedTouches[0]?.clientX;
    },
    handleTouchEnd(item, event) {
      const start = this.touchStartByItem[item.index];
      const end = event.changedTouches[0]?.clientX;
      delete this.touchStartByItem[item.index];
      if (!Number.isFinite(start) || !Number.isFinite(end) || Math.abs(end - start) < 45) return;
      this.stepImage(item, end < start ? 1 : -1);
    },
  },
};
</script>

<template>
  <div class="container mt-5 text-center" style="width: 100%">
    <div class="row">
      <div v-for="item in gallery" :key="item.index" class="col-md-4 text-center mb-3">
        <div class="card img-wrapper">
          <div
            class="gallery-media"
            @touchstart.passive="handleTouchStart(item, $event)"
            @touchend.passive="handleTouchEnd(item, $event)"
          >
            <img :src="activeImage(item)" :alt="item.caption" loading="lazy" decoding="async" />
            <template v-if="itemImages(item).length > 1">
              <button
                class="gallery-nav gallery-nav-prev"
                type="button"
                :aria-label="`${item.caption} 이전 사진`"
                @click="stepImage(item, -1)"
              >
                ‹
              </button>
              <button
                class="gallery-nav gallery-nav-next"
                type="button"
                :aria-label="`${item.caption} 다음 사진`"
                @click="stepImage(item, 1)"
              >
                ›
              </button>
              <span class="gallery-count" aria-live="polite">
                {{ activeImageIndex(item) + 1 }} / {{ itemImages(item).length }}
              </span>
            </template>
          </div>
          <div class="card-body">
            <span class="h6 card-text">{{ item.caption }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.img-wrapper { position: relative; width: 95%; height: 25rem; max-height: 95%; overflow: hidden; }
.gallery-media { background: #eef0f2; flex: 0 0 20rem; height: 20rem; overflow: hidden; position: relative; }
.gallery-media img { display: block; height: 100%; margin: auto; object-fit: cover; width: 100%; }
.gallery-nav {
  align-items: center;
  background: rgba(10, 17, 28, .72);
  border: 1px solid rgba(255, 255, 255, .55);
  border-radius: 50%;
  color: #fff;
  display: flex;
  font-size: 1.75rem;
  height: 2.45rem;
  justify-content: center;
  line-height: 1;
  opacity: .9;
  padding: 0 0 .15rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: background-color 140ms ease, opacity 140ms ease, scale 140ms ease;
  width: 2.45rem;
}
.gallery-nav:hover, .gallery-nav:focus-visible { background: rgba(10, 17, 28, .92); opacity: 1; }
.gallery-nav:active { scale: .94; }
.gallery-nav:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.gallery-nav-prev { left: .75rem; }
.gallery-nav-next { right: .75rem; }
.gallery-count {
  background: rgba(10, 17, 28, .72);
  border-radius: 999px;
  bottom: .7rem;
  color: #fff;
  font-size: .72rem;
  font-variant-numeric: tabular-nums;
  left: 50%;
  letter-spacing: .03em;
  padding: .28rem .62rem;
  position: absolute;
  transform: translateX(-50%);
}

@media (hover: none) {
  .gallery-nav { height: 2.7rem; width: 2.7rem; }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-nav { transition: none; }
}
</style>
