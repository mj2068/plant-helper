<script setup lang="ts">
import CommonToolbar from "@/components/CommonToolbar.vue";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonSpinner,
  loadingController,
} from "@ionic/vue";
import { onMounted, ref, computed } from "vue";
import { usePhotoManager } from "@/composables/useImageManager";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CameraSource } from "@capacitor/camera";
import Compressor from "compressorjs";
import { camera, images } from "ionicons/icons";

const console = window.console;

console.log("ClassifyPage - setup");

const { getPhoto } = usePhotoManager();

// 202306121754
const baiduAPIAccessToken = ref("");

const plantClassifyUrl = computed(
  () =>
    "https://aip.baidubce.com/rest/2.0/image-classify/v1/plant?access_token=" +
    baiduAPIAccessToken.value
);

const imageBase64Data = computed(() => {
  if (imageDataURL.value) return imageDataURL.value.split(",")[1];
  return "";
});
const imageSize = computed(() => {
  return base64ToSize(imageBase64Data.value);
});
function base64ToSize(base64String: string): number {
  const bytes = Math.ceil(base64String.length / 4) * 3;
  return bytes / 1024 ** 2;
}

const imageDataURL = ref("");

const plantName = ref("");

const isClassifying = ref(false);

onMounted(() => {
  console.log("ClassifyPage - onMounted");

  updateAccessToken();
});

function urlToBlob(url: string) {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error("Network response was not OK");

    return response.blob();
  });
}

function convertBlobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  }).catch((e) => {
    console.error("获取图片时出错！");
    console.error(e);
  });
}

function updateAccessToken() {
  showLoading("与服务器通信中...");
  isClassifying.value = true;
  console.log("正在获取token...");
  fetch("http://zizaimai.space/api")
    .then((response) => response.json())
    .then((parsedJson) => {
      console.log(parsedJson);
      baiduAPIAccessToken.value = parsedJson.access_token;
    })
    .catch((e) => {
      plantName.value = "获取token出错！";
      console.log(e);
    })
    .finally(() => {
      loadingController.dismiss();
      isClassifying.value = false;
    });
}

function classifyUrl() {
  if (!baiduAPIAccessToken.value) return;

  // console.log(imageUrl.value);

  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
  });
  const body = new URLSearchParams();
  // url方式请求，如果imgae字段存在url字段会被忽略
  // body.append("url", imageUrl.value);
  // 添加如下此可选项可获取百科信息
  // body.append("baike_num", "1");
  body.append("image", imageBase64Data.value);
  // 识别api所需内容准备完毕，发起fetch
  console.log("开始识别请求...");

  plantName.value = "";
  isClassifying.value = true;

  fetch(plantClassifyUrl.value, {
    method: "POST",
    headers: headers,
    body: body,
  })
    // 处理fetch结果，此处将结果转成json并promise返回
    .then((response) => response.json())
    // 处理、使用转成json的结果
    .then((jsonResult) => {
      console.log("识别结束，结果：");
      if (jsonResult.error_msg) throw new Error(jsonResult.error_msg);

      console.log(jsonResult);
      plantName.value = jsonResult.result[0].name;
    })
    .catch(function (e) {
      console.error("识别出错！");
      console.error(e);
      plantName.value = "识别出错！请重试。";
      updateAccessToken();
    })
    .finally(() => {
      console.log("识别结束！");
      isClassifying.value = false;
    });
}

function getPlantPhoto(source?: CameraSource) {
  getPhoto(source).then((photo) => {
    if (!photo.base64String) return;

    // 显示loading，禁止用户操作
    showLoading("正在压缩图片...");

    console.log(
      "pre-compression size: " + base64ToSize(photo.base64String) + "MB"
    );
    urlToBlob("data:image/jpeg;base64," + photo.base64String).then((blob) => {
      new Compressor(blob, {
        quality: 0.6,
        success: (blob) => {
          console.log(blob);
          convertBlobToBase64(blob).then((base64Data) => {
            if (!base64Data) return;

            console.log(
              "post-compression size: " + base64ToSize(base64Data) + "MB"
            );
            imageDataURL.value = base64Data;
            loadingController.dismiss();
          });
        },
      });
    });
  });
}

async function showLoading(message?: string) {
  const loading = await loadingController.create({
    message,
  });

  loading.present();
}
</script>

<template lang="pug">
IonPage
  CommonToolbar(:title="'植物识别'")
  IonContent
    #main-container.ion-padding
      //- IonTextarea(
      //-   v-model="imageUrl",
      //-   :auto-grow="true",
      //-   @ion-change="plantName = '-'"
      //- )
      #no-image-container.light-box-shadow.ion-margin-bottom(
        v-if="imageDataURL === ''"
      )
        ion-button(
          fill="clear",
          size="large",
          @click="getPlantPhoto(CameraSource.Camera)"
        )
          IonIcon(slot="start", size="large", :icon="camera")
          IonText 拍照
        ion-button(
          size="large",
          fill="clear",
          @click="getPlantPhoto(CameraSource.Photos)"
        )
          IonIcon(slot="start", size="large", :icon="images")
          IonText 相册
      #image-container.ion-align-items-center.ion-margin-bottom(v-else)
        .image-card.ion-margin-bottom
          img(:src="imageDataURL")
        //- IonNote(v-if="imageSize > 0")
        //-   | 图像尺寸：{{ imageSize.toFixed(1) + " MB" }}
        IonButton(color="danger", @click="imageDataURL = ''") 重新选择
      IonButton(
        color="success",
        expand="block",
        :disabled="imageBase64Data === ''",
        @click="classifyUrl()"
      )
        template(v-if="!isClassifying") 识别
        IonSpinner(v-else)
      .ion-justify-content-center.ion-align-items-center
        IonText
          h4 {{ plantName }}
</template>

<style scoped lang="scss">
@import url(@/theme/utils.scss);

$image-content-height: 350px;

.ion-justify-content-center.ion-align-items-center {
  display: flex;
}

#main-container {
  min-height: 100%;

  #no-image-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: $image-content-height;
    border-radius: 8px;
    overflow: hidden;

    // background: lightgreen;
  }

  #image-container {
    display: flex;
    flex-direction: column;

    // background: lightblue;

    .image-card {
      // width: 200px;

      // height: 300px;
      // max-height: 400px;
      // flex: 0 1 auto;
      // align-self: center;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
        rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;

      background: pink;
      // margin-bottom: 4px;

      img {
        display: block;
        // width: 100%;
        // height: 100%;
        max-height: $image-content-height;
        object-fit: contain;
      }
    }

    ion-button {
      align-self: stretch;
    }
  }
}
</style>
