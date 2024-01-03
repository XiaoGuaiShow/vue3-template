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
  {
    path: "/settlement-management/history",
    name: "History",
    component: () => import("@/pages/settlementManagement/history/index.vue"),
  },
  {
    path: "/settlement-management/history/:id",
    name: "HistoryDetail",
    component: () => import("@/pages/settlementManagement/history/detail.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
