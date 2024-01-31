export const FEE_TYPE = new Map([
  [1, '产品费'],
  [2, '服务费'],
  [3, '费用抵扣']
])

export const PRODUCT_TYPE = new Map([
  [0, '汇总'],
  [5, '国内机票'],
  [51, '国际机票'],
  [1, '国内酒店'],
  [11, '国际酒店'],
  [6, '国内火车'],
  [7, '国内用车'],
  [10, '国内外卖'],
  [9, '商务卡'],
  [999, '滞纳金'],
  [21, '汽车票']
])

export const PRODUCT_TYPE_PART = new Map([
  [5, '机票'],
  [1, '酒店'],
  [6, '火车票'],
  [7, '用车'],
  [10, '外卖']
])

export const FEE_CLASS = new Map([
  [0, '本期应结'],
  [1, '本期消费'],
  [2, '上期未结'],
  [3, '本期异议'],
  [4, '未取回票据'],
  [5, '跨账期退']
])

export const SETTLEMENT_STATUS = new Map([
  [0, '待生成'],
  [1, '生成中'],
  [6, '待确认'],
  [9, '待开票'],
  [10, '开票中'],
  [12, '待还款'],
  [15, '部分还款'],
  [18, '已结算']
])

export const INVOICE_TYPE = new Map([
  [1, '普票'],
  [2, '专票'],
  [5, '行程单'],
  [6, '票根']
])

export const BILL_CATEGORY = new Map([
  ['totalPrice', { label: '本期消费', field: 'totalPrice', type: 1 }],
  ['lastPeriodPayable', { label: '上期未结', field: 'lastPeriodPayable', type: 2 }],
  ['dissentAmount', { label: '本期异议', field: 'dissentAmount', type: 3 }],
  ['unRetrievedAmount', { label: '未取回票据', field: 'unRetrievedAmount', type: 4 }],
  ['overPeriodRefundAmount', { label: '跨帐期退', field: 'overPeriodRefundAmount', type: 5 }],
  ['payable', { label: '本期应结', field: 'payable', type: 10 }]
])

export const ORDER_STATUS_TYPE = new Map([
  [0, '预订'],
  [1, '改签'],
  [2, '退票']
])

export const SETTLEMENT_DIMENSION = new Map([
  [0, '未知'],
  [1, '支付'],
  [2, '行程结束']
])

export const YES_OR_NO = new Map([
  [0, '否'],
  [1, '是']
])

export const INVOICE_STATUS = new Map([
  [0, '未开具'],
  [1, '已开具'],
  [2, '开具失败'],
  [3, '无需开具']
])

export const SETTLEMENT_TYPE = new Map([
  [0, '未知'],
  [1, '授信'],
  [2, '单结'],
  [4, '企业钱包(充值)'],
  [6, '支付宝_单位代付'],
  [7, '银票']
])

export const DISSENT_STATUS = new Map([
  [0, '待处理'],
  [1, '待处理'],
  [9, '自动处理']
])

export const PAY_TYPE = new Map([
  [1, '支付宝'],
  [2, '微信'],
  [98, '授信帐户'],
  [99, '钱包抵扣'],
  [100, '积分支付'],
  [110, '支付宝(单位代付)'],
  [97, '企业钱包帐户']
])

export const INVOICE_CATEGORY = new Map([
  [0, '电子票'],
  [1, '纸质票']
])
