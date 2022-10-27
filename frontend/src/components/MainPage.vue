<script>
import news from "../news.json";

export default {
  data() {
    return {
      news: news,
    };
  },
};
</script>

<template>
  <div class="container">
    <div class="text-center">
      <img
        class="mb-3 mt-3"
        style="width: 100%; height: auto"
        src="https://hyhccl.s3.ap-northeast-2.amazonaws.com/image/HYU+FTC.webp"
        alt="..."
      />

      <h2
        class="font_2 mb-5"
        style="font-size: 19px; line-height: 1.2em; text-align: center"
      >
        <span
          style="
            font-family: din-next-w01-light, din-next-w02-light,
              din-next-w10-light, sans-serif;
          "
        >
          <span style="font-size: 19px">
            <span style="font-weight: bold">
              <span style="color: #1d5392">
                <span style="letter-spacing: 0.09em"
                  >We are looking for PhD and MS/PhD integrated
                  students!&nbsp;</span
                >
                <br />
                <span style="letter-spacing: 0.09em"
                  >We are especially interested in students who can build
                  systems and<br />
                  want to do HCI, VR or AI research (<span
                    style="text-decoration: underline"
                    ><a href="mailto:kyungsikhan@hanyang.ac.kr" target="_self"
                      >email us</a
                    ></span
                  >).
                </span></span
              ></span
            ></span
          ></span
        >
      </h2>

      <div style="width: 75%; text-align: center; margin: auto">
        <h2
          class="font_2 mb-5"
          style="
            font-size: 19px;
            line-height: 1.2em;
            letter-spacing: 0.09em;
            text-align: center;
          "
        >
          한양대학교 인텔리전스컴퓨팅학부, 인공지능학과, 인공지능융합대학원의
          인간 중심 컴퓨팅 연구실 (Human-Centered Computing Laboratory)에서는
          컴퓨터 기술, 인간 활동 및 사회 간의 관계를 연구하고, 결과를
          <br />해석하며, 사람에게 도움이 되는 기술 개발 및 디자인 관점을
          제시하는 연구를 활발히 진행하고 있습니다.
        </h2>
        <h2
          class="font_2 mb-5"
          style="
            font-size: 19px;
            line-height: 1.2em;
            letter-spacing: 0.09em;
            text-align: center;
          "
        >
          우리 연구실에서는 디자인, 컴퓨터과학, 사회과학, 심리학 등의 다양한
          방법론의 활용, 학제 간 연구 및 교육을 통해 <br />인간의 능력, 목표 및
          사회적 환경과 조화되고 향상되는 기술을 이해하고 개발하는 것을 목표로
          하고 있습니다.
        </h2>
        <h2
          class="font_2 mb-5"
          style="
            font-size: 19px;
            line-height: 1.2em;
            letter-spacing: 0.09em;
            text-align: center;
          "
        >
          다수의 국내외 대학과 공동 연구를 진행하고 있으며, 현재 진행 중인
          과제는
        </h2>
      </div>

      <h2 class="section-heading text-uppercase">
        <!-- <datagrid>연구실 소개</datagrid> -->
      </h2>
      <h3 class="section-subheading text-muted">
        <!-- 가나다라 마바사아 자차카타 파하 -->
      </h3>
    </div>

    <div class="row text-center" style="width: 75%; margin: auto">
      <div class="col-md-6">
        <div class="row">
          <div class="col-3" style="text-align: right">
            <img
              class="rounded-circle mt-3"
              src="https://static.wixstatic.com/media/e03b1d_b7b72a22d8e448f19557b8ae66b51e70~mv2.png/v1/crop/x_373,y_0,w_446,h_446/fill/w_70,h_70,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/2_ux.png"
              alt="2_ux.png"
              fetchpriority="high"
              style="width: 70px; height: 70px; object-fit: cover"
            />
          </div>
          <div class="col-9" style="text-align: left">
            <h4 class="my-3" style="margin-left: 0.5rem">
              Social Computing Research
            </h4>
            <p class="text-muted" style="margin-left: 0.5rem">
              social media big data 및 machine/deep learning 기반 사용자
              모델링(user modeling) 및 사회 현상(social phenomena)을 파악하는
              연구
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="row">
          <div class="col-3" style="text-align: right">
            <img
              class="rounded-circle mt-3"
              src="https://static.wixstatic.com/media/e03b1d_c3fc137c58ce43e39dce13b353ad0d1c~mv2.png/v1/crop/x_197,y_0,w_452,h_452/fill/w_70,h_70,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/3_study.png 2x"
              fetchpriority="high"
              style="width: 70px; height: 70px; object-fit: cover"
            />
          </div>
          <div class="col-9" style="text-align: left">
            <h4 class="my-3" style="margin-left: 0.5rem">Human-AI Research</h4>
            <p class="text-muted" style="margin-left: 0.5rem">
              도메인과 사용자에 따른 다양한 요소를 심리학, 사회학을 기반으로
              파악 하고, 인공지능 모델 구축에 활용하는 연구
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="row">
          <div class="col-3" style="text-align: right">
            <img
              class="rounded-circle mt-3"
              src="https://static.wixstatic.com/media/e03b1d_2c00f16730b8446d83c2f420cdced0c1~mv2.jpg/v1/crop/x_217,y_0,w_853,h_853/fill/w_70,h_70,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/1_ucd.jpg"
              alt="2_ux.png"
              fetchpriority="high"
              style="width: 70px; height: 70px; object-fit: cover"
            />
          </div>
          <div class="col-9" style="text-align: left">
            <h4 class="my-3" style="margin-left: 0.5rem">
              Mobile Computing Research
            </h4>
            <p class="text-muted" style="margin-left: 0.5rem">
              모바일(smartphone, wearable)기반 기술을 활용하여 사용자를 이해하고
              도움을 주기 위한 새로운 시스템을 개발하고, 수집된 이종 데이터를
              분석하는 연구
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="row">
          <div class="col-3" style="text-align: right">
            <img
              class="rounded-circle mt-3"
              src="https://static.wixstatic.com/media/e03b1d_0129a3d6a59e4e7a9f39ca3e5c9272bd~mv2.jpg/v1/crop/x_17,y_0,w_612,h_610/fill/w_70,h_70,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/4_VR.jpg"
              alt="2_ux.png"
              fetchpriority="high"
              style="width: 70px; height: 70px; object-fit: cover"
            />
          </div>
          <div class="col-9" style="text-align: left">
            <h4 class="my-3" style="margin-left: 0.5rem">
              Immersive Experience Research
            </h4>
            <p class="text-muted" style="margin-left: 0.5rem">
              가상 및 증강 환경에서 사용자 경험(user experience) 향상을 위한
              요소 발굴 및 기술 개발 연구
            </p>
          </div>
        </div>
      </div>
    </div>

    <h2
      class="font_2 mb-5 mt-3"
      style="
        font-size: 19px;
        line-height: 1.2em;
        letter-spacing: 0.09em;
        text-align: center;
      "
    >
      이 외에 다양한 분야에서의 AI + HCI 연구를 수행하고 있습니다.
    </h2>
    <div class="mb-5">
      <div class="text-center mb-4"><span class="h3">Recent News</span></div>
      <div v-for="news in news" :key="news.index" class="item-content mt-3">
        <span class="h6">[{{ news.date }}]&nbsp;</span>
        <span class="h6" v-html="news.content"></span>
      </div>
    </div>
  </div>
</template>