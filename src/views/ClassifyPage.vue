<script setup lang="ts">
import CommonToolbar from "@/components/CommonToolbar.vue";
import { IonContent, IonPage, IonSpinner } from "@ionic/vue";
import { onMounted, ref } from "vue";

const console = window.console;

console.log("ClassifyPage - setup");

// 202306121754
let bdAT =
  "24.c70b1aa77f5bdc64daa23b902a4a6872.2592000.1689148955.282335-34583509";
const bdPlantUrl = "https://aip.baidubce.com/rest/2.0/image-classify/v1/plant";

const imageUrl = ref(
  "https://img.pconline.com.cn/images/upload/upc/tx/photoblog/1510/19/c4/14135050_14135050_1445220434828.jpg"
);

const plantName = ref("-");

const isClassifying = ref(false);

onMounted(() => {
  console.log("ClassifyPage - onMounted");
});

function convertToBase64(url: string) {
  return new Promise<string>((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not OK");

        return response.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64DataPrefixless = (reader.result as string).split(",")[1];
          resolve(base64DataPrefixless);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(blob);
      })
      .catch((e) => {
        console.error("获取图片时出错！");
        console.error(e);
      });
  });
}

function fetchAPI() {
  fetch("http://zizaimai.space/api")
    .then((response) => response.json())
    .then((parsedJson) => {
      console.log(parsedJson);
      bdAT = parsedJson.access_token;
    });
}

function classify() {
  if (!bdAT) return;

  console.log(imageUrl.value);

  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
  });
  const body = new URLSearchParams();
  // url方式请求，如果imgae字段存在url字段会被忽略
  // body.append("url", imageUrl.value);
  // 需要百科数据append此可选项即可
  // body.append("baike_num", "1");
  convertToBase64(imageUrl.value)
    // 收到convertToBase64的结果，内容是去掉编码头的纯图像base64数据
    .then((base64DataPrefixless: string) => {
      // console.log(base64DataPrefixless);
      body.append("image", base64DataPrefixless);
    })
    // 识别api所需内容准备完毕，发起fetch
    .then(() => {
      console.log("开始识别请求...");

      isClassifying.value = true;

      return fetch(bdPlantUrl + "?access_token=" + bdAT, {
        method: "POST",
        headers: headers,
        body: body,
      });
    })
    // 处理fetch结果，此处将结果转成json并promise返回
    .then((response) => response.json())
    // 处理、使用转成json的结果
    .then((jsonResult) => {
      console.log("识别成功，结果：");
      plantName.value = jsonResult.result[0].name;
      // 第一个元素作为结果使用，然后输出所有三条识别结果作为参考
      for (const e of jsonResult.result) {
        console.log(e);
      }
    })
    .catch(function (e) {
      console.error("识别出错！");
      console.error(e);
    })
    .finally(() => {
      console.log("识别结束！");
      isClassifying.value = false;
    });
}
</script>

<template lang="pug">
IonPage
  CommonToolbar(:title="'植物识别'")
  IonContent
    .ion-padding
      IonButton(:disabled="true", @click="fetchAPI()") 1️⃣ get access token
      IonButton(@click="classify()") 2️⃣ classify
      IonTextarea(
        v-model="imageUrl",
        :auto-grow="true",
        @ion-change="plantName = '-'"
      )
      IonImg(:src="imageUrl")
      .ion-justify-content-center.ion-align-items-center
        IonSpinner(v-if="isClassifying")
        IonText(v-else)
          h4 {{ plantName }}
</template>

<style scoped lang="sass">
ion-textarea
  --background: lightgrey
.ion-justify-content-center
  display: flex
  height: 60px
</style>
