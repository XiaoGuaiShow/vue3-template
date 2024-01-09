import axiosInstance, { RequestConfig } from '@/api/axiosInstance.ts'

type Data = Record<string, any>

export const GetDepartmentList = (data: Data) => {
  return axiosInstance.request<RequestConfig>({
    data,
    method: 'post',
    url: 'b2b/Customer/GetDepartmentList'
  })
}

export const GetCustomerStuffList = (data: Data) => {
  return axiosInstance.request<RequestConfig>({
    data,
    method: 'post',
    url: 'b2b/Customer/GetCustomerStuffList'
  })
}

export const SearchStuffAndDepartment = (data: Data) => {
  return axiosInstance.request<RequestConfig>({
    data,
    method: 'post',
    url: 'b2b/Customer/SearchStuffAndDepartment'
  })
}
