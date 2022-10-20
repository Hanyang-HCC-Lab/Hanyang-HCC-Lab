<style scoped>
.footer {
  font: inherit;
  display: block;
  flex: none;
  background-color: #111;
  color: #a5a5a5;
  font-size: 0.875em;

  position: relative;
  left: 0;
  width: 100%;
}

.footerItem {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  color: #a5a5a5;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  flex: 33%;
}

.footerItem:last-child {
  text-align: right;
}

.wrap {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  color: #a5a5a5;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  max-width: 69rem;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: content-box;
  padding-top: 2rem;
  padding-bottom: 2rem;
  display: flex;
  font-weight: 300;
}

.linkWarning {
  color: #ffc800;
}
.linkWarning:hover,
.linkWarning:focus {
  color: #cca000;
}
</style>

<template>
  <footer class="footer pt-0 btn-dark">
    <div class="wrap">
      <div class="footerItem">
        <h2 class="linkWarning">Contact us</h2>
        <p>
          #507, Fusion Technology Center (FTC), <br />
          222, Wangsimni-ro, Seongdong-gu, <br />
          Seoul, Republic of Korea (04763) <br />
          © 2022. Hanyang HCC Lab. All rights reserved.
        </p>
      </div>

      <div class="footerItem"></div>

      <div class="footerItem">
        <img
          class="img-fluid mb-3 mr-1"
          style="height: 3.8rem"
          src="../../assets/lab_logo_white.png"
        />
        <img
          class="img-fluid mb-3 mr-1"
          style="height: 3.8rem"
          src="../../assets/hanyang_logo.png"
        />
      </div>
    </div>
  </footer>
</template>