<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  useIonRouter,
} from "@ionic/vue";
import { inject } from "vue";
import { appDataKey } from "@/injectionKeys";
const ionRouter = useIonRouter();

const appData = inject(appDataKey);
console.log(appData);
</script>

<template lang="pug">
ion-page
  ion-header 
    ion-toolbar 
      ion-title(slot='start') 测试页
      ion-buttons(slot='end')
        ion-button(@click="ionRouter.navigate('/home', 'root')") 首页 
  ion-content(class='ion-padding')
    
</template>

<style scoped lang="scss"></style>
