import { defineStore } from 'pinia'

export const useZimuStore = defineStore('zimu', {
  state: () => {
    return {
      // 企业信息
      currentEnterprise: {
        id: '',
        accountEnterpriseId: '',
        companyName: ''
      },
      address: '' // 保存的发票地址
    }
  },
  actions: {
    // 设置当前选中的企业id
    setEnterpriseInfo(item: any) {
      this.currentEnterprise = item
    }
  }
})
