<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, onMounted, provide, reactive } from "vue";
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
        const appConfData = JSON.parse(result.data) as AppConf;
        appData.appConf = appConfData;
        console.log(
          "App - setup - read appconfig.json success, appData.appConf:"
        );
        console.log(appData.appConf);
      })
      .catch((error: Error) => {
        console.error(error);
        console.error(error.message);
        if (
          error.message === "File does not exist" ||
          error.message === "File does not exist."
        ) {
          updateConfigFile();
        }
      });

    function addPlant(plant: Plant) {
      appData.appConf.plantList.push(plant);
      updateConfigFile();
    }

    function deletePlant(id: number) {
      console.log("App - deletePlant");

      console.log(id);

      // 用findIndex方法找到需要删除的元素
      const indexToDelete = appData.appConf.plantList.findIndex((p) => {
        if (p.plantId === id) {
          console.log("found the plant to delete, id: " + id);
          console.log(p);
          return true;
        } else return false;
      });
      if (indexToDelete != -1) {
        appData.appConf.plantList.splice(indexToDelete, 1);
        updateConfigFile();
      } else console.log("indexToDelete = " + indexToDelete);
    }

    function updateConfigFile() {
      console.log("App - updateConfigFile");
      console.log(appData);
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

    provide("appData", { appData, addPlant, deletePlant });

    onMounted(() => {
      console.log("App - setup - onMounted");
    });
  },
});
</script>
