// 发票相关
export default [
  {
    path: '/invoice/history',
    name: 'History',
    component: () => import('@/pages/invoice/history/index.vue'),
    meta: {
      title: '发票历史'
    }
  },
  {
    path: '/invoice/history/:id',
    name: 'HistoryDetail',
    component: () => import('@/pages/invoice/detail/index.vue'),
    meta: {
      title: '账期'
    }
  }
]
