import { useBillStore } from '@/store/modules/bill'
const billStore = useBillStore()
export function useOverview() {
  // 年
  const year = ref(new Date().getFullYear())
  const yearChange = (val: number) => {
    year.value = val
  }
  if (billStore.overviewDatas.year) {
    yearChange(billStore.overviewDatas.year)
  }
  // 月
  const month = ref(new Date().getMonth() + 1)
  const monthChange = (val: number) => {
    month.value = val
  }
  if (billStore.overviewDatas.month) {
    monthChange(billStore.overviewDatas.month)
  }
  // 企业id
  const isSummary = ref(false)
  const enterpriseId = ref(0)
  const enterpriseIdList = ref<number[]>([])
  const setEnterpriseIdFn = (id: number, idList: number[], show: boolean) => {
    enterpriseId.value = id
    enterpriseIdList.value = idList
    isSummary.value = show
  }
  if (billStore.overviewDatas.enterpriseId) {
    const eId = billStore.overviewDatas.enterpriseId
    setEnterpriseIdFn(eId, [eId], false)
  }
  // 账期id
  const periodId = ref(0)

  return {
    year,
    yearChange,
    month,
    monthChange,
    enterpriseId,
    enterpriseIdList,
    setEnterpriseIdFn,
    periodId,
    isSummary
  }
}
