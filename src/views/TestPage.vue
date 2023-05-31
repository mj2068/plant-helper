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
  IonText,
  IonNote,
  IonSpinner,
  useIonRouter,
} from "@ionic/vue";
import { inject, ref, onMounted } from "vue";
import { appDataKey } from "@/injectionKeys";

const console = window.console;

console.log("TestPage - setup");

const ionRouter = useIonRouter();

const appData = inject(appDataKey);

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
</script>

<template lang="pug">
ion-page
  ion-header
    ion-toolbar
      ion-title(slot="start") 测试页
      ion-buttons(slot="end")
        ion-button(@click="console.log(data)") test
        ion-button(@click="ionRouter.navigate('/home', 'root')") 首页

  ion-content.ion-padding
    ion-list(v-if="isDataLoaded", lines="full")
      ion-item(v-for="(value, key, index) in data?.lives[0]", :key="index")
        ion-label {{ key }}
        ion-text(slot="end") {{ value }}
    div(v-else, style="display: flex")
      ion-spinner 
  ion-footer
    ion-toolbar
      .ion-justify-content-center
        h4 zizaimai
</template>

<style scoped lang="sass">
.ion-justify-content-center
  display: flex
</style>
