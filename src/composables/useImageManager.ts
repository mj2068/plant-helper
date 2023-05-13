import { Camera, CameraResultType } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { getDateTime } from "./utils";

export function usePhotoManger() {
  const getPhoto = async () => {
    return await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      quality: 100,
      promptLabelHeader: "图片来源",
      promptLabelPhoto: "相册",
      promptLabelPicture: "拍照",
      promptLabelCancel: "取消",
    });
  };

  const savePhoto = async (dataUrl: string) => {
    const filename = getDateTime().dateTime + ".jpeg";
    return {
      filename,
      writeResult: Filesystem.writeFile({
        data: dataUrl,
        path: "images/" + filename,
        directory: Directory.Data,
      }),
    };
  };

  const loadImageFileToSrc = (path: string, dir: Directory) => {
    return Filesystem.getUri({
      path: path,
      directory: dir,
    })
      .then((result) => Capacitor.convertFileSrc(result.uri))
      .catch((error) => console.error(error));
  };

  return { getPhoto, loadImageFileToSrc, savePhoto };
}
