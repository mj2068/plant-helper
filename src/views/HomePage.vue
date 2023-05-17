<script setup lang="ts">
import { Directory, Filesystem } from "@capacitor/filesystem";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonSpinner,
  IonRippleEffect,
  onIonViewDidEnter,
  useIonRouter,
  alertController,
  toastController,
} from "@ionic/vue";
import { rose, addCircle } from "ionicons/icons";
import { onMounted, reactive, inject, computed, watch } from "vue";
import { useRouter } from "vue-router";
import type { AppConf, Plant } from "@/types";

const console = window.console;

console.log("HomePage - <setup>");

const ionRouter = useIonRouter();
const router = useRouter();

const { appData } = inject("appData") as {
  appData: {
    appConf: AppConf;
  };
  addPlant: (plant: Plant) => void;
};

onMounted(() => {
  console.log("HomePage - onMounted");
});

onIonViewDidEnter(() => {
  console.log("HomePage - onIonViewDidEnter");
});

// 监视appData，其发生改变后
watch(
  () => appData.appConf.plantList,
  () => {
    console.log("HomePage - watch - appData");
    console.log("plantList length: " + appData.appConf.plantList.length);
    updateImages();
  },
  { deep: true }
);

function getPlantById(id: number): Plant | undefined {
  return appData.appConf.plantList.find((plant) => id === plant.plantId);
}

function updateImages() {
  console.log("HomePage - updateImages");

  appData.appConf.plantList.forEach(async (plant) => {
    const id = plant.plantId;
    if (!plantImagesInfo[id])
      plantImagesInfo[id] = { dataUrl: "", isLoading: false };

    const filename = plant.plantImageFilename;
    console.log("filename: " + filename);
    // 判断文件名是否为空，如果是将plantImages对象相应id的图像设为空字符串
    if (filename === "") {
      plantImagesInfo[id].dataUrl = "";
      plantImagesInfo[id].isLoading = false;
      return;
    }
    // 如果文件名不为空，按文件名读取图像文件，并设为plantImages对象相应id的值
    try {
      plantImagesInfo[id].isLoading = true;
      const readResult = await Filesystem.readFile({
        path: "images/" + filename,
        directory: Directory.Data,
      });
      plantImagesInfo[id].dataUrl = "data:image/jpeg;base64," + readResult.data;
      plantImagesInfo[id].isLoading = false;
    } catch (error) {
      console.log("HomePage - updateImages");
      console.error(error);
      plantImagesInfo[id].dataUrl = "";
      plantImagesInfo[id].isLoading = false;
    }
  });
}

// 这个index signature用于存储plantList数组中每个元素对应的图像数据
const plantImagesInfo: {
  [index: number]: { dataUrl?: string; isLoading?: boolean };
} = reactive({});

watch(plantImagesInfo, (n, o) => {
  // console.log(n, o);
});

// 为防止没有添加图片文件的植物记录显示找不到图片，此函数用于返回一个通用占位图
// function imageWithPlaceholder(imageDataUrl: string) {
//   if (imageDataUrl) {
//     return imageDataUrl;
//   }
//   return "";
// }

function test() {
  console.log("HomePage - test");

  // console.log(plants.value[0]);

  // using computed property returning plantList and change the source, it works
  // appData.appConf.plantList[0].plantName = "haha";

  // computed properties are getter-only by defaule; so next line doesn't work
  // 2305160835: it actually works. you can't can change plants' value
  //   directly(e.g. plants.value = [], would give runtime error), but you
  //   actually can change its properties or elements.
  // plants.value[0].plantName = "heihei";
}

async function presentToast(
  message: string,
  position: "top" | "middle" | "bottom"
) {
  const toast = await toastController.create({
    message: message,
    duration: 1500,
    position: position,
  });

  await toast.present();
}

async function deleteFile() {
  const ionAlert = await alertController.create({
    header: "delete",
    subHeader: "becareful",
    message: "are you sure?",
    buttons: [
      {
        role: "cancel",
        text: "no",
      },
      {
        role: "confirm",
        text: "yes",
        handler: async () => {
          try {
            await Filesystem.deleteFile({
              path: "userdata.json",
              directory: Directory.Data,
            });
            console.log("HomePage - deleteFile - deleted");
          } catch (error) {
            let message;
            if (error instanceof Error) message = error.message;
            else message = String(error);
            console.error(message);
          }
        },
      },
    ],
  });
  await ionAlert.present();
}

function ionRouterPush() {
  ionRouter.push("/add");
}

function routerPush() {
  router.push("/add");
}

function cardDetail(id: number) {
  // console.log(plant);
  // ionRouter.navigate("/detail", "forward", "push");
  router.push(`/detail/${id}`);
}

function imgWillLoad(e: Event, id: number) {
  console.log(e.target);
  console.log(id);
  plantImagesInfo[id].isLoading = true;
}

function imgDidLoad(e: Event, id: number) {
  // console.log(e);
  // console.log(id);
  // plantImagesInfo[id].isLoading = false;
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-icon
          slot="start"
          :icon="rose"
          class="ion-padding-start"
        ></ion-icon>
        <ion-title>养花小助手</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-button
        class="debug test ion-no-margin"
        @click="ionRouter.push('/add')"
        >test</ion-button
      >

      <div id="container" class="ion-padding">
        <div class="control">
          <ion-button @click="ionRouter.push('/add')" fill="clear">
            <ion-icon :icon="addCircle" slot="icon-only"></ion-icon>
          </ion-button>
        </div>

        <div
          class="plant-container ion-activatable"
          @click="cardDetail(plant.plantId)"
          v-for="(plant, index) in appData.appConf.plantList"
          :key="index"
        >
          <ion-ripple-effect class="custom-ripple"></ion-ripple-effect>

          <div class="image-container">
            <ion-spinner
              v-if="plantImagesInfo[plant.plantId]?.isLoading"
            ></ion-spinner>
            <img
              v-show="plantImagesInfo[plant.plantId]?.dataUrl"
              :src="plantImagesInfo[plant.plantId]?.dataUrl"
              @loadstart="imgWillLoad($event, plant.plantId)"
              @load="imgDidLoad($event, plant.plantId)"
            />
          </div>

          <div class="text-container">
            <h3>{{ plant.plantName }}</h3>
            <p>{{ plant.plantDescription }}</p>
          </div>
          <!-- <ion-card button @click="cardDetail(plant)">
            <ion-card-header>
              <ion-card-title>{{ plant.plantName }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>{{ plant.plantDescription }}</p>
            </ion-card-content>
          </ion-card> -->
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-button.debug {
  position: fixed;
  z-index: 1;
}

ion-header ion-toolbar ion-icon {
  color: rgb(214, 32, 144);
  font-size: 32px;
}

#container .control {
  display: flex;
  justify-content: center;
  width: 100%;
}
#container .control ion-button {
  /* position: absolute; */
  width: 80px;
  height: 80px;
  /* margin: 0px 2px 2px 0px; */

  --border-radius: 50%;
  --padding-start: 0;
  --padding-end: 0;
}
#container .control ion-button ion-icon {
  font-size: 80px;
}

#container .plant-container {
  display: grid;
  grid-template-columns: 30% 70%;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  margin: 20px 5% 20px;
  overflow: hidden;

  position: relative;
}

#container .plant-container .custom-ripple {
  color: darkolivegreen;
}

#container .plant-container div.image-container {
  display: flex;
  justify-content: center;
  align-items: center;

  /* background-color: beige; */
}

#container .plant-container div.image-container ion-spinner {
  position: absolute;
}

#container .plant-container div.image-container img {
  width: 100%;
  height: 100%;
  max-height: 120px;
  display: block;
  object-fit: cover;
  /* padding: 10px; */
}

#container .plant-container div.text-container {
  margin-left: 20px;
}
</style>
