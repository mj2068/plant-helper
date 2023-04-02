<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button
            slot="secondary"
            @click="ionRouter.navigate('/home', 'root')"
          >
            首页
          </ion-button>

          <ion-button @click="save">保存</ion-button>
        </ion-buttons>
        <ion-title>添加植物</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container" class="ion-padding">
        <div id="image-container">
          <ion-card>
            <img :src="plantImgUriWithPlaceholder" alt="植物图片" srcset="" />
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
        <ion-button @click="deleteImage" :disabled="plantImgUri === ''"
          >DELETE IMAGE</ion-button
        >
        <!-- <ion-button @click="test">test</ion-button> -->
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
  },

  ionViewDidEnter() {
    console.log("AddPage - ionViewDidEnter");
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

  computed: {
    plantImgUriWithPlaceholder() {
      return this.plantImgUri === "" ? star : this.plantImgUri;
    },
  },

  methods: {
    // async test() {},

    async save() {
      console.log("AddPage - save");

      let base64Data: string;
      const response = await fetch(this.plantImgUri);
      const blob = await response.blob();
      console.log(blob);
      base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
      // console.log(base64Data);

      const createdDate = Date.now();
      const filename = createdDate + ".jpeg";
      await Filesystem.writeFile({
        path: "images/" + filename,
        data: base64Data,
        directory: Directory.Data,
        recursive: true,
      });

      const fileResult = await Filesystem.readFile({
        path: "appconfig.json",
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      console.log(fileResult);

      const fileData = JSON.parse(fileResult.data);
      console.log(fileData);
      let plantId: number;
      if (fileData.plantList.length === 0) {
        plantId = 0;
      } else {
        plantId =
          (fileData.plantList[fileData.plantList.length - 1].plantId || 0) + 1;
      }
      fileData.plantList.push({
        plantId,
        plantCreatedDate: createdDate,
        plantName: this.plantName,
        plantDescription: this.plantDescription,
        // plantImgUri: this.plantImgUri,
        plantImgFilename: filename,
      });
      console.log(fileData.plantList);
      await Filesystem.writeFile({
        path: "appconfig.json",
        directory: Directory.Data,
        encoding: Encoding.UTF8,
        data: JSON.stringify(fileData),
      });

      this.ionRouter.navigate("/home", "root");
    },

    async openCamera() {
      console.log(await Camera.checkPermissions());
      const image = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        promptLabelHeader: "图片来源",
        promptLabelPhoto: "相册",
        promptLabelPicture: "拍照",
        promptLabelCancel: "取消",
        // allowEditing: true,
        // saveToGallery: true,
      });

      console.log(image);
      this.plantImgUri = image.webPath || "";
    },

    deleteImage() {
      console.log("AddPage - deleteImage");
      this.plantImgUri = "";
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
  background-color: orange;
  display: flex;
  justify-content: center;
  align-items: center;
}
#image-container img {
  background-color: #ccc;
  object-fit: contain;
  width: 90%;
  height: 90%;
}
</style>
