import http from './httpInstance.js'
// /devApi配合跨域代理使用
const baseUrl = process.env.NODE_ENV === 'development' ? '/devApi' : ''

export const getPlacePage = (data) => {
	return http({
		method: 'post',
		url: baseUrl + '/pointatps/place/page',
		data
	})
}
