import axiosInstance, { RequestConfig } from '@/api/axiosInstance.ts'

export const GetRoleList = () => {
  return axiosInstance.request({
    method: 'post',
    url: 'common/api/Customer/Role/GetRoleList',
    defaultParamsInRequest: true
  } as RequestConfig)
}

export const GetEnterpriseRoleSurvey = () => {
  return axiosInstance.request({
    method: 'post',
    url: 'b2b/Enterprise/GetEnterpriseRoleSurvey',
    defaultParamsInRequest: true
  } as RequestConfig)
}
