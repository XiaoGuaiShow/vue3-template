import axios from 'axios'
import { ElMessage } from 'element-plus'
const REFRESH_BY_HEADER = 'pleaseRefreshByHeader'
const REQUEST_SUCCESS = '0'

const http = axios.create({
    timeout: 20000,
    withCredentials: true,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
})

// 相应拦截器
http.interceptors.response.use(
    function (response) {

        // 根据响应数据判断是否登录过期
        if (response.data.errorCode === REFRESH_BY_HEADER) {
            let refreshUrl = response.headers['refresh-url'].split('?')[0]
            refreshUrl =
                refreshUrl +
                '?service=' +
                location.protocol +
                '//' +
                location.host +
                location.pathname +
                encodeURIComponent(location.search)
            location.href = refreshUrl
            return
        }

        // 对错误进行统一处理
        if (response.data.code !== REQUEST_SUCCESS) {
            if (!response.config.noMsg && response.data.msg) {
                ElMessage.error(response.data.msg)
            }
            return Promise.reject(response)
        } else if (
            response.data.code === REQUEST_SUCCESS &&
            response.config.successNotify &&
            response.data.msg
        ) {
            // 弹出成功提示
            ElMessage.success(response.data.msg)
        }
        return Promise.resolve({
            code: response.data.code,
            msg: response.data.msg,
            data: response.data.data,
        })
    },
    function (error) {
        if (error.ElMessage.indexOf('timeout') > -1) {
            ElMessage.error('请求超时，请重试！')
        }
        return Promise.reject(error)
    }
)

export default http