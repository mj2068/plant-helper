<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button>&lt;-</ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header> -->
    <ion-content :scroll-x="false" :scroll-y="false">
      <div id="image-container">
        <swiper :modules="modules" :zoom="true">
          <swiper-slide>
            <div class="swiper-zoom-container">
              <img :src="plantImageDataUrl" />
            </div>
          </swiper-slide>
        </swiper>

        <!-- swiper 9 web component implementation
        has glitches -->
        <!-- <swiper-container :zoom="true" :modules="modules">
          <swiper-slide>
            <div class="swiper-zoom-container">
              <img :src="plantImageDataUrl" />
            </div>
          </swiper-slide>
        </swiper-container> -->

        <ion-button fill="solid" color="dark" @click="goBack"
          ><ion-icon slot="icon-only" :icon="closeCircle"></ion-icon
        ></ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonPage,
  // IonHeader,
  // IonToolbar,
  // IonButtons,
  // IonBackButton,
  IonContent,
  IonButton,
  IonIcon,
  modalController,
} from "@ionic/vue";
import { closeCircle } from "ionicons/icons";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Zoom } from "swiper";

// swiper 9 web component implementation
// but, i found double click zooming is buggy
// import { register } from "swiper/element/bundle";
// register();

// Import Swiper styles
import "swiper/css";
import "swiper/css/zoom";

export default defineComponent({
  // setup() {},

  components: {
    IonPage,
    // IonHeader,
    // IonToolbar,
    // IonButtons,
    // IonBackButton,
    IonContent,
    IonButton,
    IonIcon,
    Swiper,
    SwiperSlide,
  },

  props: ["plantImageDataUrl"],
  data() {
    return {
      closeCircle,
      modules: [Zoom],
    };
  },

  computed: {},

  methods: {
    goBack() {
      modalController.dismiss(null, "cancel");
    },
  },

  mounted() {
    console.log("ImageModal - mounted");
  },
});
</script>

<style scoped lang="scss">
#image-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: lightgrey;
  // swiper-container {
  .swiper {
    width: 100%;
    height: 100%;

    img {
      object-fit: contain;
    }
  }

  ion-button {
    position: absolute;
    width: 56px;
    height: 56px;
    bottom: 15%;
    margin: 0px 0px 0px 0px;

    --border-radius: 50%;
    --padding-start: 0px;
    --padding-end: 0px;

    z-index: 1;

    opacity: 0.5;
    ion-icon {
      font-size: 56px;
    }
  }
}
</style>
