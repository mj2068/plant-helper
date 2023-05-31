<script lang="ts">
import { defineComponent } from "vue";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/vue";
import { terminal } from "ionicons/icons";
import Chart from "chart.js/auto";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonContent,
    IonButton,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
  },
  data() {
    return {
      ionRouter: useIonRouter(),
      terminal,
    };
  },
  mounted() {
    console.log("ConsolePage - mounted");

    console.log(this.$refs.chart);
  },
});
</script>

<template lang="pug">
IonPage
  IonHeader
    IonToolbar
      IonIcon.ion-margin-start(slot="start", :icon="terminal", size="large")
      IonTitle(slot="start") console
      IonButtons.ion-margin-end(slot="end")
        IonButton(@click="ionRouter.navigate('/home', 'root')") home

  IonContent
    #content-container.ion-padding
      IonButton(expand="full") start
      #chart-container(ref="chart")
</template>

<style scoped lang="sass">
#content-container
  background-color: pink
  height: 500px

  #chart-container
    background-color: lightgreen
    height: 300px
</style>
