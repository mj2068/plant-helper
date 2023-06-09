<script setup lang="ts">
import { Directory, Filesystem } from "@capacitor/filesystem";
import {
  IonPage,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonBackButton,
} from "@ionic/vue";
import { ref, onMounted } from "vue";

const console = window.console;

console.log("TestPage - setup");

const data = ref();
const isDataLoaded = ref(false);

onMounted(() => {
  fetch(
    "https://restapi.amap.com/v3/weather/weatherInfo?city=371602&key=dff8898c0b532e2ff314425eebd02ee3"
  )
    .then((response) => response.json())
    .then((parsedData) => {
      console.log(parsedData);
      data.value = parsedData;
      isDataLoaded.value = true;
    })
    .catch((err) => console.error(err));
});

function deleteFile() {
  Filesystem.stat({
    path: "",
  }).then((r) => console.log(r));
}
</script>

<template lang="pug">
ion-page
  ion-header
    ion-toolbar
      IonBackButton(slot="start", :default-href="'/home'")
      ion-title(slot="start") 测试页
      ion-buttons(slot="end")
        ion-button(@click="console.log(data)") log data

  ion-content.ion-padding
    ion-list(v-if="isDataLoaded", lines="full")
      ion-item(v-for="(value, key, index) in data?.lives[0]", :key="index")
        ion-label {{ key }}
        ion-label(slot="end") {{ value }}
    div(v-else, style="display: flex")
      ion-spinner 
    IonButton(@click="deleteFile()")

  ion-footer
    ion-toolbar
      .ion-justify-content-center
        h6 zizaimai
</template>

<style scoped lang="sass">
.ion-justify-content-center
  display: flex
</style>
