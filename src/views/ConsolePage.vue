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
  setup() {
    console.log("ConsolePage - setup()");

    return { chart: null } as { chart: Chart | null };
  },
  data() {
    console.log("ConsolePage - data");

    return {
      console: window.console,
      ionRouter: useIonRouter(),
      terminal,
      inputMax: 10,
      inputMin: 0,
      data: [] as number[],
    };
  },
  mounted() {
    console.log("ConsolePage - mounted");

    this.console.log(this);

    this.chart = new Chart(this.$refs.chartCanvas as ChartItem, {
      type: "bar",
      data: {
        labels: Array.from({ length: 10 }, (_, i) => i),
        datasets: [
          {
            label: "# of appearance",
            data: [] as number[],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
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
      // console.log(this);

      if (!this.chart) return;

      const data = Array.from({ length: 20 }, () =>
        this.getRandomInterger(0, 9)
      );
      console.log(data);
      const count = Array.from({ length: 10 }, () => 0);
      data.forEach((i) => count[i]++);
      this.chart.data.datasets[0].data = count;

      this.chart.update();
    },

    getRandomInterger(min = 0, max = 9): number {
      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min + 1)) + min;
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
          canvas#chart-canvas(ref="chartCanvas")
      IonItem.ion-margin-top(style="background-color: red")
        IonLabel(slot="start") min
        IonInput(
          slot="start",
          v-model="inputMin",
          style="--background: lightgrey",
          type="number",
          :max="inputMax - 1"
        ) 
        IonLabel(slot="start") max
        IonInput(
          slot="start",
          v-model="inputMax",
          style="--background: lightgrey",
          type="number",
          :min="inputMin + 1"
        )
        IonButton(
          solt="end",
          size="default",
          color="secondary",
          @click="console.log(getRandomInterger(inputMin, inputMax))"
        ) give
      IonButton(@click="start") start
</template>

<style scoped lang="sass">
#content-container
  // background-color: lightblue
  min-height: 100%

  #chart-container
    background-color: lightgreen
    width: 100%
    display: flex
    justify-content: center

    height: 400px
    overflow: scroll

    #chart-canvas-container
      background-color: rgba(230, 200, 220, 1)
      flex-grow: 1
      flex-shrink: 0
      position: relative
      width: 100%
      height: 300px
</style>
