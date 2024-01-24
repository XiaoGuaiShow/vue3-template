import axios, {
  AxiosResponse,
  CancelToken,
  CancelTokenSource,
  InternalAxiosRequestConfig
} from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { RESPONSE_STATUS } from '@/api/reponseStatus.ts'
import downloadFile from '@/utils/downloadFile.ts'
import { formatResponse } from '@/utils'
import { getDefaultParams, getApiUrl } from '@/utils/auth'

type RequestMap = Record<string, CancelTokenSource>

export interface RequestConfig extends InternalAxiosRequestConfig {
  defaultParamsInRequest?: boolean
  showGlobalLoading?: boolean
  isDownload?: boolean
  skipTypeCheck?: boolean
  downloadOptions?: {
    fileName?: string
    contentType?: string
  }
}

export interface ResponseOptions extends AxiosResponse {
  config: RequestConfig
}

const BASE_URL = getApiUrl()
const requestMap: RequestMap = {}
let loadingInstance: any
let requestsCount = 0

function getRequestKey(config: RequestConfig): string {
  const { url, method, params, data } = config
  return `${method}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`
}

function addRequestToMap(config: RequestConfig): CancelToken {
  const requestKey = getRequestKey(config)
  if (requestMap[requestKey]) {
    requestMap[requestKey].cancel('Request canceled')
  }

  const source = axios.CancelToken.source()
  requestMap[requestKey] = source

  return source.token
}

function deleteRequestFromMap(config: RequestConfig): void {
  const requestKey = getRequestKey(config)
  delete requestMap[requestKey]
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config: RequestConfig) => {
    const defaultParams = getDefaultParams()
    console.log('jjjjjj', defaultParams)
    console.log('jjjjjj', config)
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
    if (config) {
      config.cancelToken = addRequestToMap(config)
    }

    if (config.defaultParamsInRequest) {
      config.data = Object.assign({}, defaultParams, config.data)
    } else {
      config.headers = Object.assign({}, defaultParams, config.headers)
    }
    if (config?.params?.enterpriseId) {
      config.headers['enterpriseIds'] = config.params.enterpriseId
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: ResponseOptions): any => {
    requestsCount--
    response.config && deleteRequestFromMap(response.config)

    if (requestsCount === 0 && loadingInstance) {
      loadingInstance.close()
    }

    if (response.config.isDownload) {
      downloadFile(response, response.config.downloadOptions)
    }

    if (response.status >= 200 && response.status < 300) {
      const data = formatResponse(response) as any
      if (data.code === RESPONSE_STATUS.SUCCESS || response.config.skipTypeCheck) {
        return Promise.resolve({
          code: data.code,
          msg: data.msg,
          data: data.data
        })
      } else {
        ElMessage({
          message: data.msg,
          type: 'error'
        })
        return Promise.reject(data.msg)
      }
    } else {
      const error = {
        response,
        msg: response.statusText || '请求出错'
      }
      return Promise.reject(error)
    }
  },
  (error) => {
    requestsCount--
    error.config && deleteRequestFromMap(error.config)

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
