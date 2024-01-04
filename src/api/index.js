import http from './httpInstance.js'

export const getPlacePage = (data) => {
	return http({
		method: 'post',
		url: '/pointatps/place/page',
		data
	})
}
