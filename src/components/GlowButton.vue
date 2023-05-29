<script lang="ts">
import { defineComponent, ref } from "vue";
import { IonButton, IonIcon } from "@ionic/vue";
import { extensionPuzzle } from "ionicons/icons";
export default defineComponent({
  props: {
    color: {
      type: String,
      default: "black",
    },
    bgcolor: {
      type: String,
      default: "white",
    },
    icon: {
      type: String,
      default: extensionPuzzle,
    },
    size: {
      type: Number,
      default: 64,
      validator: (v: number) => v >= 32 && v <= 128,
    },
  },

  setup(a, b) {
    console.log(a, b);
  },

  components: { IonButton, IonIcon },

  data() {
    return {
      button: ref<Element | null>(null),
      IonButton,
      IonIcon,
    };
  },

  mounted() {
    console.log("GlowButton - mounted");
  },
});
</script>

<!-- 
  ******************************************************************************
  *****************************         TEMPLATE       *************************
  ******************************************************************************
-->
<template>
  <div>
    <ion-button
      :ref="(el) => (button = el as Element)"
      :style="{
        width: size + 'px',
        height: size + 'px',
        '--color': color,
        '--background': bgcolor,
      }"
      ><ion-icon
        slot="icon-only"
        :icon="icon"
        :style="{ 'font-size': size + 'px' }"
      ></ion-icon
    ></ion-button>
  </div>
</template>

<style scoped lang="scss">
$color-primary: gold;
$color-primary-light: gold;

ion-button {
  // animation: glow 1s infinite;
  // border: none;
  // outline: none;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  --border-radius: 50%;
  // --padding-start: 12px;
  // --padding-end: 12px;

  &:hover {
    // animation: glow 1s ease-in infinite;
  }

  &::before {
    animation: glow 4s ease-in infinite;
    background: var(--background);
    border-radius: 50%;
    content: "";
    filter: blur(8px);
    opacity: 0.8;
    position: absolute;
    transition: all 1s ease-in-out;
    width: 120%;
    height: 120%;
    // translate: -50%;
    // top: 0;
    // right: 0;
    z-index: -1;
  }

  &:hover::before {
    scale: 1.2;
    filter: blur(16px);
    opacity: 1;
  }

  ion-icon {
    --ionicon-stroke-width: 52px;
  }
}

@keyframes glow {
  0% {
    background: gold;
  }
  50% {
    scale: 0.8;
    // background: var(--background);
    // translate: 50px 50px;
  }
  100% {
    background: gold;
  }
}
</style>
