import { defineStore } from 'pinia'

interface UserInfo {
  apiUrl?: string
  token?: string
  memberId?: string
  refId?: string
  version?: string
  enterpriseId?: number
  isManager?: number
}

const KEY = 'userState'

export const useUserStore = defineStore({
  id: KEY,
  state: () => ({
    userInfo: {
      apiUrl: '',
      token: '',
      memberId: '',
      refId: '',
      version: '',
      enterpriseId: 0,
      isManager: 0
    } as UserInfo
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
