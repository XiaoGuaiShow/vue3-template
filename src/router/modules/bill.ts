// 账单相关
export default [
	{
		path: '/bill',
		name: 'Bill',
		component: () => import('@/pages/bill/index.vue'),
		meta: {
			title: '账单管理'
		}
	}
]
