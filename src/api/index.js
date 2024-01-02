import http from './httpInstance.js'
// /devApi配合跨域代理使用
const baseUrl = process.env.NODE_ENV === 'development' ? '/devApi' : ''

export function getPlacePage(data) {
    return http({
        method: 'post',
        url: baseUrl + '/pointatps/place/page',
        data,
    })
}