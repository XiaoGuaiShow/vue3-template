import { defineStore } from 'pinia'

export const useBillStore = defineStore('enterprise', {
  state: (): any => {
    return {
      // 企业信息
      enterpriseList: [],
      // 当前选中的企业id
      enterpriseId: '0',
      // 当前总览的年度
      activeYear: new Date().getFullYear(),
      overviewDatas: {
        year: null,
        month: null,
        enterpriseId: null,
        periodId: null
      },
      // 开票历史-列表页点击明细记录账期id和企业id
      invoiceHistory: {
        periodId: '',
        enterpriseId: ''
      },
      // 账单明细保存的数据
      billDetail: {
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
    setActiveYear(year: number) {
      this.activeYear = year
    },
    setInvoiceHistory(periodId: string, enterpriseId: string) {
      this.invoiceHistory.periodId = periodId
      this.invoiceHistory.enterpriseId = enterpriseId
    },
    setBillDetail(periodId: string, enterpriseId: string) {
      this.billDetail.periodId = periodId
      this.billDetail.enterpriseId = enterpriseId
    },
    setOverviewDatas(data: any) {
      const { year, month, enterpriseId, periodId } = data
      year && (this.overviewDatas.year = year)
      month && (this.overviewDatas.month = month)
      enterpriseId && (this.overviewDatas.enterpriseId = enterpriseId)
      periodId && (this.overviewDatas.periodId = periodId)
    },
    resetOverviewDatas() {
      this.overviewDatas = { year: '', month: '', enterpriseId: '', periodId: '' }
    }
  },
  persist: true
})
