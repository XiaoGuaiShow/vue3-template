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
