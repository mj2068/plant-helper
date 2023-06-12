/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEST_DATA: string;
  // more env variables...
  readonly VITE_WEATHER_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
