export interface Plant {
  plantId: number;
  plantCreatedAt: Date;
  plantName: string;
  plantDescription: string;
  plantImageFilename: string;
  plantColor?: string;
}

export interface AppConf {
  testNumber: number;
  testString: string;
  plantList: Plant[];
}
