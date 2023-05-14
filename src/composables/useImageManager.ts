import { Camera, CameraResultType } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";

export function usePhotoManger() {
  const getPhoto = () => {
    return Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      quality: 100,
      promptLabelHeader: "图片来源",
      promptLabelPhoto: "相册",
      promptLabelPicture: "拍照",
      promptLabelCancel: "取消",
    });
  };

  const savePhoto = (filename: string, dataUrl: string) => {
    return Filesystem.writeFile({
      data: dataUrl,
      path: "images/" + filename,
      directory: Directory.Data,
    });
  };

  const getSrcFromPath = (path: string, dir: Directory) => {
    return Filesystem.getUri({
      path: path,
      directory: dir,
    })
      .then((result) => Capacitor.convertFileSrc(result.uri))
      .catch((error) => console.error(error));
  };

  return { getPhoto, getSrcFromPath, savePhoto };
}
