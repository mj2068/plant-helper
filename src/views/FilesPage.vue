<script setup lang="ts">
import { onMounted, ref } from "vue";
import CommonToolbar from "@/components/CommonToolbar.vue";
import { Directory, Filesystem } from "@capacitor/filesystem";
import {
  IonBreadcrumb,
  IonBreadcrumbs,
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/vue";
import { arrowForward, arrowUp, trash } from "ionicons/icons";
import { useIonAlert } from "@/composables/ionAlert";
import type { FileInfo } from "@capacitor/filesystem";

const console = window.console;

const { presentConfirmCancelAlert } = useIonAlert();
const addressBarItem = ref<InstanceType<typeof IonItem> | null>(null);

const fileItems = ref<(typeof IonItemSliding)[]>([]);

const directories = Object.entries(Directory);
console.log(directories);

const newDirName = ref("");

// currentPath是用于地址栏的、可编辑的、未验证的临时字符串path
const currentPath = ref("");
// validPath是用于面包屑的，验证完已进入的path
const validPath = ref("");

const selectedDir = ref<Directory | "ROOT">(Directory.Data);
const dirContent = ref<FileInfo[]>([]);
const pathErrorMessage = ref("");

onMounted(() => {
  console.log("FilesPage - onMounted");

  readdir();
});

function readdir() {
  console.log("readdir");

  // plan to use stat to differentiate file and directory. because readdir
  // wouldn't error if given a FILE path, it would just return normally, and
  // give a 0 length array result.
  Filesystem.stat({
    path: currentPath.value,
    directory: selectedDir.value === "ROOT" ? undefined : selectedDir.value,
  })
    .then((r) => console.log(r))
    .catch((e) => console.error(e));

  Filesystem.readdir({
    path: currentPath.value,
    directory: selectedDir.value === "ROOT" ? undefined : selectedDir.value,
  })
    .then((readdirResult) => {
      console.log(readdirResult);

      // 将获取到的目录内容列表赋给组件变量
      dirContent.value = readdirResult.files;

      validPath.value = currentPath.value;

      (addressBarItem.value?.$el as HTMLElement).classList.remove(
        "ion-invalid"
      );
    })
    .catch((e: Error) => {
      console.error(e);

      if (e.message.indexOf("not exist")) {
        pathErrorMessage.value = "路径不存在";
      } else {
        pathErrorMessage.value = e.message;
      }
      (addressBarItem.value?.$el as HTMLElement).classList.add("ion-invalid");
    });
}

function mkdir() {
  console.log("mkdir");

  if (!newDirName.value) return;

  console.log("making new dir: " + newDirName.value);
  Filesystem.mkdir({
    path: currentPath.value + newDirName.value,
    directory: selectedDir.value === "ROOT" ? undefined : selectedDir.value,
  }).then(() => {
    console.log("mkdir .then");
    newDirName.value = "";
    readdir();
  });
}

// bug: goUp shouldn't depends on currentPath
function goUp() {
  console.log("goUp");
  console.log(currentPath.value);

  if (!currentPath.value) return;

  // 将路径按照正斜杠分割。这里需要注意由于路径是正斜杠结尾，所以分割后最后会有一个空串儿元素
  const folders = currentPath.value.split("/");
  console.log(folders);

  // 通过判断删除结尾空串儿
  if (folders[folders.length - 1] === "") folders.pop();
  console.log(folders);

  // 删除最后一级目录
  folders.pop();
  console.log(folders);

  // 将数组用正斜杠连接
  currentPath.value = folders.join("/");
  console.log(currentPath.value);

  // 如果数组不为空，还需要将结尾正斜杠再加回去
  if (folders.length !== 0) currentPath.value += "/";
  console.log(currentPath.value);

  readdir();
}

function deleteFile(file: FileInfo, itemIndex: number) {
  console.log("deleteFile: " + file.name);

  presentConfirmCancelAlert({
    header:
      "确认删除" +
      ("directory" === file.type ? " 文件夹 " : " 文件 ") +
      file.name +
      " 么？",
    message: "（不可恢复）",
  }).then((choice) => {
    if ("confirm" === choice.role) {
      Filesystem.deleteFile({
        path: currentPath.value + file.name,
        directory: selectedDir.value === "ROOT" ? undefined : selectedDir.value,
      })
        .then(() => {
          console.log("deleteFile - .then");
          readdir();
        })
        .catch((e) => {
          console.error(e);
          (fileItems.value[itemIndex].$el as typeof IonItemSliding).close();
        });
    } else {
      (fileItems.value[itemIndex].$el as typeof IonItemSliding).close();
    }
  });
}

function onPathChange() {
  if (
    (addressBarItem.value?.$el as HTMLElement).classList.contains("ion-invalid")
  ) {
    (addressBarItem.value?.$el as HTMLElement).classList.remove("ion-invalid");
  }
}

function test() {
  console.log("FilesPage - test");

  const arr: string[] = ["a", "b"];
  const s = arr.join("/");
  console.log(s);
}
</script>

<template lang="pug">
IonPage
  CommonToolbar(:title="'files'")
  IonContent
    #main-container.ion-padding
      IonItem
        IonLabel directory
        IonSelect(v-model="selectedDir")
          IonSelectOption(:value="'ROOT'") Root
          IonSelectOption(v-for="d in directories", :key="d[0]", :value="d[1]") {{ d[0] }}
      #address-bar-container
        IonItem(ref="addressBarItem", fill="solid")
          IonInput(
            v-model="currentPath",
            @keyup.enter="readdir()",
            @ion-change="onPathChange()"
          )
          IonNote(slot="error") {{ pathErrorMessage }}
          IonButton(fill="clear", @click="readdir()")
            Img(slot="icon-only", :icon="arrowForward")

      #breadcrumbs-container
        IonButton(fill="clear", @click="goUp()")
          Img(slot="icon-only", :icon="arrowUp")
        IonBreadcrumbs
          IonBreadcrumb(v-for="(e, i) in validPath.split('/')", :key="i") {{ e }}

      IonList
        IonItemSliding(
          v-for="(e, index) in dirContent",
          :key="e.name",
          ref="fileItems"
        )
          IonItem(lines="full")
            a(
              v-if="e.type === 'directory'",
              @click="currentPath += `${e.name}/`; readdir()"
            ) {{ e.name }}
            template(v-else)
              IonText {{ e.name }}
              IonText(slot="end") {{ (e.size / 1024).toFixed(1) }} KB
          IonItemOptions
            IonItemOption(color="danger", @click="deleteFile(e, index)")
              Img(:icon="trash", size="large")
          IonItemOptions(side="start", @ion-swipe="console.log(e)")
            IonItemOption(expandable, @click="console.log(e)") info
      IonInput(v-model="newDirName", placeholder="input a name")
      IonButton(@click="mkdir()") mkdir
      IonButton(@click="test") test
</template>

<style scoped lang="scss">
ion-content {
  #main-container {
    min-height: 100%;

    #address-bar-container {
      display: flex;
      align-items: center;

      ion-item {
        width: 100%;

        ion-button {
          width: 32px;
          height: 32px;
          --border-radius: 0;
          --padding-start: 0;
          --padding-end: 0;

          ion-icon {
            font-size: 32px;
          }
        }
      }
    }

    #breadcrumbs-container {
      min-height: 40px;
      display: flex;
      align-items: center;
      background: lightgrey;

      ion-button {
        width: 32px;
        height: 32px;
        --border-radius: 0;
        --padding-start: 0;
        --padding-end: 0;

        ion-icon {
          font-size: 32px;
        }
      }

      ion-breadcrumbs {
        flex-wrap: nowrap;
        overflow: auto;
        align-self: stretch;
      }
    }
  }
}
</style>



