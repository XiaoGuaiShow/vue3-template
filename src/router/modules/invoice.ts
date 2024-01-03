// 发票相关
export default [
	{
		path: '/invoice/history',
		name: 'History',
		component: () => import('@/pages/invoice/history/index.vue'),
		meta: {
			title: '发票历史'
		}
	}
]
