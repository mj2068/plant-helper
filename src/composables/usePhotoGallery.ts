import { Photo } from "@capacitor/camera";
import { Directory, Filesystem } from "@capacitor/filesystem";

export interface UserPhoto {
  filepath: string;
  webPath?: string;
}

function convertBlobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

async function savePicture(photo: Photo, filename: string): Promise<UserPhoto> {
  let base64Data: string;

  const response = await fetch(photo.webPath!);
  const blob = await response.blob();
  base64Data = (await convertBlobToBase64(blob)) as string;

  const saveFile = await Filesystem.writeFile({
    path: filename,
    directory: Directory.Data,
    data: base64Data,
  });

  return {
    filepath: filename,
    webPath: photo.webPath,
  };
}
