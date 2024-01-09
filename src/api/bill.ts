import axiosInstance from './axiosInstance.ts'
import type { PageVo, ExportRecordResult, Result } from './types/index'

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
