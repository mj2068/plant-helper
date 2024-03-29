<template>
  <ion-page>
    <CommonToolbar
      title="添加植物"
      :buttons="[{ name: '保存', onClick: save }]"
    ></CommonToolbar>

    <ion-content>
      <div id="content-container">
        <div id="top-decor-container" style="height: 60px"></div>
        <div id="container" class="ion-padding">
          <div v-if="plantImageDataUrl" id="image-container">
            <ion-card button class="">
              <img
                id="plant-image"
                :src="plantImageDataUrl"
                alt="植物图片"
                srcset=""
              />
              <ion-button
                id="delete-image-button"
                fill="solid"
                color="light"
                @click="deleteImage"
              >
                <ion-icon slot="icon-only" :icon="trashSharp"></ion-icon>
              </ion-button>
            </ion-card>
          </div>
          <div v-else id="no-image-container">
            <ion-card button @click="getImage">
              <div>
                <ion-button fill="clear"
                  ><ion-icon slot="start" :icon="addCircle"></ion-icon>
                  添加图片
                </ion-button>
              </div>
            </ion-card>
          </div>
          <ion-list :inset="true">
            <ion-item>
              <ion-label>植物名称</ion-label>
              <ion-input
                id="plant-name"
                v-model="plantName"
                placeholder="请输入植物名称"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">植物描述</ion-label>
              <ion-textarea
                id="description"
                v-model="plantDescription"
                :auto-grow="true"
                placeholder="请输入植物的描述信息"
              ></ion-textarea>
            </ion-item>
          </ion-list>
          <!-- <ion-button @click="test">test</ion-button> -->
        </div>
        <div id="bottom-decor-container">
          <img class="left" src="@/assets/group-decor1.png" alt="" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonInput,
  IonLabel,
  IonContent,
  IonButton,
  IonBackButton,
  IonCard,
  IonList,
  IonItem,
  IonTextarea,
  IonIcon,
  useIonRouter,
} from "@ionic/vue";
import { star, addCircle, trashSharp, save } from "ionicons/icons";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Camera, CameraResultType } from "@capacitor/camera";
import { getDateTime } from "@/composables/utils";
import { appDataKey, appConfigUtilsKey } from "@/injectionKeys";
import CommonToolbar from "@/components/CommonToolbar.vue";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonInput,
    IonLabel,
    IonContent,
    IonButton,
    IonBackButton,
    IonCard,
    IonList,
    IonItem,
    IonTextarea,
    IonIcon,
    CommonToolbar,
  },

  setup() {
    console.log("AddPage - setup");

    const appData = inject(appDataKey)!;
    const { addPlant } = inject(appConfigUtilsKey)!;

    return { appData, addPlant };
  },

  ionViewDidEnter() {
    console.log("AddPage - ionViewDidEnter");
  },

  data() {
    return {
      console,
      star,
      addCircle,
      trashSharp,
      ionRouter: useIonRouter(),
      plantName: "",
      plantDescription: "",
      plantImageDataUrl: "",
    };
  },

  computed: {},

  mounted() {
    console.log("AddPage - mounted");
  },

  methods: {
    // convert a path url to base64 data
    async webPathToBase64(path: string) {
      const response = await fetch(path);
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
    },

    async save() {
      console.log("AddPage - save");

      // get the created date time
      const datetime = getDateTime();
      // create a variable for image filename, if no image provided, it'll be empty
      let filename = "";
      // write image data to file
      if (this.plantImageDataUrl) {
        filename = datetime.dateTime + ".jpeg";
        const savedFileUri = await Filesystem.writeFile({
          path: "images/" + filename,
          data: this.plantImageDataUrl,
          directory: Directory.Data,
          recursive: true,
        });
        console.log("AddPage - save - saved uri:");
        console.log(savedFileUri.uri);
      }

      // increment id after the last exist entry, otherwise 0
      let plantId: number;
      if (this.appData.appConf.plantList.length === 0) {
        plantId = 0;
      } else {
        plantId =
          this.appData.appConf.plantList[
            this.appData.appConf.plantList.length - 1
          ].plantId + 1;
      }

      this.addPlant({
        plantId: plantId,
        plantName: this.plantName,
        plantDescription: this.plantDescription,
        plantImageFilename: filename,
        plantCreatedAt: datetime.date,
      });
      // navigate back to home page
      this.ionRouter.navigate("/home", "root");
    },

    // 获取图片，有两种模式可供选择：相册和拍照
    async getImage() {
      try {
        const photo = await Camera.getPhoto({
          // quality: 100,
          resultType: CameraResultType.DataUrl,
          promptLabelHeader: "图片来源",
          promptLabelPhoto: "相册",
          promptLabelPicture: "拍照",
          promptLabelCancel: "取消",
          // allowEditing: true,
          // saveToGallery: true,
        });
        console.log(photo);
        this.plantImageDataUrl = photo.dataUrl || "";
      } catch (error) {
        console.error(error);
      }
    },

    deleteImage() {
      console.log("AddPage - deleteImage");
      this.plantImageDataUrl = "";
    },

    test() {
      console.log("AddPage - test");
    },

    getDateTime: getDateTime,
  },
});
</script>

<style scoped lang="scss">
#content-container {
  // background-color: lightblue;
  min-height: 100%;
  position: relative;

  &::before {
    content: " ";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100%;
    opacity: 0.2;
    background-image: url(@/assets/seamless1.jpg);
    background-repeat: repeat;
    background-position: 50% 0%;
    // background-size: contain;
  }

  #container {
    position: relative;
    z-index: 1;

    #image-container {
      display: flex;
      justify-content: center;
      // width: 100%;
      // max-height: 300px;

      ion-card {
        img {
          // width: 100%;
          // height: auto;
          max-height: 300px;
          // max-width: 200px;
          display: block;
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

      ion-list {
        opacity: 1;
      }
    }

    #no-image-container {
      opacity: 1;

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
  }

  #bottom-decor-container {
    position: absolute;
    top: 450px;
    width: 100%;
    height: 120px;

    // background-color: #0808;
    z-index: 0;

    img.left {
      display: block;
      height: 100%;
      position: relative;
      left: 3%;
      opacity: 0.7;
    }
  }
}
</style>
