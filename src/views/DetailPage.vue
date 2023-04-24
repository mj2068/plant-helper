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
          <ion-button v-on:click="console.log(`id:${id}`)">
            <ion-icon slot="icon-only" :icon="ellipsisVerticalSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ plant?.plantName }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div id="content-container">
        <ion-card>
          <ion-img :src="plantImageSrc" alt="植物图片" />
        </ion-card>
        <ion-list>
          <ion-item>
            <p>plant name: {{ plant?.plantName }}</p>
          </ion-item>
          <ion-item>
            <p>plant description: {{ plant?.plantDescription }}</p>
          </ion-item>
          <ion-item>
            <p>plant id: {{ plant?.plantId }}</p>
          </ion-item>
        </ion-list>
      </div>
      <div id="controls">
        <ion-button @click="test"> test </ion-button>
        <ion-button @click="test"> test </ion-button>
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
import { onMounted, ref, inject, watch, computed } from "vue";
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

  updatePlant();
});

watch(appData, () => {
  console.log("DetailPage - watch - appData");

  updatePlant();
});

const plantImageFileUri = ref("");
const plant = ref<Plant>();
function updatePlant() {
  for (const p of appData.appConf.plantList) {
    if (p.plantId.toString() === id) {
      plant.value = p;
      if (p.plantImageFilename !== "") {
        Filesystem.getUri({
          path: "images/" + p.plantImageFilename,
          directory: Directory.Data,
        }).then((r) => {
          plantImageFileUri.value = r.uri;
        });
      }
    }
  }
}

const plantImageSrc = computed(() => {
  if (plantImageFileUri.value === "") {
    return star;
  } else {
    return Capacitor.convertFileSrc(plantImageFileUri.value);
  }
});

function test() {
  console.log("DetailPage - test");
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

    ion-button[color="danger"] {
      margin-left: auto;
    }
  }
}
</style>
