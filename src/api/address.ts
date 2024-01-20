import axiosInstance, { RequestConfig } from './axiosInstance.ts'

// 获取省市区
export const getAddressList = (): Promise<any> => {
  return axiosInstance({
    method: 'get',
    url: 'b2b/Common/GetAreaList'
  })
}
// 新建邮寄地址
export const createAddress = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform/mailAddress/saveMailAddress',
    data
  })
}
// 编辑邮寄地址
export const modifyAddress = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform/mailAddress/updateMailAddress',
    data
  })
}
// 获取邮寄地址详情
export const getAddressDetail = (params: any): Promise<any> => {
  return axiosInstance({
    method: 'get',
    url: 'platform/mailAddress/getMailAddressDetail',
    params
  })
}
// 获取邮寄地址分页列表
export const getMailingAddressList = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform/mailAddress/pageMailAddress',
    data
  })
}
