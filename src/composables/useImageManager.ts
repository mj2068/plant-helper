import { Camera, CameraResultType } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { isPlatform } from "@ionic/core";

export function usePhotoManger() {
  const getPhoto = () => {
    return Camera.getPhoto({
      resultType: CameraResultType.Base64,
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

  const deletePhoto = (filename: string) => {
    return Filesystem.deleteFile({
      path: "images/" + filename,
      directory: Directory.Data,
    });
  };

  const getSrcFromPath = (path: string, dir: Directory) => {
    if (isPlatform("hybrid")) {
      return Filesystem.getUri({
        path: path,
        directory: dir,
      })
        .then((result) => Capacitor.convertFileSrc(result.uri))
        .catch((error) => console.error(error));
    } else {
      return Filesystem.readFile({
        path: path,
        directory: dir,
      })
        .then((result) => "data:image/jpeg;base64," + result.data)
        .catch((error) => console.error(error));
    }
  };

  return { getPhoto, getSrcFromPath, savePhoto, deletePhoto };
}
