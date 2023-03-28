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
        <div style="display: flex; justify-content: center">
          <ion-button @click="ionRouter.push('/add')" size="large">
            <ion-icon :icon="addCircle" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button @click="test">test</ion-button>
        </div>
        <ion-card
          v-for="(plant, index) in appConfig.plantList"
          :key="index"
          @click="cardDetail"
        >
          <ion-card-header>
            <ion-card-title>{{ plant.plantName }}</ion-card-title>
            <ion-card-content>
              <p>{{ plant.plantDescription }}</p>
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
  onIonViewDidEnter,
  useIonRouter,
  alertController,
  toastController,
} from "@ionic/vue";
import { rose, add, addCircle, heart } from "ionicons/icons";
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";

interface Plant {
  plantName: string;
  plantDescription: string;
}

const console = window.console;

const ionRouter = useIonRouter();
const router = useRouter();

const appConfig = reactive({
  dummyData_number: 999,
  dummyData_string: "hello world",
  plantList: [],
});

onMounted(() => {
  console.log("HomePage - onMounted");

  // first check whether the config file exist, if not, create one
  Filesystem.readdir({
    path: "",
    directory: Directory.Data,
  }).then((result) => {
    if (result.files.length > 0) {
      // below deal with directory not empty
      if (
        result.files.findIndex(
          (element) => element.name === "appconfig.json"
        ) === -1
      ) {
        console.log("couldn't find appconfig.json, create new one");

        writeConfig();
      } else {
        console.log("found appconfig.json, read it");
        readConfig();
      }
    } else {
      console.log("empty data directory, create appconfig.json");
      writeConfig();
    }
  });
});

async function presentToast(position: "top" | "middle" | "bottom") {
  const toast = await toastController.create({
    message: "Hello World!",
    duration: 500,
    position: position,
  });

  await toast.present();
}

async function writeConfig() {
  await Filesystem.writeFile({
    path: "appconfig.json",
    directory: Directory.Data,
    data: JSON.stringify(appConfig),
    encoding: Encoding.UTF8,
  });
}

onIonViewDidEnter(() => {
  console.log("HomePage - onIonViewDidEnter");
  readConfig();
});

async function readConfig() {
  const result = await Filesystem.readFile({
    path: "appconfig.json",
    directory: Directory.Data,
    encoding: Encoding.UTF8,
  });
  console.log(result.data);
  appConfig.plantList = JSON.parse(result.data).plantList;
  console.log(appConfig);
}

function test() {
  console.log(appConfig);
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
}

function ionRouterPush() {
  ionRouter.push("/add");
}

function routerPush() {
  router.push("/add");
}

function cardDetail(plant: Plant) {
  console.log(plant);
}
</script>

<style scoped>
button {
  font-size: 2rem;
}

#container {
  background-color: #eee;
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
