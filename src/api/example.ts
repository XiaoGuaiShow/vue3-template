import axiosInstance from './axiosInstance.ts'

export const showGlobalLoading = (data) => {
	return axiosInstance({
		method: 'post',
		url: '/pointatps/place/page',
		data,
		showGlobalLoading: true // 是否显示全局loading
	})
}

export const download = (data) => {
	return axiosInstance({
		method: 'post',
		url: '/pointatps/place/download',
		data,
		isDownload: true // 是否下载
	})
}
