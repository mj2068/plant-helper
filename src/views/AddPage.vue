<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button> 111</ion-back-button>
        </ion-buttons>
        <ion-title>添加植物</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div>
        <ion-button>添加</ion-button>
        <p>{{ message }}</p>
        <p>{{ messageFromSetup }}</p>
        <span>{{ count }}</span>
        <ion-button @click="count++">increment</ion-button>
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
} from "@ionic/vue";
import { alertController } from "@ionic/core";
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
  },

  setup() {
    const message = ref("hello world");
    const count = ref(100);
    return {
      messageFromSetup: message,
      count,
    };
  },

  mounted() {
    console.log("AddPage - mounted");
  },

  data() {
    return {
      message: "添加一个植物",
    };
  },

  ionViewDidEnter() {
    console.log("AddPage - ionViewDidEnter");
    this.presentAlert();
  },

  methods: {
    async presentAlert() {
      const alert = await alertController.create({
        //   header?: string;
        //   subHeader?: string;
        //   message?: string | IonicSafeString;
        //   cssClass?: string | string[];
        //   inputs?: AlertInput[];
        //   buttons?: (AlertButton | string)[];
        //   backdropDismiss?: boolean;
        //   translucent?: boolean;
        //   animated?: boolean;
        //   htmlAttributes?: AlertAttributes;
        //   mode?: Mode;
        //   keyboardClose?: boolean;
        //   id?: string;
        //   enterAnimation?: AnimationBuilder;
        //   leaveAnimation?: AnimationBuilder;
      });
      await alert.present();
      const result = await alert.onDidDismiss();
      console.log(result);
    },
  },
});
</script>
