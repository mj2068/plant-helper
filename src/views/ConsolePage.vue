<script lang="ts">
import { defineComponent } from "vue";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { airplane } from "ionicons/icons";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonContent,
    IonButton,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
  },
  data() {
    return {
      airplane,
    };
  },
});
</script>

<template lang="pug">
IonPage
  IonHeader
    IonToolbar
      IonTitle(slot="start") console
      IonButtons(slot="end")
        IonButton home

  IonContent
    IonList
      IonItem(v-for="(i, x) in 10", :key="x")
        IonLabel(slot="end") {{ i }}
        IonLabel {{ i * 100 }}
</template>
