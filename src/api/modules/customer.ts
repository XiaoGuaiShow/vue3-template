import axiosInstance, { RequestConfig } from '@/api/axiosInstance.ts'

type Data = Record<string, any>

export const GetDepartmentList = (data: Data) => {
  return axiosInstance.request({
    data,
    method: 'post',
    url: 'b2b/Customer/GetDepartmentList',
    defaultParamsInRequest: true
  } as RequestConfig)
}

export const GetCustomerStuffList = (data: Data) => {
  return axiosInstance.request({
    data,
    method: 'post',
    url: 'b2b/Customer/GetCustomerStuffList',
    defaultParamsInRequest: true
  } as RequestConfig)
}

export const SearchStuffAndDepartment = (data: Data) => {
  return axiosInstance.request({
    data,
    method: 'post',
    url: 'b2b/Customer/SearchStuffAndDepartment',
    defaultParamsInRequest: true
  } as RequestConfig)
}
