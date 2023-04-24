<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div id="content-container">
        <ion-card>
          <ion-img :src="plantImageSrc" alt="123" />
        </ion-card>
        <p>plant name: {{ plant?.plantName }}</p>
        <p>plant description: {{ plant?.plantDescription }}</p>
      </div>
      <ion-button @click="test"> test </ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, inject, watch, computed } from "vue";
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
} from "@ionic/vue";
import { useRoute } from "vue-router";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { airplane, star } from "ionicons/icons";
import { AppConf, Plant } from "@/types";

console.log("DetailPage - <setup>");

const route = useRoute();

const { id } = route.params;
console.log("DetailPage - <setup> id: ");
console.log(id);

const { appData } = inject("appData") as {
  appData: {
    appConf: AppConf;
  };
  addPlant: (plant: Plant) => void;
};

onMounted(() => {
  console.log("DetailPage - onMounted");

  updatePlant();
});

watch(appData, () => {
  console.log("DetaiPage - watch - appData");

  updatePlant();
});

const plantImageFileUri = ref("");

const plant = ref<Plant>();
function updatePlant() {
  for (const p of appData.appConf.plantList) {
    if (p.plantId.toString() === id) {
      plant.value = p;
      Filesystem.getUri({
        path: "images/" + p.plantImageFilename,
        directory: Directory.Data,
      }).then((r) => {
        plantImageFileUri.value = r.uri;
      });
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
ion-content ion-card {
  max-height: 300px;

  ion-img {
    height: 300px;
  }
}
</style>
