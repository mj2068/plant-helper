<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button>&lt;-</ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header> -->
    <ion-content>
      <div id="image-container">
        <img :src="plantImageDataUrl" alt="" />
        <ion-button fill="clear" color="dark" @click="goBack"
          ><ion-icon slot="icon-only" :icon="closeCircleOutline"></ion-icon
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
import { closeCircleOutline } from "ionicons/icons";

export default defineComponent({
  components: {
    IonPage,
    // IonHeader,
    // IonToolbar,
    // IonButtons,
    // IonBackButton,
    IonContent,
    IonButton,
    IonIcon,
  },

  props: ["plantImageDataUrl"],
  data() {
    return {
      closeCircleOutline,
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

  // position: relatvie;

  img {
    height: 100%;
    object-fit: contain;
  }

  ion-button {
    position: absolute;
    width: 48px;
    height: 48px;
    bottom: 12%;
    margin: 0px 0px 0px 0px;

    --border-radius: 50%;
    --padding-start: 0px;
    --padding-end: 0px;

    ion-icon {
      font-size: 48px;
    }
  }
}
</style>
