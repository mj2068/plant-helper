/// <reference types="@capacitor/splash-screen" />

import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "space.zizaimai.planthelper",
  appName: "植物小助手",
  webDir: "dist",
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      androidScaleType: "CENTER_CROP",
    },
  },
};

export default config;
