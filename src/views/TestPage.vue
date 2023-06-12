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

// 202306121754
const bdAT = ref(
  "24.c70b1aa77f5bdc64daa23b902a4a6872.2592000.1689148955.282335-34583509"
);

const imageUrl = ref(
  "https://img.pconline.com.cn/images/upload/upc/tx/photoblog/1510/19/c4/14135050_14135050_1445220434828.jpg"
);

const bdPlantUrl = "https://aip.baidubce.com/rest/2.0/image-classify/v1/plant";

onMounted(() => {
  console.log("TestPage - onMounted");

  fetch(import.meta.env.VITE_WEATHER_API)
    .then((response) => response.json())
    .then((parsedData) => {
      console.log(parsedData);
      // data.value = parsedData;
      // isDataLoaded.value = true;
    })
    .catch((err) => console.error(err));
});

function fetchAPI() {
  fetch("http://zizaimai.space/api")
    .then((response) => response.json())
    .then((parsedJson) => {
      console.log(parsedJson);
      bdAT.value = parsedJson.access_token;
    });
}

function convertToBase64(url: string) {
  return new Promise<string>((resolve, reject) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64DataPrefixless = (reader.result as string).split(",")[1];
          resolve(base64DataPrefixless);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(blob);
      });
  });
}

function classify() {
  if (!bdAT.value) return;

  console.log(imageUrl.value);

  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
  });
  const body = new URLSearchParams();
  // body.append("url", imageUrl.value);
  // body.append("baike_num", "1");
  convertToBase64(imageUrl.value).then((base64DataPrefixless: string) => {
    console.log(base64DataPrefixless);
    body.append("image", base64DataPrefixless);
    fetch(bdPlantUrl + "?access_token=" + bdAT.value, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => response.json())
      .then(console.log);
  });
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
    #loading-spinner-container.ion-justify-content-center.ion-align-items-center(
      v-else
    )
      ion-spinner 
    IonButton(:disabled="true", @click="fetchAPI()") 1️⃣ get at
    IonButton(@click="classify()") classify
    IonTextarea.ion-margin-bottom(v-model="imageUrl")
    IonImg(:src="imageUrl")

  ion-footer
    ion-toolbar
      .ion-justify-content-center
        h6 zizaimai
</template>

<style scoped lang="sass">
ion-content
  #loading-spinner-container
    // height: 100%
    display: flex
</style>
