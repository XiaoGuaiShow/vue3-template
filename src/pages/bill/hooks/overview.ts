import { ref } from 'vue'
export const useYearAndCompany = () => {
  const loading = ref(true) // 数据更新页面的loading
  const year = ref(2023) // 年份
  const company = ref('sike') // 公司id
  const isSummary = ref(false) // 是否是汇总页
  const handleSelectYear = (value: number) => {
    year.value = value
    requestData()
  }
  const handleSelectCompany = (value: string) => {
    company.value = value
    isSummary.value = value === 'huizong'
    requestData()
  }
  const requestData = async () => {
    loading.value = true
    // 模拟异步请求数据
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
  requestData()
  return { year, company, loading, isSummary, handleSelectYear, handleSelectCompany }
}
