<template>
  <ion-page>
    <ion-content class="ion-padding">
      <p>detail page</p>
      <img :src="imgPath" alt="123" />
      <p>plant name: {{ plant.plantName }}</p>
      <p>plant description: {{ plant.plantDescription }}</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { IonPage, IonContent } from "@ionic/vue";
import { useRoute } from "vue-router";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { Plant } from "@/types";

console.log("DetailPage - setup");

const route = useRoute();

const { id } = route.params;
console.log(id);

let plant = {} as Plant;
const imgPath = ref("");

onMounted(() => {
  console.log("DetailPage - onMounted");
  Filesystem.readFile({
    path: "appconfig.json",
    directory: Directory.Data,
    encoding: Encoding.UTF8,
  }).then((result) => {
    console.log(result);
    console.log(JSON.parse(result.data).plantList[id as string]);
    plant = JSON.parse(result.data).plantList[id as string] as Plant;
    Filesystem.getUri({
      path: "images/" + plant.plantImageFilename,
      directory: Directory.Data,
    }).then((result) => {
      console.log(result);
      imgPath.value = Capacitor.convertFileSrc(result.uri);
      console.log(imgPath);
    });
  });
  console.log(imgPath);
});
</script>

<style scoped>
ion-content img {
  height: 300px;
}
</style>
