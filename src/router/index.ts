import { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "@ionic/vue-router";
import AddPage from "../views/AddPage.vue";
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
    path: "/detail/:id",
    name: "Detail",
    component: DetailPage,
  },
  {
    path: "/test",
    name: "Test",
    component: () => import("@/views/TestPage.vue"),
  },
  {
    path: "/graph",
    name: "Graph",
    component: () => import("@/views/GraphPage.vue"),
  },
  {
    path: "/console",
    name: "Console",
    component: () => import("@/views/ConsolePage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
