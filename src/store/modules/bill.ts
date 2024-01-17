import { defineStore } from 'pinia'

export const useBillStore = defineStore('enterprise', {
  state: () => {
    return {
      // 企业信息
      enterpriseList: [],
      // 当前选中的企业id
      enterpriseId: 0
    }
  },
  actions: {
    // 设置当前选中的企业id
    setEnterpriseId(id: number) {
      this.enterpriseId = id
    },
    // 设置企业列表
    setEnterpriseList(list: any[]) {
      this.enterpriseList = list
    }
  }
})
