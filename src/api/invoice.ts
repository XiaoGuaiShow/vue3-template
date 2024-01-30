import axiosInstance from './axiosInstance.ts'

// 获取发票列表
export const getInvoiceList = (data: any) => {
  return axiosInstance({
    method: 'post',
    url: 'platform/invoice/valid/list',
    data
  })
}
// 新增/编辑开票单位
export const saveInvoiceUnit = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform/invoice/save',
    data
  })
}
// 删除开票单位
export const deleteInvoiceUnit = (id: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform/invoice/delete',
    data: { id }
  })
}
// 开票详情
export const getInvoiceDetail = (id: any): Promise<any> => {
  return axiosInstance({
    method: 'get',
    url: 'platform/invoice/detail',
    params: { id }
  })
}
// 获取开票维度
export const getEnterpriseDimension = (): Promise<any> => {
  return axiosInstance({
    method: 'get',
    url: 'platform/enterpriseDimensionRelation/getEnterpriseDimension'
  })
}
// 获取公司已勾选列表
export const getSelectedCompanyInvoice = (accountId: any): Promise<any> => {
  return axiosInstance({
    method: 'get',
    url: 'platform/account/configuration/invoice',
    params: {
      accountId
    }
  })
}
// 保存公司开票单位
export const saveSelectedCompanyInvoice = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform/account/save/invoice',
    data
  })
}
// 发票历史
export const getInvoiceHistoryList = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/settlement/enterprise/period/invoices',
    data
  })
}
// 发票历史详情
export const getInvoiceHistoryDetail = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/settlement/enterprise/period/invoice/sum',
    data
  })
}
// 开票设置-开票单位列表
export const getAllInvoiceList = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform/invoice/list',
    data
  })
}
// 启用/停用发票
export const validInvoice = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform/invoice/valid',
    data
  })
}
// 票据下载-批量下载
export const downloadInvoice = (params: any): Promise<any> => {
  return axiosInstance({
    method: 'get',
    url: 'platform-web/settlement/enterprise/period/invoice/download',
    params,
    isDownload: true,
    skipTypeCheck: true
  } as any)
}
// 获取开票历史明细中的发票抬头
export const getInvoiceTitleList = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/settlement/enterprise/period/invoice/titles',
    data
  })
}
// 确认并提交开票申请
export const confirmInvoiceApplication = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/settlement/enterprise/period/confirm',
    data
  })
}
// 确认并提交开票申请
export const modifyInvoiceItem = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/settlement/enterprise/period/invoice/record/update',
    data
  })
}
