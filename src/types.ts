export interface Plant {
  plantId: number;
  plantCreatedAt: Date;
  plantName: string;
  plantDescription: string;
  plantImageFilename: string;
  plantColor?: string;
}

export interface AppConf {
  configVersion: string;
  firstRun: boolean;
  plantList: Plant[];
}

export type addPlant = (plant: Plant) => void;
export type deletePlantById = (id: number) => void;
