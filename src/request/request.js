import axios from 'axios';
import { ElMessage } from 'element-plus';
import { getApiConfig, getToken, getMemberId, getPlatId, getikey, getVersion, getUUId, getRefId } from './auth';
import downloadExcel from '../common/downloadExcel.js';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: getBaseUrl(),  //不做灰度处理
  // 超时
  timeout: 120000,
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    //自定义请求头
    if (getToken()) {
      config.headers['Token'] = getToken(); // 让每个请求携带自定义token
    }
    if (getMemberId()) {
      config.headers['MemberId'] = getMemberId();
    }
    if (getPlatId()) {
      config.headers['PlatId'] = getPlatId();
    }
    if (getikey()) {
      config.headers['ikey'] = getikey();
    }
    if (getVersion()) {
      config.headers['Version'] = getVersion();
    }
    if (getUUId()) {
      config.headers['sessionId'] = getUUId();
      config.headers['reqId'] = getUUId();
    }
    if (config.contentType) {
      config.headers['Content-Type'] = config.contentType;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || res.data.Code || '0000';
    if ((code === '8000' || code === '8001') && window.location.href.indexOf('login') < 0) {
      localStorage.clear();
      setInterval(() => {
        window.location.href = window.location.protocol + '//' + window.location.host;
      }, 500);
    } else if (res.config.responseType === 'blob') {
      downloadExcel(res);
    } else {
      return res.data;
    }
  },
  (error) => {
    let { message } = error;
    if (message == 'Network Error') {
      message = '网络连接异常';
    } else if (message.includes('timeout')) {
      message = '请求网络超时';
    } else if (message.includes('Request failed with status code')) {
      message = '系统' + message.substr(message.length - 3) + '异常';
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default function request(option) {
  let { apiModule, data, params, id, responseType, contentType } = option;

  let config = {
    url: apiModule.address,
    method: apiModule.method,
    baseURL: getApiConfig(apiModule),
  };
  if (apiModule.method == 'post') {
    data = data || {};
    data.MemberId = getMemberId();
    data.Token = getToken();
    data.PlatId = getPlatId();
    data.RefId = getRefId();
    data.ikey = getikey();
    data.Version = getVersion();
  }

  if (id >= 0) {
    config.url += '/' + id;
  } else if (apiModule.method === 'get') {
    params = params || {};
    params.getTime = new Date().getTime();
  }
  if (params) {
    config.params = params;
  }
  if (responseType) {
    config.responseType = responseType;
  }
  if (contentType) {
    config.contentType = contentType;
  }
  // get请求映射params参数，并转义
  if (apiModule.method === 'get' && params) {
    let url = '?';
    for (const propName of Object.keys(params)) {
      const value = params[propName];
      var part = encodeURIComponent(propName) + '=';
      if (value !== null && typeof value !== 'undefined') {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let param = propName + '[' + key + ']';
            var subPart = encodeURIComponent(param) + '=';
            url += subPart + encodeURIComponent(value[key]) + '&';
          }
        } else {
          url += part + encodeURIComponent(value) + '&';
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url += url;
  }
  if (data) {
    config.data = data;
  }
  //灰度处理
  return service(config);
}
