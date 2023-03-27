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
          <ion-button @click="save">保存</ion-button>
        </ion-buttons>
        <ion-title>添加植物</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container" class="ion-padding">
        <ion-item>
          <ion-label>名称</ion-label>
          <ion-input id="plant-name" v-model="plantName"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>描述</ion-label>
          <ion-input id="description" v-model="plantDescription"></ion-input>
        </ion-item>
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
  IonInput,
  IonLabel,
  IonContent,
  IonButton,
  IonBackButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  useIonRouter,
  createAnimation,
} from "@ionic/vue";
import { star } from "ionicons/icons";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonInput,
    IonLabel,
    IonContent,
    IonButton,
    IonBackButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
  },

  mounted() {
    console.log("AddPage - mounted");
  },

  data() {
    return {
      star,
      ionRouter: useIonRouter(),
      plantName: "",
      plantDescription: "",
    };
  },

  ionViewDidEnter() {
    console.log("AddPage - ionViewDidEnter");
  },

  methods: {
    async save() {
      console.log("AddPage - save");
      const file = await Filesystem.readFile({
        path: "appconfig.json",
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      console.log(file);

      const appConfig = JSON.parse(file.data);
      console.log(appConfig);
      appConfig.plantList.push({
        plantName: this.plantName,
        plantDescription: this.plantDescription,
      });
      await Filesystem.writeFile({
        path: "appconfig.json",
        directory: Directory.Data,
        encoding: Encoding.UTF8,
        data: JSON.stringify(appConfig),
      });
    },
  },
});
</script>
