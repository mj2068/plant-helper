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
        <div id="image-container">
          <ion-card>
            <img :src="plantImgUri" alt="植物图片" srcset="" />
          </ion-card>
        </div>
        <ion-list>
          <ion-item>
            <ion-label>名称</ion-label>
            <ion-input id="plant-name" v-model="plantName"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>描述</ion-label>
            <ion-input id="description" v-model="plantDescription"></ion-input>
          </ion-item>
        </ion-list>
        <ion-button @click="openCamera">CAMERA</ion-button>
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
  IonImg,
  useIonRouter,
  createAnimation,
} from "@ionic/vue";
import { star } from "ionicons/icons";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Camera, CameraResultType } from "@capacitor/camera";

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
    IonImg,
    Camera,
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
      plantImgUri: "",
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

    async openCamera() {
      console.log(await Camera.checkPermissions());
      const image = await Camera.getPhoto({
        quality: 80,
        // allowEditing: true,
        resultType: CameraResultType.Uri,
        promptLabelHeader: "图片来源",
        promptLabelPhoto: "相册",
        promptLabelPicture: "拍照",
      });

      console.log(image.webPath);
      this.plantImgUri = image.webPath || "";
    },
  },
});
</script>

<style scoped>
#image-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 200px;
}
#image-container ion-card {
  width: 80%;
}
#image-container img {
  background-color: red;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
