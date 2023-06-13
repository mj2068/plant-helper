<script setup lang="ts">
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
  IonTextarea,
  IonImg,
} from "@ionic/vue";
import { ref, onMounted } from "vue";

const console = window.console;

console.log("TestPage - setup");

const data = ref();
const isDataLoaded = ref(false);

onMounted(() => {
  console.log("TestPage - onMounted");

  fetch(import.meta.env.VITE_WEATHER_API)
    .then((response) => response.json())
    .then((parsedData) => {
      console.log(parsedData);
      data.value = parsedData;
      isDataLoaded.value = true;
    })
    .catch((err) => console.error(err));
});


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
    #loading-spinner-container.ion-justify-content-center.ion-align-items-center(
      v-else
    )
      ion-spinner 
  ion-footer
    ion-toolbar
      .ion-justify-content-center(style="display: flex") zizaimai
</template>

<style scoped lang="sass">
ion-content
  #loading-spinner-container
    // height: 100%
    display: flex
</style>
