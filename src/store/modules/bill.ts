import { defineStore } from 'pinia'

export const useBillStore = defineStore('enterprise', {
  state: (): any => {
    return {
      // 企业信息
      enterpriseList: [],
      // 当前选中的企业id
      enterpriseId: '0',
      // 开票历史-列表页点击明细记录账期id和企业id
      invoiceHistory: {
        periodId: '',
        enterpriseId: ''
      }
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
    },
    setInvoiceHistory(periodId: string, enterpriseId: string) {
      this.invoiceHistory.periodId = periodId
      this.invoiceHistory.enterpriseId = enterpriseId
    }
  },
  persist: true
})
