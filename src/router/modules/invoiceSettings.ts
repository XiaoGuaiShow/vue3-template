// 开票设置
export default [
  {
    path: '/invoice-settings',
    name: 'InvoiceSettings',
    component: () => import('@/pages/invoiceSettings/index.vue'),
    meta: {
      title: '开票设置'
    }
  }
]
