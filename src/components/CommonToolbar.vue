<script lang="ts" setup>
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";

const props = defineProps<{
  title?: string;
  icon?: string;
  buttons?: { name: string; onClick: () => void }[];
}>();
</script>

<template lang="pug">
IonHeader
  IonToolbar
    IonBackButton(slot="start", default-href="/home")
    img.ion-margin-start(
      v-if="props.icon",
      slot="secondary",
      :icon="props.icon",
      size="large"
    )
    IonTitle(slot="start") {{ title }}
    IonButtons.ion-margin-end(slot="end")
      IonButton(
        v-for="(button, i) in buttons",
        :key="i",
        @click="button.onClick"
      ) {{ button.name }}
</template>
