<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
  useIonRouter,
} from "@ionic/vue";
import { terminal } from "ionicons/icons";

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      ionRouter: useIonRouter(),
      terminal,
    };
  },
};
</script>
<template lang="pug">
IonPage
  IonHeader
    IonToolbar
      IonIcon.ion-margin-start(slot="start", :icon="terminal", size="large")
      IonButtons.ion-margin-end(slot="end")
        IonButton(@click="ionRouter.navigate('/home', 'root')") home
</template>
