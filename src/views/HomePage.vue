<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, inject, watch } from "vue";
import { Directory, Filesystem } from "@capacitor/filesystem";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonRippleEffect,
  IonNote,
  onIonViewDidEnter,
  useIonRouter,
  alertController,
  toastController,
} from "@ionic/vue";
import { rose, addCircle } from "ionicons/icons";
import { useRouter } from "vue-router";
import type { AppConf, Plant } from "@/types";
import { appDataKey } from "@/injectionKeys";
import Popper from "vue3-popper";

const console = window.console;

console.log("HomePage - <setup>");

const ionRouter = useIonRouter();
const router = useRouter();

// 引用vue文档：
// If you are sure that the value is always provided, you can also force cast
// the value: const foo = inject('foo') as string
const appData = inject(appDataKey) as { appConf: AppConf };

const showPopper = ref(true);

onMounted(() => {
  console.log("HomePage - onMounted");

  updateImages();
});

onUnmounted(() => {
  console.log("HomePage - onUnmounted");
});

onIonViewDidEnter(() => {
  console.log("HomePage - onIonViewDidEnter");
});

// 监视appData，其发生改变后
// 此处的第一个实参是个函数，是有讲究的。原因参考vue文档
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

// 为防止没有添加图片文件的植物记录显示找不到图片，此函数用于返回一个通用占位图
// function imageWithPlaceholder(imageDataUrl: string) {
//   if (imageDataUrl) {
//     return imageDataUrl;
//   }
//   return "";
// }

function test() {
  console.log("HomePage - test");

  updateImages();

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

    <ion-content class="">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="debug-control-container" class="debug test ion-no-margin">
        <ion-button
          size="small"
          color="danger"
          class="debug test"
          @click="console.log(plantImagesInfo)"
          >plantImage</ion-button
        >
        <br />
        <ion-button
          size="small"
          color="danger"
          class="debug test"
          @click="console.log(appData)"
          >appData</ion-button
        >
        <br />
        <ion-button size="small" color="success" @click.stop="test"
          >test</ion-button
        >
      </div>

      <div id="content-container">
        <div id="decor-container" class="">
          <div class="left">
            <img
              class="left"
              src="@/../resources/hang-yellow-pot-vine.svg"
              alt=""
            />
            <img
              class="left2"
              src="@/../resources/hang-pink-pot-vine.svg"
              alt=""
            />
          </div>
          <img class="right" src="@/../resources/group-decor2.png" alt="" />
        </div>
        <div id="plants-container" class="ion-padding">
          <div class="control">
            <Popper
              content="添加一个新植物🌼"
              :show="showPopper"
              :locked="true"
              arrow
              placement="top-start"
              offset-skid="-15"
              offset-distance="6"
              arrow-padding="12"
            >
              <ion-button
                @click="ionRouter.push('/add')"
                fill="clear"
                color="soil"
              >
                <ion-icon :icon="addCircle" slot="icon-only"></ion-icon>
              </ion-button>
            </Popper>
          </div>

          <div
            class="plant-container ion-activatable"
            v-for="(plant, index) in appData.appConf.plantList"
            :key="index"
            :style="{ backgroundColor: plant.plantColor }"
            @click="cardDetail(plant.plantId)"
          >
            <div class="image-container">
              <ion-spinner v-if="plantImagesInfo[plant.plantId]?.isLoading">
              </ion-spinner>
              <img
                v-if="plantImagesInfo[plant.plantId]?.dataUrl"
                :src="plantImagesInfo[plant.plantId]?.dataUrl"
                @load="imgDidLoad($event, plant.plantId)"
              />
            </div>
            <div class="text-container ion-padding">
              <h3>{{ plant.plantName }}</h3>
              <p>{{ plant.plantDescription }}</p>
            </div>
            <ion-ripple-effect class="custom-ripple"></ion-ripple-effect>

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

        <div
          id="footer-container"
          class="ion-padding"
          style="justify-content: center; display: flex"
        >
          <ion-note style="align-self: flex-end">zizaimai.space</ion-note>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
div.debug {
  position: fixed;
  z-index: 1;
  opacity: 0.6;

  display: none;
}

div.debug ion-button {
  text-transform: none;
}

ion-header ion-toolbar ion-icon {
  color: rgb(214, 32, 144);
  font-size: 32px;
}

#content-container {
  position: relative;
}

#content-container::before {
  /* background: url(@/../resources/7652324.jpg) 0% 0% / cover rgba(0, 0, 0, 0.3); */
  content: " ";
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  background-image: url(@/../resources/7652324.jpg);
  background-repeat: repeat-y;
  background-position: 50% 0%;
  background-size: contain;
}

#content-container #decor-container {
  position: relative;
  width: 100%;
  height: 80px;
  /* overflow: hidden; */
}

@keyframes sway {
  0% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(5deg);
  }
}

#content-container #decor-container img.left {
  position: absolute;
  height: 150%;
  left: 65px;
  transform: rotate(5deg);
  animation: sway 4.5s ease-in-out infinite;
  transform-origin: 30% 0;
}

#content-container #decor-container img.left2 {
  position: absolute;
  height: 150%;
  left: 15px;
  scale: 1.1;
  transform: rotate(5deg);
  animation: sway 6s ease-in-out infinite;
  transform-origin: 50% 0;
}

#content-container #decor-container img.right {
  margin-top: 8px;
  height: 160%;
  position: absolute;
  right: 2%;
  top: 0;
  opacity: 0.8;
}

#plants-container {
  position: relative;
}

#plants-container .control {
  display: flex;
  justify-content: center;
  width: 100%;
}

#plants-container .control :deep(.popper) {
  --popper-theme-background-color: #333333;
  --popper-theme-background-color-hover: #333333;
  --popper-theme-text-color: #ffffff;
  --popper-theme-border-width: 0px;
  --popper-theme-border-style: solid;
  --popper-theme-border-radius: 4px;
  --popper-theme-padding: 16px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

#plants-container .control ion-button {
  width: 80px;
  height: 80px;

  --border-radius: 50%;
  --padding-start: 0;
  --padding-end: 0;
}

#plants-container .control ion-button ion-icon {
  font-size: 80px;
  /* color: indianred; */
}

#plants-container .plant-container {
  display: flex;
  /* grid-template-columns: 30% 70%; */
  /* grid-auto-rows: 1fr; */
  /* flex: 1; */
  /* flex-direction: row; */
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  margin: 20px 5% 20px;
  overflow: hidden;
  /* height: 200px; */
  /* max-height: 150px; */

  background-color: white;

  /* ion-ripple用absolute来定位ripple效果位置，所以需要容器relative */
  position: relative;
}

#plants-container .plant-container .custom-ripple {
  color: darkolivegreen;
}

#plants-container .plant-container div.image-container {
  width: 30%;
  /* height: 100%; */
  display: flex;
  /* flex: 1 1 auto; */
  justify-content: center;
  align-items: center;
  /* background-color: beige; */
  /* max-height: 100%; */

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  /* align-self: center; */
}

#plants-container .plant-container div.image-container ion-spinner {
  position: absolute;
}

#plants-container .plant-container div.image-container img {
  width: 100%;
  height: 100%;
  /* max-width: 100%; */
  /* max-height: 100%; */
  display: block;
  object-fit: cover;
  /* padding: 10px; */
}

#plants-container .plant-container div.text-container {
  /* width: 70%; */
  margin-left: 30%;
  /* margin-right: 5%; */
}

#footer-container {
  height: 50px;
  background-color: antiquewhite;
  position: relative;
  margin-top: 40px;
}
</style>
