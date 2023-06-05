<script lang="ts">
import { defineComponent } from "vue";
import {
  IonPage,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  useIonRouter,
  IonText,
  IonRange,
} from "@ionic/vue";
import { barChart } from "ionicons/icons";
import Chart from "chart.js/auto";
import { IonRangeCustomEvent, RangeChangeEventDetail } from "@ionic/core";
import CommonToolbar from "@/components/CommonToolbar.vue";

interface DataShape {
  x: string;
  y: number;
}

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonText,
    IonRange,
    CommonToolbar,
  },
  setup() {
    console.log("GraphPage - setup");

    return { chart: null } as {
      chart: null | Chart<"bar", DataShape[]>;
    };
  },
  data() {
    console.log("GraphPage - data");

    return {
      console: window.console,
      ionRouter: useIonRouter(),
      barChart,
      inputMax: 10,
      inputMin: 0,
      rollData: [] as number[],
      chartData: [] as DataShape[],
      autoTimerId: null as null | number,
    };
  },
  mounted() {
    console.log("GraphPage - mounted");

    // this.console.log(this);

    this.chart = new Chart(this.$refs["chartCanvas"] as HTMLCanvasElement, {
      type: "bar",
      data: {
        // labels: ["a", "b", "c", "d", "e"],
        datasets: [
          {
            label: "randomness💥",
            data: [
              // { x: 3, y: 10 },
              // { x: 1, y: 5 },
              // { x: "5", y: 20 },
              // { x: "3", y: 25 },
            ],
            // parsing: false,
            // parsing: {
            // xAxisKey: "x",
            // yAxisKey: "y",
            // },
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  },
  methods: {
    getRandomInteger(min = 0, max = 9): number {
      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    roll(t = 1): void {
      for (let i = 0; i < t; i++) {
        this.rollData.push(this.getRandomInteger());
      }
      this.updateChart();
    },

    addData() {
      if (!this.chart) return;

      const upperRange = 9;
      const lowerRange = 0;

      this.chartData = [];
      for (let index = 0; index <= upperRange; index++) {
        this.chartData.push({ x: index.toString(), y: 0 });
      }

      const howManyTimes = 100;

      for (let i = 0; i < howManyTimes; i++) {
        const n = this.getRandomInteger(lowerRange, upperRange);
        this.chartData.forEach((element) => {
          if (element.x === n.toString()) {
            element.y++;
          }
        });
      }

      this.chart.data.datasets[0].data = this.chartData;
      this.chart.update();
    },
    updateChart() {
      if (!this.chart) return;

      const a = Array.from({ length: 10 }, (_, i) => ({
        x: i.toString(),
        y: 0,
      }));
      this.rollData.forEach((element) => {
        a[element].y++;
      });

      this.chart.data.datasets[0].data = a;
      this.chart.update();
    },
    clearData() {
      this.rollData = [];
      this.updateChart();
    },

    auto() {
      if (null !== this.autoTimerId) {
        clearInterval(this.autoTimerId);
        this.autoTimerId = null;
      }

      this.autoTimerId = window.setInterval(() => {
        this.roll(20);
      }, 50);
      console.log("interval id: " + this.autoTimerId);
    },
    stop() {
      if (null !== this.autoTimerId) {
        clearInterval(this.autoTimerId);
        this.autoTimerId = null;
      }
    },
    onSlide(e: IonRangeCustomEvent<RangeChangeEventDetail>) {
      // console.log(e.detail.value);
      const v = e.detail.value as number;

      (
        this.$refs["chart-canvas-container"] as HTMLDivElement
      ).style.width = `${v}%`;
    },
  },
});
</script>

<template lang="pug">
IonPage
  CommonToolbar(:icon="barChart", :title="'graph'")
  //- IonHeader
  //-   IonToolbar
  //-     IonIcon.ion-margin-start(slot="start", :icon="barChart", size="large")
  //-     IonTitle(slot="start") graph
  //-     IonButtons.ion-margin-end(slot="end")
  //-       IonButton(@click="ionRouter.navigate('/home', 'root')") home

  IonContent
    #content-container.ion-padding
      //- title
      .flex-container
        ion-text count random number
      #chart-container.flex-container
        #chart-canvas-container(ref="chart-canvas-container")
          canvas#chart-canvas(ref="chartCanvas")
      //- chart scale range slider container
      .flex-container.ion-justify-content-center
        IonRange(
          style="flex: 0 1 60%",
          :value="100",
          :min="100",
          :max="400",
          :pin="true",
          :pin-formatter="(v) => v + '%'",
          @ion-change="onSlide"
        )
      ion-list.ion-margin-bottom(lines="full")
        ion-item
          ion-label total
          p {{ rollData.length }}
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
      .flex-wrap.flex-container
        IonButton(@click="roll()") roll 1
        IonButton(@click="roll(10)") roll 10
        IonButton(@click="roll(100)") roll 100
        ion-button(color="success", @click="auto") auto
        ion-button(color="warning", @click="stop") stop
        ion-button(color="danger", @click="clearData") clear
</template>

<style scoped lang="sass">
.flex-container
  display: flex
.flex-container.flex-column
  flex-direction: column
.flex-container.flex-wrap
  flex-wrap: wrap

#content-container
  // background-color: lightblue
  min-height: 100%

  #chart-container
    // background-color: lightgreen
    width: 100%
    // height: 400px
    overflow: scroll

    #chart-canvas-container
      position: relative
      width: 100%
      height: 300px
      margin: auto
      flex: 0 0 auto
      // flex-grow: 1
      // flex-shrink: 0
      // flex-basis: auto

      // background-color: rgba(230, 200, 220, 1)

  ion-item
    ion-label
      margin-right: 4px
    ion-input
      --background: lightgrey
      margin-right: 4px
</style>
