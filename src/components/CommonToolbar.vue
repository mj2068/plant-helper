<script lang="ts" setup>
import {
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
    IonIcon.ion-margin-start(slot="start", :icon="props.icon", size="large")
    IonTitle(slot="start") {{ title }}
    IonButtons.ion-margin-end(slot="end")
      IonButton(@click="ionRouter.navigate('/home', 'root')") home
</template>
