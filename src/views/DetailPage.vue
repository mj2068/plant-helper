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
          <ion-button @click="save">编辑</ion-button>
          <ion-button v-on:click="console.log(`id:${id}`)">
            <ion-icon slot="icon-only" :icon="ellipsisVerticalSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ plant?.plantName }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div id="content-container">
        <div id="found-plant-container" class="container" v-if="plant != null">
          <ion-card>
            <ion-img :src="plantImageSrc" alt="植物图片" />
          </ion-card>
          <ion-list>
            <ion-item>
              <ion-label>植物名称</ion-label>
              <ion-input :value="plant?.plantName"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label>植物描述</ion-label>
              <ion-input :value="plant?.plantDescription"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label>植物ID</ion-label>
              <p>{{ plant?.plantId }}</p>
            </ion-item>
          </ion-list>
        </div>
        <div id="plant-null-container" class="container" v-else>
          <h2>未找到该植物</h2>
          <h4>
            <i>(id:{{ id }})</i>
          </h4>
        </div>
      </div>
      <div id="controls">
        <ion-button>test</ion-button>
        <ion-button v-on:click="test">
          <ion-icon slot="icon-only" :icon="star"></ion-icon>
        </ion-button>
        <ion-button
          color="danger"
          v-on:click="deletePlant(parseInt(id as string))"
        >
          删除
          <ion-icon slot="start" :icon="trashSharp"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, inject, computed } from "vue";
import {
  IonToolbar,
  IonTitle,
  IonHeader,
  IonPage,
  IonContent,
  IonButtons,
  IonButton,
  IonBackButton,
  IonCard,
  IonImg,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  useIonRouter,
} from "@ionic/vue";
import { useRoute } from "vue-router";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { star, ellipsisVerticalSharp, trashSharp } from "ionicons/icons";
import { AppConf, Plant } from "@/types";

const console = window.console;

console.log("DetailPage - <setup>");

const ionRouter = useIonRouter();
const route = useRoute();

const { id } = route.params;
console.log("DetailPage - <setup> id: ");
console.log(id);

const { appData, deletePlant } = inject("appData") as {
  appData: {
    appConf: AppConf;
  };
  addPlant: (plant: Plant) => void;
  deletePlant: (id: number) => void;
};

onMounted(() => {
  console.log("DetailPage - onMounted");

  // reloadPlantFromConfig();
});

// watch(appData, () => {
//   console.log("DetailPage - watch - appData");

//   reloadPlantFromConfig();
// });

const plantImageSrc = ref(star);

const plant = computed(() => {
  for (const p of appData.appConf.plantList) {
    if (p.plantId.toString() === id) {
      setPlantImageSrc(p.plantImageFilename);
      return p;
    }
  }
  return null;
});

function setPlantImageSrc(imageFilename: string) {
  if (imageFilename !== "") {
    Filesystem.getUri({
      path: "images/" + imageFilename,
      directory: Directory.Data,
    }).then((result) => {
      console.log(result);
      plantImageSrc.value = Capacitor.convertFileSrc(result.uri);
    });
  } else {
    plantImageSrc.value = star;
  }
}

// function reloadPlantFromConfig() {
//   for (const p of appData.appConf.plantList) {
//     if (p.plantId.toString() === id) {
//       // 将根据id找到的元素赋给组件ref变量plant
//       plant.value.description = p.plantDescription;
//       plant.value.name = p.plantName;
//       plant.value.id = p.plantId;
//       // 判断此plant元素图片文件名属性是否为空，如否则获取其uri
//       if (p.plantImageFilename !== "") {
//         Filesystem.getUri({
//           path: "images/" + p.plantImageFilename,
//           directory: Directory.Data,
//         }).then((result) => {
//           plant.value.imageFileUri = result.uri;
//         });
//       }
//     }
//   }
// }

function save() {
  console.log("DetailPage - enterEdit");

  appData.appConf.testNumber = Math.floor(Math.random() * 100);
}

function test() {
  console.log(appData.appConf.plantList);
}
</script>

<style scoped lang="scss">
ion-content {
  ion-card {
    max-height: 300px;

    ion-img {
      height: 300px;
    }
  }

  div[id="controls"] {
    display: flex;
    justify-content: space-between;
    background-color: moccasin;

    ion-button[color="danger"] {
      // 这里margin-left设为auto配合flex容器的space-between让该元素右对齐
      margin-left: auto;
    }
  }
}
</style>
