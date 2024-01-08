import axiosInstance, { RequestConfig } from './axiosInstance.ts'

type Data = Record<string, any>
export const showGlobalLoading = () => {
	return axiosInstance.request<RequestConfig>({
		method: 'get',
		url: 'platform/pc-businessopenrecord/getBusinessOpenRecords',
		showGlobalLoading: true // 是否显示全局loading
	})
}

export const download = (data: Data) => {
	return axiosInstance.request<RequestConfig>({
		method: 'post',
		url: 'pointatps/place/download',
		data,
		isDownload: true // 是否下载
	})
}

export const timeout = (data: Data) => {
	return axiosInstance.request<RequestConfig>({
		method: 'post',
		url: 'pointatps/place/timeout',
		data,
		timeout: 1000 // 超时时间
	})
}