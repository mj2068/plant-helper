import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import components from "unplugin-vue-components/vite";
import { IonicResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // isCustomElement: (tag) => tag.startsWith("swiper"),
        },
      },
    }),
    components({
      resolvers: [IonicResolver()],
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
