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
        <ion-button @click="readFile">read</ion-button>
        <ion-button @click="deleteFile">delete</ion-button>
      </div>
      <ion-card class="ion-padding">
        <ion-textarea v-model="userdata" :rows="textRow">{{
          userdata
        }}</ion-textarea>

        <ion-button @click="saveUserdata">save</ion-button>
      </ion-card>
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const console = window.console;

const ionRouter = useIonRouter();
const router = useRouter();
const textRow = 10;

const userdata = ref("metabolism");

onMounted(() => {
  console.log("HomePage - onMounted");
});

onIonViewDidEnter(() => console.log("HomePage - onIonViewDidEnter"));

async function showAlert() {
  const alert = await alertController.create({
    header: "header",
    subHeader: "subHeader",
    message: "hello world",
    buttons: ["ok", "cancel"],
  });
  await alert.present();
}

function readFile() {
  Filesystem.readFile({
    path: "userdata.json",
    directory: Directory.Data,
    encoding: Encoding.UTF8,
  })
    .then((value) => {
      userdata.value = value.data;
    })
    .catch((error) => {
      console.error(error);
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
}

function saveUserdata() {
  Filesystem.writeFile({
    directory: Directory.Data,
    path: "userdata.json",
    data: userdata.value,
    encoding: Encoding.UTF8,
  });
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
  background-color: #ddd;
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
