import axios, { AxiosRequestConfig, CancelToken } from 'axios'
import { ElMessage } from 'element-plus'
import { RESPONSE_STATUS } from '@/api/reponseStatus.ts'
import downloadFile from '@/utils/downloadFile.ts'
import { getMemberId, getPlatId, getVersion, getRefId, getToken, getikey } from '@/utils/auth'

type RequestMap = Record<string, CancelToken>

interface RequestOptions extends AxiosRequestConfig {
	showGlobalLoading?: boolean
	isDownload?: boolean
	downloadOptions?: {
		fileName?: string
		contentType?: string
	}
}

const BASE_URL = 'https://api.example.com'
const requestMap: RequestMap = {}
let loadingInstance: any
let requestsCount = 0

function getRequestKey(config: RequestOptions): string {
	const { url, method, params, data } = config
	return `${method}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`
}
function addRequestToMap(config: RequestOptions): CancelToken {
	const requestKey = getRequestKey(config)
	if (requestMap[requestKey]) {
		requestMap[requestKey].cancel('Request canceled')
	}

	const source = CancelToken.source()
	requestMap[requestKey] = source

	return source.token
}

function deleteRequestFromMap(config: RequestOptions): void {
	const requestKey = getRequestKey(config)
	delete requestMap[requestKey]
}

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 20000,
	headers: {
		'Content-Type': 'application/json'
	}
})

axiosInstance.interceptors.request.use(
	(config) => {
		if (config.showGlobalLoading) {
			requestsCount++
			loadingInstance = ElLoading.service({
				fullscreen: true,
				lock: true,
				text: '加载中...',
				background: 'rgba(0, 0, 0, 0.7)'
			})
		}
		if (config.isDownload) {
			config.responseType = 'blob'
		}
		config.cancelToken = addRequestToMap(config)
		config.headers['MemberId'] = getMemberId()
		config.headers['PlatId'] = getPlatId()
		config.headers['Version'] = getVersion()
		config.headers['RefId'] = getRefId()
		config.headers['Token'] = getToken()
		config.headers['ikey'] = getikey()

		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

axiosInstance.interceptors.response.use(
	(response) => {
		requestsCount--
		deleteRequestFromMap(response.config)

		if (requestsCount === 0 && loadingInstance) {
			loadingInstance.close()
		}

		if (response.config.isDownload) {
			downloadFile(response, response.config.downloadOptions)
		}

		if (response.status >= 200 && response.status < 300) {
			if (response.data.code === RESPONSE_STATUS.SUCCESS) {
				return Promise.resolve({
					code: response.data.code,
					msg: response.data.msg,
					data: response.data.data
				})
			} else {
				ElMessage({
					message: response.data.msg,
					type: 'error'
				})
				return Promise.reject(response.data.msg)
			}
		} else {
			const error = new Error(response.statusText || '请求出错')
			error.response = response
			return Promise.reject(error)
		}
	},
	(error) => {
		requestsCount--
		deleteRequestFromMap(error.config)

		if (requestsCount === 0 && loadingInstance) {
			loadingInstance.close()
		}

		if (error.response) {
			console.error({
				'Response error': error.response.data,
				'Status code': error.response.status
			})
		} else if (error.request) {
			console.error('No response received')
		} else {
			console.error(`Error: ${error.message}`)
		}
		return Promise.reject(error)
	}
)

export const getRequestsCount = () => {
	return requestsCount
}

export default axiosInstance
