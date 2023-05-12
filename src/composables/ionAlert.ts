import { alertController, AlertOptions } from "@ionic/vue";

export function useIonAlert() {
  const presentAlert = async (opt?: AlertOptions) => {
    const defaultOptions: AlertOptions = {
      header: "确认？",
      message: "确认操作？",
      buttons: [
        {
          text: "确认",
          role: "confirm",
          cssClass: "confirm-button",
        },
        {
          text: "取消",
          role: "cancel",
          cssClass: "cancel-button",
        },
      ],
    };
    const alert = await alertController.create({ ...defaultOptions, ...opt });

    await alert.present();

    return await alert.onDidDismiss();
  };

  return { presentAlert };
}
