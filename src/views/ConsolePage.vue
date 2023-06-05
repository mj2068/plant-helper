<script lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import CommonToolbar from "@/components/CommonToolbar.vue";
import { terminal } from "ionicons/icons";
import LineChart from "@/components/LineChart.vue";

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
};
</script>

<template lang="pug">
IonPage
  CommonToolbar(
    title="console",
    :buttons="[{ name: 'test', fn: () => console.log('这里是Console页面') }]"
  )
  IonContent.ion-padding(style="background-color: pink")
    LineChart(:data="data", style="width: 300px; height: 300px")
</template>
