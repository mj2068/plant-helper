<script setup lang="ts">
import { onMounted } from "vue";
import {
  IonList,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonIcon,
  popoverController,
} from "@ionic/vue";
import { trash, information, informationCircle } from "ionicons/icons";

onMounted(() => {
  console.log("PopverMenu - onMounted");
});
</script>

<template>
  <ion-list>
    <ion-item-group>
      <ion-item
        button
        @click="popoverController.dismiss(null, 'delete')"
        lines="none"
        ><ion-icon
          slot="start"
          :icon="trash"
          color="danger"
          size="small"
          class=""
        ></ion-icon
        ><ion-label slot="start" color="danger" class=""
          >删除</ion-label
        ></ion-item
      >
    </ion-item-group>
    <ion-item-group>
      <ion-item button lines="none">
        <IonIcon
          :icon="informationCircle"
          slot="start"
          color=""
          size="small"
        ></IonIcon>
        <ion-label color="">关于</ion-label>
      </ion-item>
    </ion-item-group>
  </ion-list>
</template>

<style scoped lang="scss">
ion-icon {
  margin-right: 6px;
}
</style>
