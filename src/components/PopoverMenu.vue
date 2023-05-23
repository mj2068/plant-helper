<script setup lang="ts">
import { onMounted } from "vue";
import { IonContent, IonList, IonItem } from "@ionic/vue";

onMounted(() => {
  console.log("PopverMenu - onMounted");
});
</script>

<template>
  <div>
    <ion-content>
      <ion-list>
        <ion-item v-for="(i, index) in 4" :key="index" button
          >hello {{ i }}</ion-item
        >
      </ion-list>
    </ion-content>
  </div>
</template>
