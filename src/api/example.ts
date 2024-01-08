import axiosInstance, { RequestConfig } from './axiosInstance.ts'

type Data = Record<string, any>
export const showGlobalLoading = (data: Data) => {
	return axiosInstance.request<RequestConfig>({
		method: 'post',
		url: '/pointatps/place/page',
		data,
		showGlobalLoading: true, // 是否显示全局loading
		timeout: 100 // 超时时间
	})
}

export const download = (data: Data) => {
	return axiosInstance.request<RequestConfig>({
		method: 'post',
		url: '/pointatps/place/download',
		data,
		isDownload: true // 是否下载
	})
}
