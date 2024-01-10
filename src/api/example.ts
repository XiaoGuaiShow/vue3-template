import axiosInstance, { RequestConfig } from './axiosInstance.ts'

type Data = Record<string, any>
export const showGlobalLoading = () => {
  return axiosInstance.request({
    method: 'get',
    url: 'platform/pc-businessopenrecord/getBusinessOpenRecords',
    showGlobalLoading: true // 是否显示全局loading
  } as RequestConfig)
}

export const download = (data: Data) => {
  return axiosInstance.request({
    method: 'post',
    url: 'pointatps/place/download',
    data,
    isDownload: true // 是否下载
  } as RequestConfig)
}

export const timeout = (data: Data) => {
  return axiosInstance.request({
    method: 'post',
    url: 'pointatps/place/timeout',
    data,
    timeout: 1000 // 超时时间
  } as RequestConfig)
}
