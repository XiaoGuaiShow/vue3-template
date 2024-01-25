import { createRouter, createWebHashHistory } from 'vue-router'
import { close, start } from '@/utils/nprogress.ts'
import InvoiceRouter from './modules/invoice.ts'
import SettlementRouter from './modules/settlement.ts'
import ParentCompanyRouter from './modules/parentCompany.ts'
import billRouter from './modules/bill.ts'
import InvoiceSettingsRouter from './modules/invoiceSettings.ts'

const routes = [
  ...InvoiceRouter,
  ...SettlementRouter,
  ...ParentCompanyRouter,
  ...billRouter,
  ...InvoiceSettingsRouter
  // {
  //   path: '/',
  //   redirect: '/home'
  // },
  // {
  //   path: '/home',
  //   name: 'Home',
  //   component: () => import('@/pages/home.vue'), // 配置路径别名后，可以使用@
  //   meta: {
  //     title: '首页'
  //   }
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由前置后卫
router.beforeEach((to, from, next) => {
  // 开启进度条
  start()

  if (typeof to.meta.title === 'string') {
    document.title = to.meta.title || '结算自动化'
  }

  next()

  if (window.microApp) {
    if (window.__MICRO_APP_ENVIRONMENT__) {
      // 如果__MICRO_APP_BASE_ROUTE__为 `/基座应用基础路由/子应用基础路由/`，则应去掉`/基座应用基础路由`
      // 如果对这句话不理解，可以参考案例：https://github.com/micro-zoe/micro-app-demo
      const realBaseRoute = window.__MICRO_APP_BASE_ROUTE__

      if (typeof window.history.state?.current === 'string') {
        window.history.state.current = window.history.state.current.replace(
          new RegExp(realBaseRoute, 'g'),
          ''
        )
      }
    }
    window.microApp.dispatch({ currentRoute: to.fullPath })
  }
})
// 路由后置后卫
router.afterEach(() => {
  if (window.__MICRO_APP_ENVIRONMENT__) {
    const realBaseRoute = window.__MICRO_APP_BASE_ROUTE__
    if (typeof window.history.state === 'object') {
      window.history.state.current = realBaseRoute + (window.history.state.current || '')
    }
  }
  // 关闭进度条
  close()
})

export default router
