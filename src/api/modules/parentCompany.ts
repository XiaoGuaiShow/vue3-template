import axiosInstance, { RequestConfig } from '@/api/axiosInstance.ts'

type Data = Record<string, any>

// 新增&编辑公司
export const saveEnterpriseAccount = (data: Data) => {
  return axiosInstance.request<RequestConfig>({
    data,
    method: 'post',
    url: 'platform/account/save'
  })
}
// 查询所有子母公司
export const accountAllList = (data: Data) => {
  return axiosInstance.request<RequestConfig>({
    data,
    method: 'post',
    url: 'platform/account/allList'
  })
}
// 公司详情
export const accountDetail = (data: Data) => {
  return axiosInstance.request<RequestConfig>({
    params: data,
    method: 'get',
    url: 'platform/account/detail'
  })
}
