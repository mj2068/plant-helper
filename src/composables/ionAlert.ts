import { alertController, AlertOptions } from "@ionic/vue";

export function useIonAlert() {
  const presentConfirmCancelAlert = async (opt?: AlertOptions) => {
    const defaultOptions: AlertOptions = {
      header: "确认？",
      message: "确认操作？",
      cssClass: "confirm-cancel-alert",
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

  const presentInfoAlert = async (opt: { header?: string; msg: string }) => {
    const alertOpt: AlertOptions = {
      header: "提示",
      message: opt.msg,
      cssClass: "info-alert",
      buttons: [
        {
          text: "好的",
          role: "ok",
          cssClass: "ok-button",
        },
      ],
    };
    const alert = await alertController.create(alertOpt);

    await alert.present();

    return;
  };

  return { presentConfirmCancelAlert, presentInfoAlert };
}
