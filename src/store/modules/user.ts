import { defineStore } from 'pinia'

interface UserInfo {
  apiUrl?: string
  token?: string
  memberId?: string
  refId?: string
  version?: string
  enterpriseId?: number
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
    },
    setMemberId(memberId: string) {
      this.userInfo.memberId = memberId
    }
  },
  persist: {
    key: KEY,
    storage: window.localStorage
  }
})
