import { ref } from 'vue'
import { getCompanyList } from '@/api/bill'
import type { EnterpriseItem, EnterpriseOptionItem } from '@/pages/bill/types'

export const useYearAndCompany = async () => {
  const year = ref(new Date().getFullYear()) // 年份
  const yearList = generateYears(2024)
  const enterpriseId = ref('') // 公司id
  const enterpriseList: Ref<EnterpriseItem[]> = ref([]) // 公司列表
  const isSummary = ref(false) // 是否是汇总页
  const enterpriseOptions = ref<EnterpriseOptionItem[]>([])
  try {
    const { code } = await getCompanyList()
    const data: EnterpriseItem[] = [
      { enterpriseId: '1213122', enterpriseName: '苏州思客', type: 0 },
      { enterpriseId: '5555555', enterpriseName: '集团汇总', type: -1 },
      { enterpriseId: '6666666', enterpriseName: '思客国旅', type: 1 },
      { enterpriseId: '7777777', enterpriseName: '上海思客', type: 1 }
    ]
    enterpriseList.value = data
    const option1 = []
    const option2 = []
    for (const item of data) {
      if (item.type === 0 || item.type === -1) {
        option1.push({
          label: item.enterpriseName,
          value: item.enterpriseId
        })
        // 初始化赋值母公司id
        if (item.type === 0) {
          enterpriseId.value = item.enterpriseId
        }
      }
      if (item.type === 1) {
        option2.push({
          label: item.enterpriseName,
          value: item.enterpriseId
        })
      }
    }
    if (option1.length > 0) {
      enterpriseOptions.value.push({
        label: '集团',
        options: option1
      })
    }
    if (option2.length > 0) {
      enterpriseOptions.value.push({
        label: '子公司',
        options: option2
      })
    }
  } catch (err: any) {
    console.log(err)
  }

  return {
    year,
    yearList,
    enterpriseId,
    enterpriseList,
    enterpriseOptions,
    isSummary
  }
}

function generateYears(year: number) {
  const currentYear = new Date().getFullYear()
  const years = currentYear - year
  const list = []
  for (let i = year; i <= year + years; i++) {
    list.unshift(i)
  }
  return list
}
