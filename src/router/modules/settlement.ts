// 结算相关
export default [
  {
    path: '/settlement/rules',
    name: 'SettlementRules',
    component: () => import('@/pages/settlement/rules/index.vue'),
    meta: {
      title: '结算规则'
    }
  }
]
