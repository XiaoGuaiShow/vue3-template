import axiosInstance, { RequestConfig } from '@/api/axiosInstance.ts'

type Data = Record<string, any>

export const GetCostTypeList = (data: Data) => {
  return axiosInstance.request<RequestConfig>({
    data,
    method: 'post',
    url: 'expensecontrol/Expense/GetCostTypeList'
  })
}
