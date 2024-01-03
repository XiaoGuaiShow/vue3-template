import { createRouter, createWebHashHistory } from 'vue-router'
import InvoiceRouter from './modules/invoice.ts'
import SettlementRouter from './modules/settlement.ts'

const routes = [
	...InvoiceRouter,
	...SettlementRouter,
	{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/home',
		name: 'Home',
		component: () => import('@/pages/home.vue') // 配置路径别名后，可以使用@
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router
