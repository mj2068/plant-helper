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
      console,
      terminal,
    };
  },
};
</script>

<template lang="pug">
IonPage
  CommonToolbar(
    title="console",
    :buttons="[{ name: 'test', fn: () => console.log('现在是Console页面') }]"
  )
</template>
