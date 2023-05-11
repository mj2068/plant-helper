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
            <ion-item lines="full" id="item-plant-name" button>
              <ion-label position="fixed" slot="start">植物名称</ion-label>
              <ion-text slot="end" class="ion-text-end">{{
                plant.plantName
              }}</ion-text>
              <ion-icon slot="end" class="" :icon="chevronForward"></ion-icon>
            </ion-item>

            <!-- 编辑植物名称modal -->
            <ion-modal
              ref="editPlantNameModal"
              trigger="item-plant-name"
              @ionModalWillPresent="onEditPlantNameModalWillPresent"
              @ionModalDidPresent="onEditPlantNameModalDidPresent"
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
                  ref="editPlantNameModalPlantNameInputElement"
                  style="--background: lightgrey"
                  v-model="editPlantNameModalPlantName"
                ></ion-input>
              </ion-content>
            </ion-modal>

            <ion-item lines="full" id="item-plant-description" button>
              <ion-label position="fixed" slot="start">植物描述</ion-label>
              <!-- <ion-note slot="end" class="ion-text-wrap ion-text-end">{{
                plant.plantDescription
              }}</ion-note> -->
              <p slot="end" class="ion-text-end" style="width: 100%">
                {{ plant.plantDescription }}
              </p>
              <ion-icon slot="end" :icon="chevronForward"></ion-icon>
            </ion-item>

            <!-- 编辑植物描述modal -->
            <ion-modal
              ref="editPlantDescriptionModal"
              trigger="item-plant-description"
              @ionModalWillPresent="onEditPlantDescriptionModalWillPresent"
              @ionModalDidPresent="onEditPlantDescriptionModalDidPresent"
              v-on:willDismiss="onEditPlantDescriptionModalWillDismiss"
            >
              <ion-header>
                <ion-toolbar>
                  <ion-buttons slot="start">
                    <ion-button @click="cancelEditPlantDescriptionModal"
                      >取消</ion-button
                    >
                  </ion-buttons>
                  <ion-title>修改植物描述</ion-title>
                  <ion-buttons slot="end">
                    <ion-button :strong="true" @click="saveEditPlantDescriptionModal"
                      >保存</ion-button
                    >
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content>
                <ion-textarea
                  ref="editPlantDescriptionModalPlantDescriptionInputElement"
                  style="--background: lightgrey"
                  v-model="editPlantDescriptionModalPlantDescription"
                ></ion-textarea>
              </ion-content>
            </ion-modal>
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
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { OverlayEventDetail } from "@ionic/core";
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
  IonTextarea,
  IonModal,
  IonNote,
  useIonRouter,
} from "@ionic/vue";
import {
  star,
  ellipsisVerticalSharp,
  trashSharp,
  image,
  chevronForward,
} from "ionicons/icons";
import { onMounted, ref, inject, computed } from "vue";
import { useRoute } from "vue-router";

import { AppConf } from "@/types";
import { Modal } from "@ionic/core/dist/types/components/modal/modal";
import { Input } from "@ionic/core/dist/types/components/input/input";

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
  deletePlant: (id: number) => void;
  updateConfigFile: () => void;
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

});

// 植物名称编辑页面的template ref
// 此处发现ionic template ref对typescript的支持还是有点迷的，以下的InstanceType是一个
// 凑合事儿的
const editPlantNameModal = ref<InstanceType<typeof IonModal> | null>(null);
function cancelEditPlantNameModal() {
  // console.log(editPlantNameModal);
  // console.log(editPlantNameModal.value.$el === editPlantNameModal.value.$el.el);
  (editPlantNameModal.value?.$el as Modal).dismiss(null, "cancel");
}

function saveEditPlantNameModal() {
  (editPlantNameModal.value?.$el as Modal).dismiss(null, "save");
}

// 植物名称编辑窗口的input的响应式变量
const editPlantNameModalPlantName = ref("");
// 植物名称编辑窗口的input element的template ref
const editPlantNameModalPlantNameInputElement = ref<InstanceType<
  typeof IonInput
> | null>(null);

// 在modal将要出现之前将input初始值设为原名称
function onEditPlantNameModalWillPresent() {
  if (plant.value) {
    editPlantNameModalPlantName.value = plant.value.plantName;
  }
}
function onEditPlantNameModalDidPresent() {
  const input = editPlantNameModalPlantNameInputElement.value?.$el as Input;

  // 初始自动焦点到input element
  input.setFocus();
  // 初始自动全选
  input.getInputElement().then((result: HTMLInputElement) => {
    result.setSelectionRange(0, -1);
    console.log(result);
  });
}

function onEditPlantNameModalWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
  console.log(ev.detail.role);
  if (ev.detail.role === "save" && plant.value) {
    console.log("new name: " + editPlantNameModalPlantName.value);
    plant.value.plantName = editPlantNameModalPlantName.value;
    updateConfigFile();
  }
}

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
    // background-color: #444;

    ion-item {
      background-color: red;

      ion-label {
      }

      ion-text {
        width: 100%;
      }

      // white-space:pre-wrap会使字符串内容保持原始
      p {
        width: 100%;
        white-space: pre-wrap;
      }

      ion-icon {
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
