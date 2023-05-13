import { Camera, CameraResultType } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";

export function useImageManager() {
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

  const loadImageFileToSrc = (fullPath: string, dir: Directory) => {
    return Filesystem.getUri({
      path: fullPath,
      directory: dir,
    })
      .then((result) => Capacitor.convertFileSrc(result.uri))
      .catch((error) => console.error(error));
  };

  return { getPhoto, loadImageFileToSrc };
}
