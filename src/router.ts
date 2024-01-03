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
    path: "/parent-company",  //子母公司
    name: "SettlementRules",
    component: () =>
      import("@/pages/parentCompany/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
