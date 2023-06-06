<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="'/home'"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button id="more-menu-button">
            <ion-icon slot="icon-only" :icon="ellipsisVertical"></ion-icon>
            <ion-popover
              id="detail-more-menu-popover"
              trigger="more-menu-button"
              show-backdrop="false"
              size="auto"
              @ionPopoverWillDismiss="onMoreMenuDeleteWillDismiss"
            >
              <MoreMenuPopover></MoreMenuPopover>
            </ion-popover>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ plant?.plantName }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="plant != null" id="plant-found-container" class="container">
        <div v-if="plantImageDataUrl" id="image-container">
          <ion-card button class="" @click="openImage">
            <img :src="plantImageDataUrl" alt="植物图片" />
            <ion-button
              id="delete-image-button"
              fill="solid"
              color="light"
              @click.stop="deleteImage"
            >
              <ion-icon slot="icon-only" :icon="trashSharp"></ion-icon>
            </ion-button>
          </ion-card>
        </div>
        <div v-else id="no-image-container">
          <ion-card button @click="addImage">
            <div>
              <ion-button fill="clear" @click.stop="addImage"
                ><ion-icon slot="start" :icon="addCircleOutline"></ion-icon>
                添加图片
              </ion-button>
            </div>
          </ion-card>
        </div>

        <ion-list>
          <!-- 植物名称 -->
          <ion-item id="item-plant-name" lines="full" button>
            <ion-text slot="start" class="label-column">植物名称</ion-text>
            <ion-text
              id="plant-name"
              slot="end"
              class="content-column ion-text-end"
              >{{ plant.plantName }}</ion-text
            >
            <ion-icon slot="end" :icon="chevronForward"></ion-icon>
          </ion-item>
          <!-- 编辑植物名称modal -->
          <ion-modal
            id="edit-plant-name-modal"
            ref="editPlantNameModal"
            trigger="item-plant-name"
            @ionModalWillPresent="onEditPlantNameModalWillPresent"
            @ionModalDidPresent="onEditPlantNameModalDidPresent"
            @willDismiss="onEditPlantNameModalWillDismiss"
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
              <ion-item :counter="true" :counterFormatter="plantNameFormatter">
                <ion-input
                  ref="editPlantNameModalPlantNameInputElement"
                  v-model="editPlantNameModalPlantName"
                  :maxlength="50"
                ></ion-input>
              </ion-item>
            </ion-content>
          </ion-modal>

          <!-- 植物描述 -->
          <ion-item id="item-plant-description" lines="full" button>
            <ion-text slot="start" class="label-column">植物描述</ion-text>
            <ion-text
              id="plant-desc"
              slot="end"
              class="content-column ion-text-end ion-margin-top ion-margin-bottom"
            >
              {{ plant.plantDescription }}
            </ion-text>
            <ion-icon slot="end" :icon="chevronForward"></ion-icon>
          </ion-item>
          <!-- 编辑植物描述modal -->
          <ion-modal
            id="edit-plant-desc-modal"
            ref="editPlantDescriptionModal"
            trigger="item-plant-description"
            @ionModalWillPresent="onEditPlantDescriptionModalWillPresent"
            @ionModalDidPresent="onEditPlantDescriptionModalDidPresent"
            @willDismiss="onEditPlantDescriptionModalWillDismiss"
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
                  <ion-button
                    :strong="true"
                    @click="saveEditPlantDescriptionModal"
                    >保存</ion-button
                  >
                </ion-buttons>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <ion-item>
                <ion-textarea
                  ref="editPlantDescriptionModalPlantDescriptionTextareaEl"
                  v-model="editPlantDescriptionModalPlantDescription"
                  :placeholder="'例：常春藤是一种很包容的植物。\n它的抗性很强，耐受能力也很突出，是很不错的室内绿植。'"
                  :rows="5"
                  :auto-grow="true"
                ></ion-textarea>
              </ion-item>
              <ion-button @click="cancelEditPlantDescriptionModal"
                >取消</ion-button
              >
              <ion-button @click="saveEditPlantDescriptionModal"
                >保存</ion-button
              >
            </ion-content>
          </ion-modal>

          <!-- 创建日期 -->
          <ion-item lines="full">
            <ion-text slot="start" class="">创建于</ion-text>
            <ion-text slot="end" class="" color="medium">{{
              normalDateTime
            }}</ion-text>
          </ion-item>

          <!-- 颜色选项 -->
          <ion-item
            id="item-plant-color"
            lines="full"
            button
            @click="openColorModal"
          >
            <ion-text slot="start" class="">卡片颜色</ion-text>
            <ion-button slot="end" class="button-plant-color" fill="outline">
              <ion-icon
                slot="icon-only"
                class="icon-color"
                :icon="plantColor ? ellipse : ban"
                :style="{ color: plantColor }"
              ></ion-icon>
            </ion-button>
            <ion-icon slot="end" :icon="chevronForward"></ion-icon>
          </ion-item>
        </ion-list>
        <div class="ion-padding">
          <ion-label>历史温度</ion-label>
          <LineChart :data="temperatureData" style="height: 220px"></LineChart>
        </div>
      </div>

      <!-- 此div用于在找不到该id的plant的这种特殊情况下给用户一个提示 -->
      <div v-else id="plant-null-container" class="container">
        <h2>
          未找到该植物。<i>（id：{{ id }}）</i>
        </h2>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { Directory } from "@capacitor/filesystem";
import { OverlayEventDetail, IonPopoverCustomEvent } from "@ionic/core";
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
  IonInput,
  IonText,
  IonTextarea,
  IonModal,
  useIonRouter,
  modalController,
  IonPopover,
} from "@ionic/vue";
import {
  ellipsisVertical,
  trashSharp,
  chevronForward,
  addCircleOutline,
  ellipse,
  ban,
} from "ionicons/icons";
import { onMounted, ref, inject, computed } from "vue";
import { Capacitor } from "@capacitor/core";
import { useRoute } from "vue-router";
import { AppConf } from "@/types";
import { Modal } from "@ionic/core/dist/types/components/modal/modal";
import { Input } from "@ionic/core/dist/types/components/input/input";
import { getDateTime } from "@/composables/utils";
import { useIonAlert } from "@/composables/ionAlert";
import { usePhotoManger } from "@/composables/useImageManager";
import { useDateTime } from "@/composables/utils";
import ImageModal from "@/components/ImageModal.vue";
import ColorModal from "@/components/ColorModal.vue";
import MoreMenuPopover from "@/components/MoreMenuPopover.vue";
import { appDataKey, appConfigUtilsKey } from "@/injectionKeys";
import LineChart from "@/components/LineChart.vue";

const console = window.console;

console.log("DetailPage - <setup>");

const ionRouter = useIonRouter();
const route = useRoute();

const { getNormal } = useDateTime();

const { id } = route.params as { id: string };
console.log("DetailPage - <setup> id: " + id);

const temperatureData = [
  { x: "0529", y: -1 },
  { x: "0601", y: 8 },
  { x: "0602", y: 15 },
  { x: "0606", y: 22 },
  { x: "0608", y: 18 },
  { x: "0609", y: 25 },
  { x: "0613", y: 32 },
];

// inject到本组件App根组件provide好的config和相关管理config的函数
// const { appData, deletePlantById, updateConfigFile } = inject("appData") as {
//   appData: {
//     appConf: AppConf;
//   };
//   deletePlantById: (id: number) => void;
//   updateConfigFile: () => void;
// };

const appData = inject(appDataKey) as { appConf: AppConf };
// force non-null assertion, or using 'as' casting
const { deletePlantById, updateConfigFile } = inject(appConfigUtilsKey)!;

const { presentConfirmCancelAlert } = useIonAlert();
const { getPhoto, getSrcFromPath, savePhoto } = usePhotoManger();

// 用于img的src
const plantImageDataUrl = ref("");

// url会带着id param，此computed会根据这个id去config数组里找相应id的plant，无则null
const plant = computed(() => {
  for (const p of appData.appConf.plantList) {
    if (p.plantId.toString() === id) {
      setPlantImageSrc(p.plantImageFilename);
      // 此处返回数组中成功找到的那个元素，所有对plant的修改直接修改数组中的那个元素数据
      // 可能不是best practice
      return p;
    }
  }
  return null;
});

const normalDateTime = computed(() => getNormal(plant.value!.plantCreatedAt));

const plantColor = computed(() => plant.value?.plantColor || "");

onMounted(() => {
  console.log("DetailPage - onMounted");
  console.log(id);
});

function setPlantImageSrc(imageFilename: string) {
  if (imageFilename !== "") {
    getSrcFromPath("images/" + imageFilename, Directory.Data)
      .then((result) => {
        if (result) {
          plantImageDataUrl.value = result;
        }
      })
      .catch((error) => console.error(error));
  } else {
    plantImageDataUrl.value = "";
  }
}

function deletePlant() {
  presentConfirmCancelAlert({
    header: "❗",
    message: `确认删除植物：<br>&nbsp;&nbsp;<strong>${plant.value?.plantName}</strong>`,
    cssClass: "delete-plant-alert",
  }).then((result) => {
    console.log(result);
    if ("confirm" === result.role) {
      deletePlantById(parseInt(id));
      ionRouter.navigate("/home", "root");
    }
  });
}

function deleteImage() {
  console.log("AddPage - deleteImage");
  presentConfirmCancelAlert({
    cssClass: "delete-image-alert",
    header: "删除图片？",
    message: "",
  }).then((result) => {
    if ("confirm" === result.role) {
      plantImageDataUrl.value = "";
      if (plant.value) {
        plant.value.plantImageFilename = "";
        updateConfigFile();
      }
    }
  });
}

function addImage() {
  console.log("DetailPage - addPhoto");

  // 选取图片，弹出选项，图册或拍照
  getPhoto()
    // 处理选取图片结果，并将其保存成文件，返回保存结果
    .then((photoResult) => {
      if (photoResult.dataUrl) {
        const filename = getDateTime().dateTime + ".jpeg";
        savePhoto(filename, photoResult.dataUrl).then((uriResult) => {
          if (plant.value) {
            // 保存完将返回的文件名存到plant里，并更新配置json
            plant.value.plantImageFilename = filename;
            updateConfigFile();
            // 最后转换保存好的图片为img元素可用的src
            plantImageDataUrl.value = Capacitor.convertFileSrc(uriResult.uri);
          }
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

async function openImage() {
  console.log("DetailPage - openImage");

  const imageModal = await modalController.create({
    component: ImageModal,
    componentProps: { plantImageDataUrl: plantImageDataUrl.value },
  });

  imageModal.present();

  const { data, role } = await imageModal.onWillDismiss();

  console.log(role);
  if (role === "confirm") {
    console.log(data);
  }
}

// 植物名称编辑页面的template ref
// 此处发现ionic template ref对typescript的支持还是有点迷的，以下的InstanceType是一个
// 凑合事儿的
const editPlantNameModal = ref<InstanceType<typeof IonModal> | null>(null);
function cancelEditPlantNameModal() {
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

function plantNameFormatter(cur: number, max: number): string {
  return `${max - cur}`;
}

const editPlantDescriptionModal = ref<InstanceType<typeof IonModal> | null>(
  null
);
const editPlantDescriptionModalPlantDescription = ref("");
const editPlantDescriptionModalPlantDescriptionTextareaEl = ref<InstanceType<
  typeof IonTextarea
> | null>(null);

function cancelEditPlantDescriptionModal() {
  (editPlantDescriptionModal.value?.$el as Modal).dismiss(null, "cancel");
}

function saveEditPlantDescriptionModal() {
  (editPlantDescriptionModal.value?.$el as Modal).dismiss(null, "save");
}

function onEditPlantDescriptionModalWillDismiss(
  ev: CustomEvent<OverlayEventDetail>
) {
  if (plant.value && ev.detail.role === "save") {
    plant.value.plantDescription =
      editPlantDescriptionModalPlantDescription.value;
    updateConfigFile();
  }
}

function onEditPlantDescriptionModalWillPresent() {
  if (plant.value) {
    editPlantDescriptionModalPlantDescription.value =
      plant.value?.plantDescription;
  }
}

function onEditPlantDescriptionModalDidPresent() {
  console.log("desc did presnet");
  // 可以增加自动焦点
}

async function openColorModal() {
  const colorModal = await modalController.create({
    component: ColorModal,
    componentProps: { color: plantColor.value },
    id: "color-modal",
  });

  colorModal.present();

  const { data, role } = await colorModal.onDidDismiss();

  if (data && "confirm" === role) {
    if (plant.value) {
      if (data !== plant.value.plantColor) {
        plant.value.plantColor = data;
        updateConfigFile();
      }
    }
  }
}

function onMoreMenuDeleteWillDismiss(
  event: IonPopoverCustomEvent<OverlayEventDetail>
) {
  if ("delete" === event.detail.role) {
    deletePlant();
  }
}
</script>

<style scoped lang="scss">
ion-content {
  #image-container {
    display: flex;
    justify-content: center;
    // height: 200px;

    ion-card {
      // max-height: 300px;
      // width: 100%;
      // flex: 1;

      img {
        // width: 100%;
        // height: 100%;
        display: block;
        max-height: 200px;
        object-fit: contain;
      }

      ion-button {
        position: absolute;
        width: 32px;
        height: 32px;
        right: 0;
        bottom: 0;
        margin: 0px 2px 2px 0px;

        --border-radius: 50%;
        --padding-start: 8px;
        --padding-end: 8px;

        opacity: 0.7;
      }
    }
  }

  #no-image-container {
    ion-card {
      // 使按钮上下居中
      display: flex;
      // justify-content: center;
      align-items: center;
      min-height: 100px;

      div {
        // 使按钮左右居中
        // height: 100%;
        display: flex;
        justify-content: center;
        // align-items: center;
        // min-height: 100px;

        ion-button {
          font-size: 1.2rem;
        }
      }
    }
  }

  ion-list {
    ion-item {
      ion-text.label-column {
        width: 20%;
      }

      // white-space:pre-wrap会使字符串内容保持原始
      // 这三行样式主要是应对长于容器的文本，最终总体效果是容器长度不变，显示单行加省略号
      ion-text#plant-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      ion-text.content-column {
        width: 70%;
      }

      ion-text#plant-desc {
        white-space: pre-wrap;
      }
    }

    ion-item#item-plant-color ion-button.button-plant-color {
      width: 32px;
      height: 32px;
      --border-radius: 50%;
      --padding-start: 0;
      --padding-end: 0;
    }
    ion-item#item-plant-color ion-button.button-plant-color ion-icon {
      font-size: 32px;
    }
  }

  #plant-null-container {
    display: flex;
    justify-content: center;
  }
}
</style>

<style lang="scss">
:root {
  ion-modal#edit-plant-name-modal {
    ion-input {
    }
  }

  ion-modal#edit-plant-desc-modal {
    ion-textarea {
    }
  }

  ion-alert .confirm-button {
    color: var(--ion-color-danger-contrast, #fff);
    background: var(--ion-color-danger, #eb445a);
  }

  // select删除图片的确认串口，并将标题文字剧中
  ion-alert.delete-image-alert {
    .alert-head {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
