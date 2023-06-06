<script lang="ts">
import { defineComponent } from "vue";
import {
  IonPage,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  useIonRouter,
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
            label: "组1",
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

    updateChart() {
      if (!this.chart) return;

      const chartData = Array.from({ length: 10 }, (_, i) => ({
        x: i.toString(),
        y: 0,
      }));
      this.rollData.forEach((element) => {
        chartData[element].y++;
      });

      this.chart.data.datasets[0].data = chartData;
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
        this.roll(10);
      }, 100);
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
      const v = e.detail.value;

      (
        this.$refs["chart-canvas-container"] as HTMLDivElement
      ).style.width = `${v}%`;
    },
  },
});
</script>

<template lang="pug">
IonPage
  CommonToolbar(:title="'图表'")
  IonContent
    #content-container.ion-padding
      //- title
      .flex-container
        ion-label 随机数
      #chart-container.flex-container
        #chart-canvas-container(ref="chart-canvas-container")
          canvas#chart-canvas(ref="chartCanvas")
      //- chart scale range slider container
      .flex-container.ion-justify-content-center
        IonRange.ion-no-padding(
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
          ion-label 总数
          p {{ rollData.length }}
      .control.flex-wrap.flex-container
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

  .control ion-button:nth-child(-n+3)
    flex: 1 1 32%
</style>
