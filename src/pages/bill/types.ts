import { InvoiceListParams } from './types'
export interface TableItem {
  id: number
  name: string
  range: string
  needInvoiced: string
  invoiced: string
  uninvoiced: string
  status: string
  lastDay: string
  [propName: string]: any
}

export interface PageVO1 {
  currentIndex: number
  pageSize: number
}

export interface PageVO2 {
  Index: number
  Size: number
}
export interface PageVO3 {
  pageIndex: number // 当前页码
  pageSize: number // 每页显示数量
}

export interface Result {
  code: string
  message: string
  traceId: string
  data: any
}

export interface OptionItem {
  value: string
  label: string
}

export interface ExportRecordListItem {
  id: string
  accountPeriod: string
  createTime: string
  fileName: string
  fileUrl: string
  month: number
  startDate: string
  status: 0 | 1 | 2 | 3
}

interface ExportRecordData {
  total: number
  list: ExportRecordListItem[]
}

export interface ExportRecordResult extends Result {
  data: ExportRecordData
}

export interface DeleteRecordResult extends Result {
  data: any
}

export interface RechargeRequestParams {
  StartTime: string
  EndTime: string
  Status: number | undefined
  IsIncludingSubsidiary?: boolean
  Page: PageVO2
}

export interface EnterpriseItem {
  enterpriseId: number
  enterpriseName: string
  type: -1 | 0 | 1
}
export interface EnterpriseResult extends Result {
  data: EnterpriseItem[]
}

export interface EnterpriseOptionItem {
  label: string
  options: OptionItem[]
}

// 集团汇总入参
export interface SumData {
  enterpriseIdList: number[]
  year: number
}
// 出参
export interface SumResult extends Result {
  data: {
    totalPrice: number // 总消费
    totalPaymentAmount: number // 已结算
    unPaymentAmount: number // 未结算
    invoiceAmount: number // 已开票
    unInvoiceAmount: number // 未开票
    unVatInvoiceAmount: number // 增值税发票未开
    unPrintInvoiceAmount: number // 机票行程单未取
    unTakeoutInvoiceAmount: number // 火车票根未取
  }
}

export interface BasicParams {
  year: number
  month: number
  enterpriseIdList: number[]
}

export interface SummaryTableParams extends PageVO3, SumData {
  month: number
  periodName: string
  settlementStatus: number
}

export interface SummaryTableItem {
  enterpriseId: number // 企业id
  periodEndDate: string // 账期结束日期
  periodId: number // 账期ID
  periodLatestPaymentDate: string // 账期最晚回款日
  periodStartDate: string // 账期开始日期
  settlementStatus: number // 结算状态
  totalPaymentAmount: number // 已结金额
  totalPrice: number // 应结金额
  trackingNumber?: string // 快递单号
  unPaymentAmount: number // 未结金额
  [propName: string]: any // 扩展字段
}

export interface SummaryTableResult extends Result {
  data: PageVO3 & {
    total: number // 总页数
    results: {
      billDetailList: SummaryTableItem[]
      sumTotalPaymentAmount: number // 已结金额
      sumTotalPrice: number // 总应结金额
      sumUnPaymentAmount: number // 未结金额
    }
  }
}

export interface SettledAmountDetailsParams {
  enterpriseId: number
  periodId: number
}

export interface AmountItem {
  paymentAmount: number // 回款金额
  paymentDate: string // 回款日期
  paymentName?: string // 登记人姓名
}

export interface SettledAmountDetailsResult extends Result {
  data: AmountItem[]
}

export interface BillPeriodListParams {
  enterpriseId: number
  month: number
  year: number
}

export interface BillPeriodItem {
  enterpriseId: number // 企业id
  periodId: number
  periodStartDate: string // 账期开始日期
  periodEndDate: string // 账期结束日期
}

export interface BillPeriodListResult extends Result {
  data: BillPeriodItem[]
}

export interface FeeTypeItem {
  feeType: number
  totalPrice: string
}

export interface ProductTypeItem {
  productType: number
  productTotalPrice: string
  feeDetailDTOList: FeeTypeItem[]
}

export interface FeeClassItem {
  feeClass: number
  productDTOList: ProductTypeItem[]
}

export interface PeriodSumDTO {
  totalPrice: number // 本期消费
  lastPeriodPayable: number // 上期未结
  dissentAmount: number // 异议金额
  unRetrievedAmount: number // 未取回票据
  overPeriodRefundAmount: number // 跨账期改退
  payable: number // 本期应结
}

export interface BillPeriodDetail {
  feeClassSumDTOList: FeeClassItem[]
  id: number // 账期id
  latestPaymentDate: string // 最晚还款日
  periodRange: string // 账期周期
  periodSumDTO: Partial<PeriodSumDTO>
  settlementStatus: number | undefined | null | '' // 结算状态
  settlementStatusDesc: string
}

export interface BillPeriodDetailResult extends Result {
  data: BillPeriodDetail
}

export interface BillPeriodSummary extends Result {
  data: PeriodSumDTO
}

export type InvoiceListParams = PageVO3 & SettledAmountDetailsParams

export interface InvoiceListItem {
  buyer: string
  companyAddress: string
  companyBank: string
  companyBankNo: string
  companyPhone: string
  errorMessage: string
  id: number
  invoiceAmount: number
  invoiceSerialNo: string
  invoiceStatus: number
  invoiceTitle: string
  invoiceType: number
  item: string
  productType: number
  recordId: number
  remark: string
  seller: string
  taxNo: string
  [propName: string]: any
}

export interface InvoiceListResult extends Result {
  data: {
    total: number
    results: InvoiceListItem[]
  }
}
