<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, reactive } from "vue";
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import type {
  addPlant,
  AppConf,
  deletePlantById,
  updateConfigFile,
} from "@/types";
import { appDataKey, appConfigUtilsKey } from "@/injectionKeys";

export default defineComponent({
  name: "App",

  components: { IonApp, IonRouterOutlet },

  setup() {
    console.log("App - setup");

    const appData: { appConf: AppConf } = reactive({
      appConf: {
        plantList: [],
        configVersion: "0.0.1",
        firstRun: true,
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
        console.log(appData);
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

    const addPlant: addPlant = function (plant) {
      appData.appConf.plantList.push(plant);
      updateConfigFile();
    };

    const deletePlantById: deletePlantById = function (id) {
      console.log("App - deletePlantById");
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
    };

    // function deletePlantById(id: number) {
    //   console.log("App - deletePlantById");
    //   console.log(id);

    //   // 用findIndex方法找到需要删除的元素
    //   const indexToDelete = appData.appConf.plantList.findIndex((p) => {
    //     if (p.plantId === id) {
    //       console.log("found the plant to delete, id: " + id);
    //       console.log(p);
    //       return true;
    //     } else return false;
    //   });
    //   if (indexToDelete != -1) {
    //     appData.appConf.plantList.splice(indexToDelete, 1);
    //     updateConfigFile();
    //   } else console.log("indexToDelete = " + indexToDelete);
    // }

    const updateConfigFile: updateConfigFile = function () {
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
    };

    provide(appDataKey, appData);

    provide(appConfigUtilsKey, { addPlant, deletePlantById, updateConfigFile });

    onMounted(() => {
      console.log("App - setup - onMounted");
    });
  },
});
</script>
