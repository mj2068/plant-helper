<script lang="ts" setup>
import {
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
  IonButton,
  IonSegment,
  IonSegmentButton,
  modalController,
} from "@ionic/vue";
import { ellipse, construct } from "ionicons/icons";
import { ref, onMounted } from "vue";

const console = window.console;

const props = defineProps(["color"]);

const currentColor = ref("");

// 预设和自定义选择颜色选项卡变量
const colorMode = ref("preset");

const colors = [
  "#d7dace",
  "#ffe9b3",
  "#ffdc74",
  "#ffc176",
  "#d8e2dc",
  "#ffe5d9",
  "#ffcad4",
  "#f4acb7",
  "#ccd5ae",
  "#e9edc9",
  "#fefae0",
  "#faedcd",
  "#eccbd9",
  "#e1eff6",
  "#97d2fb",
  "#83bcff",
];

function generateColorString(): string {
  const characters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
}

onMounted(() => {
  console.log("ColorModal - onMounted");
  console.log("props color: " + props.color);

  currentColor.value = props.color;
});

function selectAndDismiss(index: number) {
  console.log("ColorModal - selectAndDismiss");

  currentColor.value = colors[index];

  modalController.dismiss(colors[index], "confirm");
}
</script>

<template>
  <div id="color-modal-wrapper" class="ion-padding">
    <h2>选择颜色</h2>
    <IonSegment :value="colorMode" class="ion-margin-bottom">
      <IonSegmentButton
        value="preset"
        class="ion-no-margin"
        @click="colorMode = 'preset'"
        >预设</IonSegmentButton
      >
      <IonSegmentButton
        value="custom"
        class="ion-no-margin"
        @click="colorMode = 'custom'"
        >自定义</IonSegmentButton
      >
    </IonSegment>

    <div v-if="colorMode === 'preset'" id="preset-container">
      <ion-grid>
        <ion-row v-for="(y, m) in 4" :key="m">
          <ion-col v-for="(x, n) in 4" :key="n">
            <ion-button
              :fill="
                // 这里的数学计算是为了用上面的row和col的index计算出当前是哪个颜色
                colors[(y - 1) * 4 + x - 1] === currentColor
                  ? 'outline'
                  : 'clear'
              "
              class="ion-margin"
              @click="selectAndDismiss((y - 1) * 4 + x - 1)"
            >
              <ion-icon
                slot="icon-only"
                :icon="ellipse"
                :style="{ color: colors[(y - 1) * 4 + x - 1] }"
              ></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
    <div v-else id="custom-container">
      <!-- 正在建设中。。。 -->
      <ion-icon
        :icon="construct"
        style="font-size: 64px; --ion-margin: 64px"
        class="ion-margin"
      ></ion-icon>
    </div>
  </div>
</template>

<!-- ion modals are presented at root level, style cannot be scoped -->
<style lang="scss">
ion-modal#color-modal {
  // --min-width: 60%;
  // --max-width: 80%;
  // --min-height: 40%;
  // --max-height: 80%;
  --width: fit-content;
  --height: fit-content;
  --border-radius: 4px;
  --box-shadow: 0px 12px 48px rgba(0, 0, 0, 0.4);

  #color-modal-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    ion-button {
      width: 36px;
      height: 36px;

      --border-radius: 50%;
      --padding-start: 0px;
      --padding-end: 0px;

      --ion-margin: 8px;
    }

    ion-icon {
      font-size: 32px;
    }
  }
}
</style>
