<script setup lang="ts">
import CommonToolbar from "@/components/CommonToolbar.vue";
import {
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonListHeader,
  IonPage,
  IonTextarea,
  IonThumbnail,
  loadingController,
} from "@ionic/vue";
import { onMounted, ref, computed } from "vue";
import { usePhotoManager } from "@/composables/useImageManager";
import { CameraSource } from "@capacitor/camera";
import Compressor from "compressorjs";
import { camera, images, scan } from "ionicons/icons";

const console = window.console;

console.log("ClassifyPage - setup");

const { getPhoto } = usePhotoManager();

const getAccessTokenURL = "http://zizaimai.space/api";

// 202306121754
const baiduAPIAccessToken = ref("");

const plantClassifyUrl = computed(
  () =>
    "https://aip.baidubce.com/rest/2.0/image-classify/v1/plant?access_token=" +
    baiduAPIAccessToken.value
);

const imageDataURL = ref("");

const imageBase64Data = computed(() => {
  if (imageDataURL.value) return imageDataURL.value.split(",")[1];
  return "";
});
const imageSize = computed(() => {
  return base64ToSize(imageBase64Data.value);
});

const isClassifying = ref(false);

const classifyResult = ref<{
  score?: number;
  name?: string;
  desc?: string;
  baikeURL?: string;
  imageURL?: string;
}>({});

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
  fetch(getAccessTokenURL)
    .then((response) => response.json())
    .then((parsedJson) => {
      console.log(parsedJson);
      baiduAPIAccessToken.value = parsedJson.access_token;
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      setTimeout(() => {
        loadingController.dismiss();
      }, 700);
      isClassifying.value = false;
    });
}

function classify() {
  if (!baiduAPIAccessToken.value) return;

  // console.log(imageUrl.value);

  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
  });
  const bodyParams = new URLSearchParams();
  // url方式请求，如果imgae字段存在url字段会被忽略
  // body.append("url", imageUrl.value);
  bodyParams.append("image", imageBase64Data.value);
  // 以下可选param控制是否返回百科信息
  bodyParams.append("baike_num", "1");

  // 识别api所需内容准备完毕，发起fetch
  console.log("开始识别请求...");

  showLoading("正在请求服务器识别...");

  isClassifying.value = true;

  fetch(plantClassifyUrl.value, {
    method: "POST",
    headers: headers,
    body: bodyParams,
  })
    // 处理fetch结果，此处将结果转成json并promise返回
    .then((response) => response.json())
    // 处理、使用转成json的结果
    .then((jsonResult) => {
      console.log("识别结束，结果：");
      if (jsonResult.error_msg) throw new Error(jsonResult.error_msg);

      console.log(jsonResult);
      if (jsonResult.result[0]) {
        // 处理收到的识别成功数据
        const { name, score, baike_info } = jsonResult.result[0];
        classifyResult.value.name = name;
        classifyResult.value.score = score;

        if (baike_info) {
          classifyResult.value.desc = baike_info.description;
          classifyResult.value.imageURL = baike_info.image_url;
          classifyResult.value.baikeURL = baike_info.baike_url;

          fetch(baike_info.image_url, { redirect: "follow" }).then(console.log);
        }
      }
    })
    .catch(function (e) {
      console.error("识别出错！");
      console.error(e);

      // 输入识别请求出错，尝试自动更新一次token
      updateAccessToken();
    })
    .finally(() => {
      console.log("识别结束！");
      isClassifying.value = false;
      loadingController.dismiss();
    });
}

function getPlantPhoto(source?: CameraSource) {
  getPhoto(source)
    .then((photo) => {
      if (!photo.base64String) return;

      showLoading("正在压缩图片...");

      console.log(
        "pre-compression size: " + base64ToSize(photo.base64String) + " MB"
      );

      urlToBlob("data:image/jpeg;base64," + photo.base64String)
        .then((blob) => {
          new Compressor(blob, {
            quality: 0.6,
            success: (blob) => {
              console.log(blob);
              convertBlobToBase64(blob).then((base64Data) => {
                if (!base64Data) return;

                console.log(
                  "post-compression size: " + base64ToSize(base64Data) + " MB"
                );
                imageDataURL.value = base64Data;
                loadingController.dismiss();
              });
            },
          });
        })
        .catch((e) => {
          console.error(e);
          loadingController.dismiss();
        })
        .finally(() => console.log("获取图片结束:"));
    })
    .catch((e) => console.error(e));
}

async function showLoading(message?: string) {
  const loading = await loadingController.create({
    message,
  });

  loading.present();
}

function base64ToSize(base64String: string): number {
  const bytes = Math.ceil(base64String.length / 4) * 3;
  return bytes / 1024 ** 2;
}
</script>

<template lang="pug">
IonPage
  CommonToolbar(:title="'植物识别'")
  IonContent
    #main-container.ion-padding
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
        .image-card.light-box-shadow
          img(:src="imageDataURL")
        //- IonNote(v-if="imageSize > 0")
        //-   | 图像尺寸：{{ imageSize.toFixed(1) + " MB" }}
        IonButton(color="danger", @click="imageDataURL = ''") 重新选择
      IonButton(
        color="success",
        expand="block",
        :disabled="imageDataURL === '' || isClassifying",
        @click="classify()"
      ) 识别
        IonIcon(slot="start", :icon="scan")
      #result-container(v-if="classifyResult.name")
        IonList
          IonItem
            strong(slot="start")
              IonInput(:readonly="true", :value="classifyResult?.name")
            IonText(slot="end", color="medium") 得分&nbsp;
            IonBadge.ion-no-margin(
              slot="end",
              :color="classifyResult.score ? (classifyResult.score > 0.8 ? 'success' : classifyResult.score > 0.65 ? 'warning' : 'danger') : 'secondary'"
            ) {{ classifyResult.score?.toPrecision(2) }}
          IonItem
            IonLabel(position="floating") 描述
            IonTextarea(
              :readonly="true",
              :auto-grow="true",
              :value="classifyResult?.desc"
            )
          IonItem(lines="full")
            IonLabel 链接：
              a(:href="classifyResult.baikeURL", target="_blank") {{ classifyResult.baikeURL }}
        //- IonList
        //-   IonItem
        //-     IonThumbnail(slot="start")
        //-       img(:src="classifyResult.imageURL")
        //-     IonLabel
        //-       IonInput(:value="classifyResult?.name")
        //-       IonTextarea(:value="classifyResult?.desc")

        //- IonCard
        //-   IonCardHeader
        //-     IonCardTitle
        //-       ion-input(:value="classifyResult?.name")
        //-   IonCardContent
        //-     IonTextarea(:value="classifyResult?.desc", :readonly="true")
        //- ion-img(
        //-   src="https://bkimg.cdn.bcebos.com/pic/7dd98d1001e93901213f623cf2ba43e736d12f2e3820"
        //- )
</template>

<style scoped lang="scss">
@import url(@/theme/utils.scss);

$image-content-height: 350px;

.ion-justify-content-center {
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
    border-radius: 4px;
    overflow: hidden;
  }

  #image-container {
    display: flex;
    flex-direction: column;

    .image-card {
      border-radius: 4px;
      margin-bottom: 4px;
      overflow: hidden;

      img {
        display: block;
        max-height: $image-content-height;
        object-fit: contain;
      }
    }

    ion-button {
      align-self: stretch;
    }
  }

  #result-container {
    ion-card {
      max-height: 400px;
    }
  }
}
</style>
