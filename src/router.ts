import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/pages/home.vue"), // 配置路径别名后，可以使用@
  },
  {
    path: "/settlement-management/settlement-rules",
    name: "SettlementRules",
    component: () =>
      import("@/pages/settlementManagement/settlementRules/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
