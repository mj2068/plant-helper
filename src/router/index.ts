import AddPage from "../views/AddPage.vue";
import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import DetailPage from "@/views/DetailPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/add",
    name: "Add",
    component: () => import("@/views/AddPage.vue"),
    // component: AddPage,
  },
  {
    path: "/detail",
    name: "Detail",
    component: DetailPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
