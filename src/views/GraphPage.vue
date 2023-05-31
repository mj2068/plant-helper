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
import { barChart } from "ionicons/icons";

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
      barChart,
    };
  },
};
</script>
<template lang="pug">
IonPage
  IonHeader
    IonToolbar
      IonIcon.ion-margin-start(slot="start", :icon="barChart", size="large")
      IonButtons.ion-margin-end(slot="end")
        IonButton(@click="ionRouter.navigate('/home', 'root')") home
</template>
