<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, onMounted, provide, reactive, computed } from "vue";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import type { AppConf, Plant } from "@/types";

export default defineComponent({
  name: "App",

  components: { IonApp, IonRouterOutlet },

  setup() {
    console.log("App - setup");

    const appData: { appConf: AppConf } = reactive({
      appConf: {
        plantList: [],
        testNumber: -1,
        testString: "",
      },
    });

    Filesystem.readFile({
      path: "appconfig.json",
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    })
      .then((result) => {
        console.log(result);
        console.log(JSON.parse(result.data));
        const appConfData = JSON.parse(result.data) as AppConf;
        appData.appConf = appConfData;
        console.log(appData.appConf);
      })
      .catch((error: Error) => {
        console.error(error);
        if (error.message === "File does not exist") {
          updateConfigFile();
        }
      });

    function addPlant(plant: Plant) {
      appData.appConf.plantList.push(plant);
      updateConfigFile();
    }

    function updateConfigFile() {
      Filesystem.writeFile({
        path: "appconfig.json",
        directory: Directory.Data,
        encoding: Encoding.UTF8,
        data: JSON.stringify(appData.appConf),
      })
        .then((result) => {
          console.log("App - updateConfigFile - update success");
          console.log(result.uri);
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }

    provide("appData", { appData, addPlant });

    onMounted(() => {
      console.log("App - setup - onMounted");
    });
  },

  mounted() {
    console.log("App - mounted");
  },
});
</script>
