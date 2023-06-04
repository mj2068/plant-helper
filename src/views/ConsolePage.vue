<script lang="ts">
import { IonPage } from "@ionic/vue";
import CommonToolbar from "@/components/CommonToolbar.vue";
import { terminal } from "ionicons/icons";

export default {
  components: {
    IonPage,
    CommonToolbar,
  },
  data() {
    return {
      terminal,
    };
  },
};
</script>

<template lang="pug">
IonPage
  CommonToolbar(title="console", :icon="terminal")
</template>
