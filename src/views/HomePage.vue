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

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container" class="ion-padding">
        <ion-button @click="ionRouterPush">
          <ion-icon slot="icon-only" :icon="addCircleOutline"></ion-icon>
        </ion-button>
        <ion-button @click="routerPush">button 2</ion-button>
        <div>
          <ion-button @click="showAlert()">ION BUTTON</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  alertController,
  IonIcon,
  onIonViewDidEnter,
  useIonRouter,
} from "@ionic/vue";
import { addCircleOutline, rose } from "ionicons/icons";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const console = window.console;

const ionRouter = useIonRouter();
const router = useRouter();

async function showAlert() {
  const alert = await alertController.create({
    header: "header",
    subHeader: "subHeader",
    message: "hello world",
    buttons: ["ok", "cancel"],
  });
  await alert.present();
}

onMounted(() => {
  console.log("HomePage - onMounted");
});

onIonViewDidEnter(() => console.log("HomePage - onIonViewDidEnter"));

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
