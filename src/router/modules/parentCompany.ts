//子母公司相关
export default [
	{
		path: '/parent-company',
		name: 'ParentCompany',
		component: () => import('@/pages/parentCompany/index.vue'),
		meta: {
			title: '子母公司'
		}
	}
]
