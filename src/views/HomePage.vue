<script setup lang="ts">
import { reactive, ref, onMounted, inject, watch } from "vue";
import { Directory, Filesystem } from "@capacitor/filesystem";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonRippleEffect,
  IonNote,
  IonToggle,
  onIonViewDidEnter,
  useIonRouter,
  toastController,
} from "@ionic/vue";
import { rose, add, sunny } from "ionicons/icons";
import { useRouter } from "vue-router";
import type { AppConf, Plant } from "@/types";
import { appDataKey } from "@/injectionKeys";
import tippy, { sticky, roundArrow } from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/themes/material.css";
import "tippy.js/dist/svg-arrow.css";
// import "tippy.sj/themes/translucent.css";
import GlowButton from "@/components/GlowButton.vue";

const console = window.console;

console.log("HomePage - <setup>");

const ionRouter = useIonRouter();
const router = useRouter();

// 引用vue文档：
// If you are sure that the value is always provided, you can also force cast
// the value: const foo = inject('foo') as string
const appData = inject(appDataKey) as { appConf: AppConf };

const addButton = ref<HTMLDivElement | null>(null);

const isShowDebugDiv = ref(false);

onMounted(() => {
  console.log("HomePage - onMounted");

  updateImages();

  // 如有需要可接收到tippy的返回值，取得全权控制
  // const addButtonTippy =
  tippy(addButton.value as HTMLDivElement, {
    content: "按这里添加一个植物🌼",
    theme: "planthelper",
    showOnCreate: true,
    trigger: "manual",
    hideOnClick: false,
    appendTo: "parent",
    arrow: roundArrow,
    // placement: 'bottom',
    popperOptions: { modifiers: [{ name: "flip", enabled: false }] },
    // for some reason, 如果初始时让提示显示，它的定位会出现问题，用以下两个可以解决
    sticky: true,
    plugins: [sticky],
  });
});

onIonViewDidEnter(() => presentToast("欢迎"));

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

  // updateImages();

  ionRouter.navigate("/test", "forward");

  // using computed property returning plantList and change the source, it works
  // appData.appConf.plantList[0].plantName = "haha";

  // computed properties are getter-only by defaule; so next line doesn't work
  // 2305160835: it actually works. you can't can change plants' value
  //   directly(e.g. plants.value = [], would give runtime error), but you
  //   actually can change its properties or elements.
  // plants.value[0].plantName = "heihei";
}

async function presentToast(
  message = "WELCOME",
  position: "top" | "middle" | "bottom" = "bottom"
) {
  const toast = await toastController.create({
    message: message,
    duration: 1000,
    position: position,
    icon: sunny,
    cssClass: "toast-flex-justify-content",
  });

  await toast.present();
}

function cardDetail(id: number) {
  // console.log(plant);
  // ionRouter.navigate("/detail", "forward", "push");
  router.push(`/detail/${id}`);
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
        <ion-buttons slot="end">
          <ion-button @click="ionRouter.navigate('/home', 'root')"
            >refresh</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="debug-control-container" class="debug test ion-no-margin">
        <ion-toggle v-model="isShowDebugDiv" class="ion-margin-end">
          hahaha
        </ion-toggle>
        <div v-if="isShowDebugDiv" class="debug test controls-container">
          <ion-button class="debug test" @click="console.log(plantImagesInfo)">
            plantImage
          </ion-button>
          <ion-button class="debug test" @click="console.log(appData)">
            appData
          </ion-button>
          <ion-button color="warning" @click.stop="test">test</ion-button>
          <ion-button color="warning" @click.stop="ionRouter.push('/console')">
            console
          </ion-button>
          <ion-button color="warning" @click.stop="ionRouter.push('/graph')">
            graph
          </ion-button>
          <ion-button color="warning" @click.stop="ionRouter.push('/classify')">
            classify
          </ion-button>
        </div>
      </div>

      <div id="content-container">
        <div id="decor-container">
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
          <div class="right">
            <img class="right" src="@/../resources/group-decor2.png" alt="" />
          </div>
        </div>
        <div
          id="temperature-chart-container"
          class="ion-justify-content-center ion-padding-start ion-padding-end"
        >
          <LineChart
            id="temperature-chart"
            :data="[
              { x: '日', y: 20 },
              { x: '一', y: 16 },
              { x: '二', y: 18 },
              { x: '三', y: 23 },
              { x: '四', y: 27 },
              { x: '五', y: 28 },
              { x: '六', y: 31 },
            ]"
            :options="{ title: '温度回溯' }"
          ></LineChart>
        </div>
        <div id="plants-container" class="ion-padding-start ion-padding-end">
          <div class="control ion-margin-bottom">
            <div
              :ref="(el) => (addButton = el as HTMLDivElement)"
              class="add-button-container"
            >
              <GlowButton
                id="add-button"
                :icon="add"
                color="white"
                bgcolor="orange"
                @click="ionRouter.push('/add')"
              ></GlowButton>
            </div>
          </div>
          <div
            v-for="(plant, index) in appData.appConf.plantList"
            :key="index"
            class="plant-container ion-activatable ion-margin-bottom"
            :style="{ backgroundColor: plant.plantColor }"
            @click="cardDetail(plant.plantId)"
          >
            <div class="image-container">
              <ion-spinner v-if="plantImagesInfo[plant.plantId]?.isLoading">
              </ion-spinner>
              <img
                v-if="plantImagesInfo[plant.plantId]?.dataUrl"
                :src="plantImagesInfo[plant.plantId]?.dataUrl"
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

        <div id="footer-container" class="ion-padding">
          <ion-note>
            <a href="http://zizaimai.space" target="_blank">zizaimai.space</a>
          </ion-note>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style lang="sass">
// 试图居中toast内容，但是由于toast是shadow dom，且没有expose关键的那个container
// ion-toast.toast-flex-justify-content
//   color: red
//   &::part(container)
//     // justify-content: center
//   &::part(message)
</style>

<style scoped>
/* style only for tippy */
:deep(.tippy-box[data-theme~="planthelper"]) {
  background-color: tomato;
  color: yellow;
  height: 40px;
}

:deep(.tippy-box) > .tippy-content {
  height: 100%;
  display: flex;
  align-items: center;
}

:deep(.tippy-box[data-theme~="planthelper"][data-placement^="top"])
  > .tippy-arrow::before {
  border-top-color: tomato;
}

:deep(.tippy-box[data-theme~="planthelper"]) > .tippy-svg-arrow {
  fill: tomato;
}
</style>

<style scoped>
div#debug-control-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: end;
  right: 8px;
  opacity: 0.7;
  text-align: right;

  z-index: 5;
}

div#debug-control-container div.controls-container {
  display: flex;
  flex-direction: column;
  align-items: end;
}

div#debug-control-container div.controls-container ion-button {
  text-transform: none;
}

ion-header ion-toolbar ion-icon {
  color: tomato;
  font-size: 32px;
}

#content-container {
  position: relative;
  min-height: 100%;
  padding-bottom: 100px;
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
  height: 100px;
  /* overflow: hidden; */

  z-index: 1;
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

#content-container #decor-container div.left {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
}

#content-container #decor-container div.left img.left {
  position: absolute;
  height: 130%;
  left: 65px;
  transform: rotate(5deg);
  animation: sway 4s ease-in-out infinite;
  transform-origin: 30% 0;
}

#content-container #decor-container div.left img.left2 {
  position: absolute;
  height: 130%;
  left: 15px;
  transform: rotate(5deg);
  animation: sway 6s ease-in-out forwards infinite;
  transform-origin: 50% 0;
}

#content-container #decor-container div.right {
  position: absolute;
  right: -16px;
  width: 100%;
  height: 125%;
  /* margin-top: 12px; */
  /* box-shadow: 0px 12px 24px -24px #7a5122; */
}

#content-container #decor-container div.right img.right {
  /* margin-top: 8px; */
  height: 100%;
  right: 48px;
  position: absolute;
  top: 10px;
  opacity: 0.8;
  object-fit: contain;
}

#temperature-chart-container {
  position: relative;
  display: flex;
  margin: 24px auto 24px;
  --ion-padding: 32px;
}

#temperature-chart-container #temperature-chart {
  width: 100%;
  max-width: 450px;
  max-height: 200px;
  padding: 8px 16px 8px;
  background-color: #fffa;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
}

#plants-container {
  position: relative;
  --ion-padding: 32px;
}

#plants-container .control {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  /* margin: 20px 5% 20px; */
  overflow: hidden;
  /* height: 200px; */
  /* max-height: 150px; */

  background-color: white;

  /* ion-ripple用absolute来定位ripple效果位置，所以需要容器relative */
  position: relative;

  width: 100%;
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
  --ion-padding: 16px;
  width: 70%;
  margin-left: 30%;
  /* margin-right: 5%; */
}

#footer-container {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  /* height: 25px; */
  background-color: antiquewhite;
  margin-top: 40px;
  opacity: 0.6;
  --ion-padding: 6px;
}
</style>
