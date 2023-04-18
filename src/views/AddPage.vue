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
            <img :src="plantImageWithPlaceholder" alt="植物图片" srcset="" />
          </ion-card>
        </div>
        <ion-list>
          <ion-item>
            <ion-label>名称</ion-label>
            <ion-input
              id="plant-name"
              placeholder="请输入植物名称"
              v-model="plantName"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>描述</ion-label>
            <ion-input id="description" v-model="plantDescription"></ion-input>
          </ion-item>
        </ion-list>
        <ion-button @click="getImage">CAMERA</ion-button>
        <ion-button @click="deleteImage" :disabled="plantImageDataUrl === ''"
          >DELETE IMAGE</ion-button
        >
        <ion-button @click="test">test</ion-button>
        <ion-button @click="test2">test2</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
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
} from "@ionic/vue";
import { star } from "ionicons/icons";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Camera, CameraResultType } from "@capacitor/camera";
import { getDateTime } from "@/composables/utils";
import type { AppConf, Plant } from "@/types";

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

  setup() {
    const { appConf, addPlant } = inject("appConf") as {
      appConf: AppConf;
      addPlant: (plant: Plant) => void;
    };

    return { appConf, addPlant };
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
      plantImageDataUrl: "",
    };
  },

  computed: {
    plantImageWithPlaceholder() {
      return this.plantImageDataUrl === "" ? star : this.plantImageDataUrl;
    },
  },

  methods: {
    // convert a path url to base64 data
    async webPathToBase64(path: string) {
      const response = await fetch(path);
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
    },

    async save() {
      console.log("AddPage - save");

      // get the created date time
      const datetime = getDateTime();
      // gnerate a file name
      const filename = datetime.dateTime + ".jpeg";
      // write image data to file
      if (this.plantImageDataUrl) {
        await Filesystem.writeFile({
          path: "images/" + filename,
          data: this.plantImageDataUrl,
          directory: Directory.Data,
          recursive: true,
        });
      }

      // increment id after the last exist entry, otherwise 0
      let plantId: number;
      if (this.appConf.plantList.length === 0) {
        plantId = 0;
      } else {
        plantId =
          this.appConf.plantList[this.appConf.plantList.length - 1].plantId + 1;
      }

      this.addPlant({
        plantId: plantId,
        plantName: this.plantName,
        plantDescription: this.plantDescription,
        plantImageFilename: filename,
        plantCreatedAt: datetime.date,
      });
      // navigate back to home page
      this.ionRouter.navigate("/home", "root");
    },

    // 获取图片，有两种模式可供选择：相册和拍照
    async getImage() {
      try {
        const photo = await Camera.getPhoto({
          quality: 50,
          resultType: CameraResultType.DataUrl,
          promptLabelHeader: "图片来源",
          promptLabelPhoto: "相册",
          promptLabelPicture: "拍照",
          promptLabelCancel: "取消",
          // allowEditing: true,
          // saveToGallery: true,
        });
        console.log(photo);
        this.plantImageDataUrl = photo.dataUrl || "";
      } catch (error) {
        console.error(error);
      }
    },

    deleteImage() {
      console.log("AddPage - deleteImage");
      this.plantImageDataUrl = "";
    },

    test() {
      console.log(this.appConf);
    },

    test2() {
      console.log("AddPage - test2");

      Filesystem.readFile({
        path: "1.json",
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      }).then((r) => {
        console.log(r);
        console.log(r.data);
        console.log(new Date(r.data).getDate());
      });
    },

    getDateTime: getDateTime,
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
