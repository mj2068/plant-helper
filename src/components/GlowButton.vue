<script lang="ts">
import { defineComponent } from "vue";
import { IonButton, IonIcon } from "@ionic/vue";
export default defineComponent({
  props: ["color", "bgcolor", "icon", "size"],
  data() {
    return {
      IonButton,
      IonIcon,
    };
  },
  mounted() {
    console.log(this.icon, this.size);
  },
});
</script>
<template>
  <div>
    <ion-button
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
$color-primary: #3a2802;
$color-primary-light: #000000;

ion-button {
  // animation: glow 1s infinite;
  // border: none;
  // outline: none;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  --border-radius: 50%;
  --padding-start: 8px;
  --padding-end: 8px;

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
    transition: all 0.3s ease-in-out;
    width: 120%;
    height: 120%;
    // translate: -50%;
    // top: 0;
    // right: 0;
    z-index: -1;
  }

  &:hover::before {
    filter: blur(12px);
    opacity: 1;
  }

  ion-icon {
    --ionicon-stroke-width: 52px;
  }
}

@keyframes glow {
  0% {
    background: var(--background);
  }
  50% {
    background: $color-primary-light;
  }
  100% {
    background: var(--background);
  }
}
</style>
