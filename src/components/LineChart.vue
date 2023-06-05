<script setup lang="ts">
import Chart from "chart.js/auto";
import { onMounted, ref } from "vue";

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
</script>

<template lang="pug">
#canvas-container(ref="canvasContainer")
  canvas(ref="chartCanvas")
</template>

<style lang="scss">
#canvas-container {
  background-color: rgba(175, 197, 204, 0.13);
}
</style>
