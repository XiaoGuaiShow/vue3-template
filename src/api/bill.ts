import axiosInstance from './axiosInstance.ts'
import type { PageVo, ExportRecordResult, Result, RechargeRequestParams } from './types/index'

export const getExportRecordList = (data: PageVo): Promise<ExportRecordResult> => {
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
  })
}
