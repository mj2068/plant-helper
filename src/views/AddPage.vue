<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button @click="ionRouter.navigate('/home', 'root')">
            首页
          </ion-button>
          <ion-button @click="save">保存</ion-button>
        </ion-buttons>
        <ion-title>添加植物</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container" class="ion-padding">
        <div v-if="plantImageDataUrl" id="image-container">
          <ion-card class="">
            <ion-img :src="plantImageDataUrl" alt="植物图片" srcset="" />
            <ion-button
              id="delete-image-button"
              fill="solid"
              color="light"
              @click="deleteImage"
            >
              <ion-icon slot="icon-only" :icon="trashSharp"></ion-icon>
            </ion-button>
          </ion-card>
        </div>
        <div v-else id="no-image-container">
          <ion-card>
            <ion-button fill="clear" v-on:click="getImage"
              ><ion-icon slot="start" :icon="addCircleOutline"></ion-icon>
              添加图片
            </ion-button>
          </ion-card>
        </div>
        <ion-list>
          <ion-item>
            <ion-label>植物名称</ion-label>
            <ion-input
              id="plant-name"
              placeholder="请输入植物名称"
              v-model="plantName"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">植物描述</ion-label>
            <ion-textarea
              id="description"
              v-model="plantDescription"
              :auto-grow="true"
              placeholder="请输入植物的描述信息"
            ></ion-textarea>
          </ion-item>
        </ion-list>
        <!-- <ion-button @click="test">test</ion-button> -->
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
  IonCard,
  IonList,
  IonItem,
  IonTextarea,
  IonImg,
  IonIcon,
  useIonRouter,
} from "@ionic/vue";
import { star, addCircleOutline, trashSharp } from "ionicons/icons";
import { Filesystem, Directory } from "@capacitor/filesystem";
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
    IonCard,
    IonList,
    IonItem,
    IonTextarea,
    IonImg,
    IonIcon,
  },

  setup() {
    console.log("AddPage - setup");

    const { appData, addPlant } = inject("appData") as {
      appData: {
        appConf: AppConf;
      };
      addPlant: (plant: Plant) => void;
    };

    return { appData, addPlant };
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
      addCircleOutline,
      trashSharp,
      ionRouter: useIonRouter(),
      plantName: "",
      plantDescription: "",
      plantImageDataUrl: "",
    };
  },

  computed: {},

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
      // create a variable for image filename, if no image provided, it'll be empty
      let filename = "";
      // write image data to file
      if (this.plantImageDataUrl) {
        filename = datetime.dateTime + ".jpeg";
        const savedFileUri = await Filesystem.writeFile({
          path: "images/" + filename,
          data: this.plantImageDataUrl,
          directory: Directory.Data,
          recursive: true,
        });
        console.log("AddPage - save - saved uri:");
        console.log(savedFileUri.uri);
      }

      // increment id after the last exist entry, otherwise 0
      let plantId: number;
      if (this.appData.appConf.plantList.length === 0) {
        plantId = 0;
      } else {
        plantId =
          this.appData.appConf.plantList[
            this.appData.appConf.plantList.length - 1
          ].plantId + 1;
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
          // quality: 100,
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
      console.log("AddPage - test");
    },

    getDateTime: getDateTime,
  },
});
</script>

<style scoped lang="scss">
#image-container {
  // display: flex;
  // justify-content: center;
  // width: 100%;
  // max-height: 300px;

  ion-card {
    // height: 200px;
    max-height: 200px;
    // max-width: 100%;
    // overflow: hidden;
    // width: 80%;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    background-color: green;

    img,
    ion-img {
      width: 100%;
      max-height: 200px;
      // max-width: 200px;
      // max-height: 200px;
      object-fit: cover;
      // object-position: 33% 50%;
      background-color: pink;
    }

    ion-button {
      position: absolute;
      right: 0;
      bottom: 0;
      margin: 0px 2px 2px 0px;

      --border-radius: 50%;
      --padding-start: 8px;
      --padding-end: 8px;
      width: 32px;
      height: 32px;
    }
  }
}

#no-image-container {
  ion-card {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100px;
  }
}
</style>
