<script lang="ts" setup>
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/vue";

const ionRouter = useIonRouter();

const props = defineProps<{
  title?: string;
  icon?: string;
}>();
</script>

<template lang="pug">
IonHeader
  IonToolbar
    IonBackButton(slot="start", default-href="/home")
    IonIcon.ion-margin-start(
      slot="secondary",
      :icon="props.icon",
      size="large"
    )
    IonTitle(slot="start") {{ title }}
    IonButtons.ion-margin-end(slot="end")
</template>
