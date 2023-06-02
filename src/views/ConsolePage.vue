<script lang="ts">
import { defineComponent } from "vue";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/vue";
import { terminal } from "ionicons/icons";
import Chart from "chart.js/auto";
import type { ChartItem } from "chart.js/auto";

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
    IonInput,
    IonTextarea,
  },
  data() {
    console.log("ConsolePage - data()");

    return {
      console: window.console,
      ionRouter: useIonRouter(),
      terminal,
      max: 10,
      min: 0,
    };
  },
  mounted() {
    console.log("ConsolePage - mounted");

    this.chart = new Chart(this.$refs.chart as ChartItem, {
      type: "line",
      data: {
        // labels: ["Red", "Blue", "Yellow"],
        datasets: [
          {
            label: "# of Votes",
            data: [] as number[],
          },
        ],
      },
      options: {
        // maintainAspectRatio: true,
        // aspectRatio: 1,
        // scales: {
        //   y: {
        //     beginAtZero: true,
        //   },
        // },
      },
    });
  },
  methods: {
    start() {
      console.log("ConsolePage - start");

      console.log(this.chart);

      this.chart.data.datasets[0].data.push(this.getRandomInterger(0, 100));

      this.chart.update();
    },

    getRandomInterger(min = 0, max = 1): number {
      return (
        Math.round(Math.random() * (Math.floor(max) - Math.floor(min))) +
        Math.floor(min)
      );
    },
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
      #chart-container
        #chart-canvas-container
          canvas#chart-canvas(ref="chart")

      IonCard
        IonCardContent
          IonTextarea(:auto-grow="true", placeholder="are you ready")
      IonList
        IonItem(style="background-color: red")
          IonInput(
            v-model="min",
            type="number",
            :max="max - 1",
            style="background-color: pink"
          ) 
          IonInput(
            v-model="max",
            type="number",
            :min="min + 1",
            style="background-color: lightgreen"
          )
          IonButton(
            size="default",
            fill="clear",
            color="secondary",
            @click="console.log(getRandomInterger(min, max))"
          ) give
      IonButton(@click="start") start
</template>

<style scoped lang="sass">
#content-container
  background-color: pink
  height: 500px
  width: 100%

  #chart-container
    background-color: lightgreen
    // height: 300px
    width: 100%
    // overflow: scroll

    #chart-canvas-container
      position: relative
      // width: 2000px
      // height: 100%
</style>
