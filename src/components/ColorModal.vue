<script lang="ts" setup>
import {
  IonHeader,
  IonTitle,
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButtons,
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
  "#CB40B7",
  "#0FC05C",
  "#473ACD",
  "#7441AD",
  "#44076D",
  "#D28C6F",
  "#0B5694",
  "#E4C962",
  "#3D257A",
  "#16F734",
  "#3041CD",
  "#42D3AD",
  "#BC2283",
  "#C9ABA5",
  "#A22A3D",
  "#A8EFAD",
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
        @click="colorMode = 'preset'"
        class="ion-no-margin"
        >预设</IonSegmentButton
      >
      <IonSegmentButton
        value="custom"
        @click="colorMode = 'custom'"
        class="ion-no-margin"
        >自定义</IonSegmentButton
      >
    </IonSegment>

    <div v-if="colorMode === 'preset'" id="preset-container">
      <ion-grid>
        <ion-row v-for="(y, index) in 4" :key="index">
          <ion-col v-for="(x, index) in 4" :key="index">
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
                :icon="ellipse"
                slot="icon-only"
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
