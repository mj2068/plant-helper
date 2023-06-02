<script lang="ts">
import { defineComponent } from "vue";
import {
  IonPage,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  useIonRouter,
  IonText,
} from "@ionic/vue";
import { barChart } from "ionicons/icons";
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
    IonItem,
    IonLabel,
    IonInput,
    IonText,
  },
  setup() {
    console.log("ConsolePage - setup()");

    return { chart: null } as { chart: null | Chart };
  },
  data() {
    console.log("ConsolePage - data");

    return {
      console: window.console,
      ionRouter: useIonRouter(),
      barChart,
      inputMax: 10,
      inputMin: 0,
      data: [] as number[],
      count: Array.from({ length: 10 }, () => 0),
    };
  },
  mounted() {
    console.log("ConsolePage - mounted");

    this.console.log(this);

    this.chart = new Chart(this.$refs["chart-canvas"] as ChartItem, {
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

      const data = Array.from({ length: 100 }, () => this.getRandomInteger());
      // console.log(data);
      const count = Array.from({ length: 10 }, () => 0);
      data.forEach((i) => count[i]++);
      this.chart.data.datasets[0].data = count;
      this.chart.update();
    },
    getRandomInteger(min = 0, max = 9): number {
      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    addData() {
      const r = this.getRandomInteger();
      this.count[r]++;
      this.data.push(r);
      this.updateChart();
    },
    roll10() {
      if (!this.chart) return;

      for (let i = 0; i < 10; i++) {
        const r = this.getRandomInteger();
        this.count[r]++;
        this.data.push(r);
        this.updateChart();
      }
    },
    roll100() {
      if (!this.chart) return;

      for (let i = 0; i < 100; i++) {
        const r = this.getRandomInteger();
        this.count[r]++;
        this.data.push(r);
        this.updateChart();
      }
    },
    clearData() {
      this.data = [];
      this.count = Array.from({ length: 10 }, () => 0);
      this.updateChart();
    },
    updateChart() {
      if (!this.chart) {
        return;
      }
      this.chart.data.datasets[0].data = this.count;
      this.chart.update();
    },
    changeChartContainer() {
      (this.$refs["chart-canvas-container"] as HTMLDivElement).style.width =
        "50%";
    },
  },
});
</script>

<template lang="pug">
IonPage
  IonHeader
    IonToolbar
      IonIcon.ion-margin-start(slot="start", :icon="barChart", size="large")
      IonTitle(slot="start") graph
      IonButtons.ion-margin-end(slot="end")
        IonButton(@click="ionRouter.navigate('/home', 'root')") home

  IonContent
    #content-container.ion-padding
      .flex-container.flex-column
        ion-text count each roll
      #chart-container
        #chart-canvas-container(ref="chart-canvas-container")
          canvas#chart-canvas(ref="chart-canvas")
      ion-item
        ion-label data number
        p {{ data.length }}
      IonItem.ion-margin-top
        IonLabel(slot="start") min:
        IonInput(
          slot="start",
          v-model="inputMin",
          type="number",
          :max="inputMax - 1"
        ) 
        IonLabel(slot="start") max:
        IonInput(
          slot="start",
          v-model="inputMax",
          type="number",
          :min="inputMin + 1"
        )
        IonButton(
          solt="end",
          size="default",
          color="secondary",
          @click="console.log(getRandomInteger(inputMin, inputMax))"
        ) gimme

      IonButton(@click="start") start
      IonButton(@click="addData") roll 1
      ion-button(@click="roll10") roll 10
      ion-button(@click="roll100") roll 100
      ion-button(color="warning", @click="clearData") clear
      br
      ion-button(@click="changeChartContainer") change chart width
</template>

<style scoped lang="sass">
.flex-container
  display: flex
.flex-column
  flex-direction: column
#content-container
  // background-color: lightblue
  min-height: 100%

  #chart-container
    // background-color: lightgreen
    width: 100%
    display: flex
    justify-content: center

    // height: 400px
    overflow: scroll

    #chart-canvas-container
      // background-color: rgba(230, 200, 220, 1)
      flex-grow: 1
      flex-shrink: 0
      position: relative
      width: 150%
      height: 350px

  ion-item
    ion-label
      margin-right: 4px
    ion-input
      --background: lightgrey
      margin-right: 4px
</style>
