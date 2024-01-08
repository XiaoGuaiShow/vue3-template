import { defineStore } from 'pinia'

interface UserInfo {
	token: string
	memberId: string
	enterpriseId: string
}

const KEY = 'userState'

export const useUserStore = defineStore({
	id: KEY,
	state: () => ({
		userInfo: {}
	}),
	getters: {},
	actions: {
		// microApp存储用户信息
		setUserInfo(userInfo: UserInfo) {
			this.userInfo = userInfo
		}
	},
	persist: {
		key: KEY,
		storage: window.localStorage
	}
})
