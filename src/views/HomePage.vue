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
        <div v-if="true">
          <ion-button> hello </ion-button>
        </div>
        {{ appConfig.dummyData_string }}
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
  IonButton,
  IonTextarea,
  IonCard,
  alertController,
  IonIcon,
  onIonViewDidEnter,
  useIonRouter,
} from "@ionic/vue";
import { rose } from "ionicons/icons";
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";

const console = window.console;

const ionRouter = useIonRouter();
const router = useRouter();

let appConfig = reactive({
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

async function writeConfig() {
  await Filesystem.writeFile({
    path: "appconfig.json",
    directory: Directory.Data,
    data: JSON.stringify(appConfig),
    encoding: Encoding.UTF8,
  });
}

onIonViewDidEnter(() => console.log("HomePage - onIonViewDidEnter"));

async function readConfig() {
  const result = await Filesystem.readFile({
    path: "appconfig.json",
    directory: Directory.Data,
    encoding: Encoding.UTF8,
  });
  appConfig = JSON.parse(result.data);
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
