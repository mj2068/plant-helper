<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, reactive } from "vue";
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import type { addPlant, AppConf, updateConfigFile } from "@/types";
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

    function deletePlantById(id: number) {
      console.log("App - deletePlantById");
      console.log(id);

      // 用find找到需要删除的元素
      const plantToDelete = appData.appConf.plantList.find((p, index) => {
        if (p.plantId === id) {
          console.log("found the plant to delete, splicing, and it's: ");
          console.log(p);
          appData.appConf.plantList.splice(index, 1);
          return true;
        } else {
          return false;
        }
      });
      // 因为find里面在不能异步，所以删除图片文件操作需要独立出来
      if (plantToDelete) {
        if (plantToDelete.plantImageFilename) {
          Filesystem.deleteFile({
            path: `images/${plantToDelete.plantImageFilename}`,
            directory: Directory.Data,
          }).catch((e) => console.error(e));
        } else console.log("no image file");
        // 更新配置文件
        updateConfigFile();
      } else {
        console.log("didn't find the plant to delete, id: " + plantToDelete);
      }
    }

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
