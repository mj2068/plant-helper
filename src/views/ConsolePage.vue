<script lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import CommonToolbar from "@/components/CommonToolbar.vue";
import { terminal } from "ionicons/icons";
import LineChart from "@/components/LineChart.vue";
import { SplashScreen } from "@capacitor/splash-screen";

export default {
  components: {
    IonPage,
    CommonToolbar,
    IonContent,
    LineChart,
  },
  data() {
    return {
      console,
      terminal,
      data: [
        { x: "0529", y: -1 },
        { x: "0601", y: 8 },
        { x: "0602", y: 15 },
        { x: "0606", y: 22 },
        { x: "0608", y: 18 },
        { x: "0609", y: 25 },
        { x: "0613", y: 32 },
      ],
    };
  },
  mounted() {
    console.log("ConsolePage - mounted");
  },
  methods: {
    updateChart() {
      (this.$refs.chart1 as InstanceType<typeof LineChart>).updateChart([
        { x: "1", y: Math.random() * 40 - 5 },
        { x: "2", y: Math.random() * 40 - 5 },
        { x: "3", y: Math.random() * 40 - 5 },
        { x: "4", y: Math.random() * 40 - 5 },
        { x: "5", y: Math.random() * 40 - 5 },
        { x: "6", y: Math.random() * 40 - 5 },
        { x: "7", y: Math.random() * 40 - 5 },
      ]);
    },
    async showSplash() {
      await SplashScreen.show({
        showDuration: 2000,
        autoHide: true,
      });
    },
  },
};
</script>

<template lang="pug">
IonPage
  CommonToolbar(
    title="console",
    :buttons="[{ name: 'test', onClick: () => console.log('这里是Console页面') }]"
  )
  IonContent.ion-padding(style="background-color: pink")
    .flex-container.ion-justify-content-center
      LineChart.line-chart(
        ref="chart1",
        :data="data",
        :options="{ zooming: true }"
      )
    IonButton(@click="updateChart") update
    IonButton(@click="showSplash") splash
</template>

<style scoped lang="scss">
@import "@/theme/utils.scss";

.flex-container {
  height: 250px;
  // background-color: pink;

  .line-chart {
    // flex: 1 0 auto;
    width: 80%;
    height: 100%;
  }
}
</style>
