import { defineStore } from 'pinia'

export const useBillStore = defineStore('enterprise', {
  state: (): any => {
    return {
      // 企业信息
      enterpriseList: [],
      // 当前选中的企业id
      enterpriseId: '0'
    }
  },
  actions: {
    // 设置当前选中的企业id
    setEnterpriseId(id: string) {
      this.enterpriseId = id
    },
    // 设置企业列表
    setEnterpriseList(list: string[]) {
      this.enterpriseList = list
    }
  }
})
