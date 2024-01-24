import axiosInstance, { RequestConfig } from './axiosInstance.ts'
import type {
  PageVO1,
  ExportRecordResult,
  Result,
  RechargeRequestParams,
  EnterpriseResult,
  SumData,
  SumResult,
  SummaryTableParams,
  SummaryTableResult,
  SettledAmountDetailsParams,
  SettledAmountDetailsResult,
  BillPeriodListParams,
  BillPeriodListResult,
  BillPeriodDetailResult,
  BillPeriodSummary,
  InvoiceListParams,
  InvoiceListResult,
  BillPeriodSummaryDetailParams
} from '@/pages/bill/types'

export const getExportRecordList = (data: PageVO1): Promise<ExportRecordResult> => {
  return axiosInstance({
    method: 'post',
    url: 'platform/bill/pageExportBillRecord',
    data
  })
}
export const deleteExportRecordItem = (id: string): Promise<Result> => {
  return axiosInstance({
    method: 'get',
    url: 'platform/bill/deleteExportBillRecord',
    params: { recordId: id }
  })
}
export const getRechargeList = (data: RechargeRequestParams) => {
  return axiosInstance({
    method: 'post',
    url: 'common/api/Enterprise/GetRechargeListV2',
    data,
    defaultParamsInRequest: true
  } as RequestConfig)
}
// 获取集团公司列表
export const getCompanyList = (needSum = true): Promise<EnterpriseResult> => {
  return axiosInstance({
    method: 'get',
    url: 'platform-web/settlement/year-settlement/enterprises',
    params: {
      needSum
    }
  })
}
export const getBelongCompanyList = (): Promise<any> => {
  return axiosInstance({
    method: 'get',
    url: 'platform/account/list'
  })
}

// 单账期导出
export const exportPeriodItem = (params: {
  enterpriseId: number
  periodId: number
}): Promise<any> => {
  return axiosInstance({
    method: 'get',
    url: 'platform-web/settlement/enterprise/period/export',
    params,
    isDownload: true,
    skipTypeCheck: true
  } as any)
}

// 获取年度总览数据展示
export const getOverviewDatas = (data: SumData): Promise<SumResult> => {
  return axiosInstance({
    method: 'post',
    url: 'finance-bill/platform/settlement/group/sum',
    data
  })
}

// 按照月份获取集团汇总表格
export const getSummaryTableList = (data: SummaryTableParams): Promise<SummaryTableResult> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/settlement/group/month/bills',
    data
  })
}

// 导出单月所有结算单
export const exportPeriodAll = (data: SummaryTableParams): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/settlement/group/export',
    data,
    isDownload: true,
    skipTypeCheck: true
  } as any)
}

// 已结算金额鼠标悬浮的金额明细
export const getSettledAmountDetails = (
  params: SettledAmountDetailsParams
): Promise<SettledAmountDetailsResult> => {
  return axiosInstance({
    method: 'get',
    url: 'finance-bill/platform/settlement/enterprise/period/payment/records',
    params
  })
}

// 账单汇总-生成每月的账期列表
export const getBillPeriodList = (data: BillPeriodListParams): Promise<BillPeriodListResult> => {
  return axiosInstance({
    method: 'post',
    url: 'finance-bill/platform/settlement/enterprise/month/periods',
    data
  })
}

// 账单汇总-每月单个账期的详情，包含分类概览
export const getBillPeriodDetail = (params: {
  enterpriseId: number
  periodId: number
  periodStartDate: string
  periodEndDate: string
}): Promise<BillPeriodDetailResult> => {
  return axiosInstance({
    method: 'get',
    url: 'platform-web/settlement/enterprise/period/sum/detail',
    params
  })
}

// 单账期-账期汇总数据
export const getBillPeriodSummary = (params: {
  enterpriseId: number
  periodId: number
}): Promise<BillPeriodSummary> => {
  return axiosInstance({
    method: 'get',
    url: 'platform-web/settlement/enterprise/period/sum',
    params
  })
}

// 获取发票列表
export const getInvoiceList = (data: InvoiceListParams): Promise<InvoiceListResult> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/settlement/enterprise/period/invoice/records',
    data
  })
}

// 汇总明细接口
export const getBillPeriodSummaryDetail = (data: BillPeriodSummaryDetailParams): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/bill-detail/enterprise/period/order/records',
    data
  })
}

// 消费数据
export const getConsumptionData = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/settlement/enterprise/order/records',
    data
  })
}

// 账单列表
export const getBillList = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/settlement/enterprise/period/bills',
    data
  })
}
