export function useOverview() {
  // 年
  const year = ref(new Date().getFullYear())
  const yearChange = (val: number) => {
    year.value = val
  }
  // 月
  const month = ref(new Date().getMonth() + 1)
  const monthChange = (val: number) => {
    month.value = val
  }
  // 企业id
  const isSummary = ref(false)
  const enterpriseId = ref(0)
  const enterpriseIdList = ref([])
  const setEnterpriseIdFn = (id: number, idList: number[], show: boolean) => {
    enterpriseId.value = id
    enterpriseIdList.value = idList
    isSummary.value = show
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
