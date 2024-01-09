import axiosInstance, { RequestConfig } from '@/api/axiosInstance.ts'

export const GetRoleList = () => {
  return axiosInstance.request<RequestConfig>({
    method: 'post',
    url: 'common/api/Customer/Role/GetRoleList'
  })
}

export const GetEnterpriseRoleSurvey = () => {
  return axiosInstance.request<RequestConfig>({
    method: 'post',
    url: 'b2b/Enterprise/GetEnterpriseRoleSurvey'
  })
}
