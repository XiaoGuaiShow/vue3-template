// 账单相关
export default [
  {
    path: '/bill',
    name: 'Bill',
    component: () => import('@/pages/bill/index.vue'),
    meta: {
      title: '账单管理'
    }
  },
  {
    path: '/repayment',
    name: 'Repayment',
    component: () => import('@/pages/bill/record/repayment.vue'),
    meta: {
      title: '还款记录'
    }
  },
  {
    path: '/recharge',
    name: 'Recharge',
    component: () => import('@/pages/bill/record/recharge.vue'),
    meta: {
      title: '充值记录'
    }
  },
  {
    path: '/bill/details',
    name: 'BillDetail',
    component: () => import('@/pages/bill/details/index.vue'),
    meta: {
      title: '汇总明细'
    }
  }
]
