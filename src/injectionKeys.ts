import { InjectionKey } from "vue";
import { AppConf, addPlant, deletePlantById, updateConfigFile } from "@/types";

export const appDataKey = Symbol() as InjectionKey<{ appConf: AppConf }>;

export const appConfigUtilsKey = Symbol() as InjectionKey<{
  addPlant: addPlant;
  deletePlantById: deletePlantById;
  updateConfigFile: updateConfigFile;
}>;
