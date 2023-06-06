<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IonRange } from "@ionic/vue";
import Chart from "chart.js/auto";

// 传入的单条数据
interface DataShape {
  x: string;
  y: number;
}

interface Props {
  data: DataShape[];
  options?: {
    // 当前的简化设计关闭了图例（legend）的显示，图例不显示label是图例的子组件，也不显示。
    // label?: string;
    zooming?: boolean;
    roundBorder?: boolean;
  };
}

const console = window.console;

console.log("BarChart - <setup>");

// 如果使用基于type的props声明，可使用withDefaults来设置默认值
const props = withDefaults(defineProps<Props>(), {
  options: () => ({
    zooming: false,
    roundBorder: false,
  }),
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);

const canvasContainer = ref<HTMLDivElement | null>(null);

let chart: Chart<"line", { x: string; y: number }[]> | null = null;

onMounted(() => {
  console.log("BarChart - onMounted");

  if (!chartCanvas.value) return;

  chart = new Chart(chartCanvas.value, {
    type: "line",
    data: {
      datasets: [
        {
          label: "",
          data: props.data,
          tension: 0.3,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          // beginAtZero: true,
          suggestedMin: 10,
          suggestedMax: 30,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        colors: {
          enabled: true,
          // enabled: false,
        },
      },
    },
    plugins: [],
  });
});

const updateChart = (data: DataShape[]) => {
  if (!chart) return;

  chart.data.datasets[0].data = data;
  chart.update();
};

const onRangeChange = (e: CustomEvent) => {
  if (!canvasContainer.value) return;

  canvasContainer.value.style.width = `${e.detail.value}%`;
};

defineExpose({
  updateChart,
});
</script>

<template lang="pug">
.flex-container.flex-column.ion-padding(
  :class="{ 'round-border': options.roundBorder }"
)
  #scrollable-container
    #canvas-container(ref="canvasContainer")
      canvas(ref="chartCanvas")
  #range-container(v-if="options.zooming")
    IonRange(:value="100", :min="100", :max="400", @ion-change="onRangeChange")
      //- IonText(slot="start") 100%
      //- IonText(slot="end") 400%
</template>

<style scoped lang="scss">
@import "@/theme/utils.scss";
.flex-container.flex-column {
  &.round-border {
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
      rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  }
  #scrollable-container {
    overflow: scroll;
    flex: auto;
    #canvas-container {
      position: relative;
      height: 100%;
    }
  }
}
</style>
