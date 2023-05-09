<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button @click="ionRouter.navigate('/home', 'root')">
            首页
          </ion-button>
          <ion-button v-on:click="console.log(`id:${id}`)">
            <ion-icon slot="icon-only" :icon="ellipsisVerticalSharp"></ion-icon>
          </ion-button>
          <ion-button v-on:click="test">TEST</ion-button>
        </ion-buttons>
        <ion-title>{{ plant?.plantName }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div id="content-container">
        <div id="plant-found-container" class="container" v-if="plant != null">
          <div id="plant-image-container" class="ion-justify-content-center">
            <ion-card><img :src="plantImageSrc" alt="植物图片" /></ion-card>
          </div>
          <ion-list>
            <ion-item id="item-plant-name" button :detail="true">
              <ion-label position="fixed">植物名称</ion-label>
              <!-- <ion-input
                :class="{ editing: editMode }"
                v-model="plantName"
                placeholder=""
              ></ion-input> -->
              <ion-text slot="end" class="ion-margin-end">{{
                plant.plantName
              }}</ion-text>
            </ion-item>
            <!-- 修改职务名称modal -->
            <ion-modal
              ref="editPlantNameModal"
              trigger="item-plant-name"
              @ionModalWillPresent="onEditPlantNameModalWillPresent"
              v-on:willDismiss="onEditPlantNameModalWillDismiss"
            >
              <ion-header>
                <ion-toolbar>
                  <ion-buttons slot="start">
                    <ion-button @click="cancelEditPlantNameModal"
                      >取消</ion-button
                    >
                  </ion-buttons>
                  <ion-title>修改植物名称</ion-title>
                  <ion-buttons slot="end">
                    <ion-button :strong="true" @click="saveEditPlantNameModal"
                      >保存</ion-button
                    >
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content>
                <ion-input
                  style="--background: lightgrey"
                  v-model="editPlantNameModalPlantName"
                ></ion-input>
              </ion-content>
            </ion-modal>
            <ion-item button :detail="true">
              <ion-label position="fixed">植物描述</ion-label>
              <ion-text slot="end" class="ion-margin-end">{{
                plant.plantDescription
              }}</ion-text>
            </ion-item>
            <ion-item color="dark">
              <ion-label>植物ID</ion-label>
              <ion-input readonly :value="plant.plantId"></ion-input>
            </ion-item>
          </ion-list>
        </div>
        <!-- 此div用于在找不到该id的plant的这种特殊情况下给用户一个提示 -->
        <div id="plant-null-container" class="container" v-else>
          <h2>未找到该植物</h2>
          <h4>
            <i>(id:{{ id }})</i>
          </h4>
        </div>
      </div>
      <div id="controls">
        <ion-button
          color="danger"
          v-on:click="doDelete(parseInt(id as string))"
        >
          删除
          <ion-icon slot="start" :icon="trashSharp"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, inject, computed } from "vue";
import {
  IonToolbar,
  IonTitle,
  IonHeader,
  IonPage,
  IonContent,
  IonButtons,
  IonButton,
  IonBackButton,
  IonCard,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonModal,
  useIonRouter,
} from "@ionic/vue";
import { useRoute } from "vue-router";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { star, ellipsisVerticalSharp, trashSharp, image } from "ionicons/icons";
import { AppConf, Plant } from "@/types";
import { OverlayEventDetail } from "@ionic/core";

const console = window.console;

console.log("DetailPage - <setup>");

const ionRouter = useIonRouter();
const route = useRoute();

const { id } = route.params;
console.log("DetailPage - <setup> id: ");
console.log(id);

const { appData, deletePlant, updateConfigFile } = inject("appData") as {
  appData: {
    appConf: AppConf;
  };
  addPlant: (plant: Plant) => void;
  deletePlant: (id: number) => void;
  updateConfigfile: () => void;
};

const plantImageSrc = ref(star);

const plant = computed(() => {
  for (const p of appData.appConf.plantList) {
    if (p.plantId.toString() === id) {
      setPlantImageSrc(p.plantImageFilename);
      return p;
    }
  }
  return null;
});

onMounted(() => {
  console.log("DetailPage - onMounted");

  // reloadPlantFromConfig();
});

const editPlantNameModal = ref<any | null>(null);
function cancelEditPlantNameModal() {
  // console.log(editPlantNameModal);
  // console.log(editPlantNameModal.value.$el === editPlantNameModal.value.$el.el);
  editPlantNameModal.value?.$el.dismiss(null, "cancel");
}

const editPlantNameModalPlantName = ref("");
function onEditPlantNameModalWillPresent() {
  if (plant.value) {
    editPlantNameModalPlantName.value = plant.value.plantName;
  }
}

function saveEditPlantNameModal() {
  editPlantNameModal.value.$el.dismiss(null, "save");
}

function onEditPlantNameModalWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
  console.log(ev.detail.role);
  if (ev.detail.role === "save" && plant.value) {
    console.log("new name: " + editPlantNameModalPlantName.value);
    plant.value.plantName = editPlantNameModalPlantName.value;
    updateConfigFile();
  }
}
// watch(appData, () => {
//   console.log("DetailPage - watch - appData");

//   reloadPlantFromConfig();
// });

function setPlantImageSrc(imageFilename: string) {
  if (imageFilename !== "") {
    Filesystem.getUri({
      path: "images/" + imageFilename,
      directory: Directory.Data,
    }).then((result) => {
      console.log(result);
      plantImageSrc.value = Capacitor.convertFileSrc(result.uri);
    });
  } else {
    plantImageSrc.value = image;
  }
}

// function reloadPlantFromConfig() {
//   for (const p of appData.appConf.plantList) {
//     if (p.plantId.toString() === id) {
//       // 将根据id找到的元素赋给组件ref变量plant
//       plant.value.description = p.plantDescription;
//       plant.value.name = p.plantName;
//       plant.value.id = p.plantId;
//       // 判断此plant元素图片文件名属性是否为空，如否则获取其uri
//       if (p.plantImageFilename !== "") {
//         Filesystem.getUri({
//           path: "images/" + p.plantImageFilename,
//           directory: Directory.Data,
//         }).then((result) => {
//           plant.value.imageFileUri = result.uri;
//         });
//       }
//     }
//   }
// }

function save() {
  console.log("DetailPage - enterEdit");
}

function doDelete(deleteId: number) {
  deletePlant(deleteId);
  ionRouter.navigate("/home", "root");
}

function test() {
  return;
}
</script>

<style scoped lang="scss">
ion-content {
  #plant-image-container {
    display: flex;
    // justify-content: center;
    // height: 200px;

    ion-card {
      // max-height: 300px;
      // width: 100%;
      // flex: 1;

      img,
      ion-img {
        width: 100%;
        display: block;
        max-height: 300px;
        object-fit: contain;
      }

      ion-button {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 32px;
        height: 32px;

        margin-right: 4px;
        --border-radius: 50%;
        --padding-start: 8px;
        --padding-end: 8px;
      }
    }
  }

  ion-list {
    ion-item {
      ion-input {
        // text-align: right;
      }

      ion-input.editing {
        border-style: groove;
        border-radius: 4px;
        border-width: 2px;
      }

      ion-textarea.editing {
        border-style: groove;
        border-radius: 4px;
        border-width: 2px;
      }
    }
  }
  div[id="controls"] {
    display: flex;
    justify-content: space-between;
    // background-color: moccasin;

    ion-button[color="danger"] {
      // 这里margin-left设为auto配合flex容器的space-between让该元素右对齐
      margin-left: auto;
    }
  }
}
</style>
