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
    label?: string;
    zooming?: boolean;
  };
}

const console = window.console;

console.log("BarChart - <setup>");

// 如果使用基于type的props声明，可使用withDefaults来设置默认值
const props = withDefaults(defineProps<Props>(), {
  options: () => ({
    zooming: false,
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
          label: props.options.label || "",
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
      },
    },
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
.flex-container.flex-column
  #scrollable-container
    #canvas-container(ref="canvasContainer")
      canvas(ref="chartCanvas")
  #range-container(v-if="options.zooming")
    IonRange(:value="100", :min="100", :max="400", @ion-change="onRangeChange")
      //- IonText(slot="start") 100%
      //- IonText(slot="end") 400%
</template>

<style scoped lang="scss">
#scrollable-container {
  overflow: scroll;
  flex: auto;
  #canvas-container {
    position: relative;
    height: 100%;
  }
}
</style>
