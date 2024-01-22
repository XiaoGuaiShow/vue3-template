// 结算相关
export default [
  {
    path: '/rules',
    name: 'SettlementRules',
    component: () => import('@/pages/settlement/rules/index.vue'),
    meta: {
      title: '结算规则'
    }
  }
]
