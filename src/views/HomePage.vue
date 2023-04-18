<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-icon
          slot="start"
          :icon="rose"
          size="large"
          color="danger"
        ></ion-icon>
        <ion-title>养花小助手</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container" class="ion-padding">
        <div id="control" style="display: flex; justify-content: center">
          <ion-button @click="ionRouter.push('/add')" size="large">
            <ion-icon :icon="addCircle" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button @click="test">test</ion-button>
        </div>
        <ion-card
          v-for="(plant, index) in appData.appConf.plantList"
          :key="index"
          @click="cardDetail(plant)"
        >
          <ion-img
            :src="
              filenameToDataUrl(plant.plantImageFilename).then(
                (result) => result
              )
            "
          />
          <ion-card-header>
            <ion-card-title>{{ plant["plantName"] }}</ion-card-title>
            <ion-card-content>
              <p>{{ plant["plantDescription"] }}</p>
            </ion-card-content>
          </ion-card-header>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTextarea,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonImg,
  onIonViewDidEnter,
  useIonRouter,
  alertController,
  toastController,
} from "@ionic/vue";
import { rose, addCircle } from "ionicons/icons";
import { onMounted, computed, inject } from "vue";
import { useRouter } from "vue-router";
import type { AppConf, Plant } from "@/types";

const console = window.console;

console.log("HomePage - setup");

const ionRouter = useIonRouter();
const router = useRouter();

const { appData, addPlant } = inject("appData") as {
  appData: {
    appConf: AppConf;
  };
  addPlant: (plant: Plant) => void;
};

const plantImages: { [index: number]: string } = {
  1: "a",
  3: "a",
};

onMounted(() => {
  console.log("HomePage - onMounted");
});

async function filenameToDataUrl(filename: string) {
  const result = await Filesystem.readFile({
    path: `images/${filename}`,
    directory: Directory.Data,
  });
  return "data:image/jpeg;base64," + result.data;
}

async function presentToast(position: "top" | "middle" | "bottom") {
  const toast = await toastController.create({
    message: "Hello World!",
    duration: 500,
    position: position,
  });

  await toast.present();
}

onIonViewDidEnter(() => {
  console.log("HomePage - onIonViewDidEnter");
});

function test() {
  // appData.appConf.plantList.push({
  //   plantId: 1,
  //   plantCreatedAt: new Date(),
  //   plantDescription: "hen xiang",
  //   plantName: "ruixiang",
  //   plantImageFilename: "",
  // });
  addPlant({
    plantId: 7,
    plantCreatedAt: new Date(),
    plantName: "rose",
    plantDescription: "reminds love ♥",
    plantImageFilename: "",
  });
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

  return {
    appData,
  };
}

async function readImage(filename: string) {
  return await Filesystem.readFile({
    path: "images/" + filename,
    directory: Directory.Data,
  });
}

function ionRouterPush() {
  ionRouter.push("/add");
}

function routerPush() {
  router.push("/add");
}

function cardDetail(plant: Plant) {
  console.log(plant);
  // ionRouter.navigate("/detail", "forward", "push");
  router.push(`/detail/${plant.plantId}`);
}
</script>

<style scoped>
button {
  font-size: 2rem;
}

#container {
  background-color: #eee;
}

#container ion-card div {
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: #555; */
  height: 100px;
}

#container ion-card div ion-img {
  height: auto;
}

#container ion-img {
  object-fit: cover;
  background-color: #ccc;
  height: 100px;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

#container button {
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
}

#container button:active {
  background-color: pink;
}
</style>
