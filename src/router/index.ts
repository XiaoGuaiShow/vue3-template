import { createRouter, createWebHashHistory } from 'vue-router'
import { close, start } from '@/utils/nprogress.ts'
import InvoiceRouter from './modules/invoice.ts'
import SettlementRouter from './modules/settlement.ts'
import ParentCompanyRouter from './modules/parentCompany.ts'
import billRouter from './modules/bill.ts'

const routes = [
	...InvoiceRouter,
	...SettlementRouter,
	...ParentCompanyRouter,
	...billRouter,
	{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/home',
		name: 'Home',
		component: () => import('@/pages/home.vue'), // 配置路径别名后，可以使用@
		meta: {
			title: '首页'
		}
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

// 路由前置后卫
router.beforeEach(() => {
	// 开启进度条
	start()
})
// 路由后置后卫
router.afterEach(() => {
	// 关闭进度条
	close()
})

export default router
