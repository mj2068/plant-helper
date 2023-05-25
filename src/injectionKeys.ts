import { InjectionKey } from "vue";
import { addPlant, AppConf, deletePlantById } from "@/types";

export const appDataKey = Symbol() as InjectionKey<{ appConf: AppConf }>;

export const appConfigUtilsKey = Symbol() as InjectionKey<{
  addPlant: addPlant;
  deletePlantById: deletePlantById;
  updateConfigFile: () => void;
}>;
