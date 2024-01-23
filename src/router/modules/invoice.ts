// 发票相关
export default [
  {
    path: '/invoice-history',
    name: 'InvoiceHistory',
    component: () => import('@/pages/invoice/history/index.vue'),
    meta: {
      title: '发票历史'
    }
  },
  {
    path: '/invoice-history-detail',
    name: 'InvoiceHistoryDetail',
    component: () => import('@/pages/invoice/detail/index.vue'),
    meta: {
      title: '账期'
    }
  }
]
