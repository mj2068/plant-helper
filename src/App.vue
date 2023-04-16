<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

export default defineComponent({
  name: "App",
  components: { IonApp, IonRouterOutlet },
  setup() {
    console.log("App - setup");
  },
  mounted() {
    console.log("App - mounted");
  },
});
</script>
