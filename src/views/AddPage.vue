<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-button
          slot="secondary"
          @click="ionRouter.navigate('/home', 'root', undefined)"
          >home</ion-button
        >
        <ion-buttons slot="primary">
          <ion-button>保存</ion-button>
        </ion-buttons>
        <ion-title>添加植物</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div>
        <ion-button> 添加 </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonButton,
  IonBackButton,
  IonIcon,
  useIonRouter,
  createAnimation,
} from "@ionic/vue";
import { star } from "ionicons/icons";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonButton,
    IonBackButton,
    IonIcon,
  },

  mounted() {
    console.log("AddPage - mounted");
  },

  data() {
    return { star, ionRouter: useIonRouter() };
  },

  ionViewDidEnter() {
    console.log("AddPage - ionViewDidEnter");
  },

  methods: {},
});
</script>
