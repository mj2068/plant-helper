<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-icon
          slot="start"
          :icon="rose"
          size="large"
          color="danger"
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

      <div id="container" class="ion-padding">
        <div id="control" style="display: flex; justify-content: center">
          <ion-button @click="ionRouter.push('/add')" size="large">
            <ion-icon :icon="addCircle" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button @click="test" size="large">test</ion-button>
        </div>
        <ion-card
          v-for="(plant, index) in appData.appConf.plantList"
          :key="index"
          @click="cardDetail(plant)"
        >
          <ion-img :src="imageWithPlaceholder(plantImages[plant.plantId])" />
          <ion-card-header>
            <ion-card-title>{{ plant["plantName"] }}</ion-card-title>
            <ion-card-content>
              <p>{{ plant["plantDescription"] }}</p>
            </ion-card-content>
          </ion-card-header>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

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
  IonImg,
  onIonViewDidEnter,
  useIonRouter,
  alertController,
  toastController,
} from "@ionic/vue";
import { rose, addCircle, star } from "ionicons/icons";
import { onMounted, reactive, inject, watch } from "vue";
import { useRouter } from "vue-router";
import type { AppConf, Plant } from "@/types";

const console = window.console;

console.log("HomePage - setup");

const ionRouter = useIonRouter();
const router = useRouter();

const { appData } = inject("appData") as {
  appData: {
    appConf: AppConf;
  };
  addPlant: (plant: Plant) => void;
};

// 监视appData，其发生改变后
watch(appData, () => {
  console.log("HomePage - watch - appData");
  console.log(appData.appConf.plantList.length);
  updateImages();
});

function updateImages() {
  appData.appConf.plantList.forEach(async (plant) => {
    const filename = plant.plantImageFilename;
    console.log(filename);
    // 判断文件名是否为空，如果是将plantImages对象相应id的图像设为空字符串
    if (filename === "") {
      plantImages[plant.plantId] = "";
      return;
    }
    // 如果文件名不为空，按文件名读取图像文件，并设为plantImages对象相应id的值
    try {
      const readResult = await Filesystem.readFile({
        path: "images/" + filename,
        directory: Directory.Data,
      });
      plantImages[plant.plantId] = "data:image/jpeg;base64," + readResult.data;
    } catch (error) {
      console.log("HomePage - updateImages");
      console.error(error);
      plantImages[plant.plantId] = "";
    }
  });
}

// 用于存储plantList数组中每个对象对应的图像数据
const plantImages: { [index: number]: string } = reactive({});

// 为防止没有添加图片文件的植物记录显示找不到图片，此函数用于返回一个通用占位图
function imageWithPlaceholder(imageDataUrl: string) {
  if (imageDataUrl) {
    return imageDataUrl;
  }
  return star;
}

onMounted(() => {
  console.log("HomePage - onMounted");

  updateImages();
});

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

onIonViewDidEnter(() => {
  console.log("HomePage - onIonViewDidEnter");
});

function test() {
  console.log("HomePage - test");

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

function cardDetail(plant: Plant) {
  // console.log(plant);
  // ionRouter.navigate("/detail", "forward", "push");
  router.push(`/detail/${plant.plantId}`);
}
</script>

<style scoped>
button {
  font-size: 2rem;
}

#container {
  background-color: #eee;
}

#container ion-card div {
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: #555; */
  height: 100px;
}

#container ion-card div ion-img {
  height: auto;
}

#container ion-img {
  object-fit: cover;
  background-color: #ccc;
  height: 100px;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

#container button {
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
}

#container button:active {
  background-color: pink;
}
</style>
