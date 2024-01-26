import { ref } from 'vue'
import { getCompanyList } from '@/api/bill'
import type { EnterpriseItem, EnterpriseOptionItem } from '@/pages/bill/types'
import mittBus from '@/utils/mitt.ts'

export const useYearAndCompany = async (needSum = true) => {
  const year = ref(new Date().getFullYear()) // 年份
  const enterpriseId = ref('') // 公司id
  const enterpriseList: Ref<EnterpriseItem[]> = ref([]) // 公司列表
  const isSummary = ref(false) // 是否是汇总页
  const enterpriseOptions = ref<EnterpriseOptionItem[]>([])
  try {
    const { data } = await getCompanyList(needSum)
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

  mittBus.on('willToBillDetail', (data: any) => {
    data.enterpriseId && (enterpriseId.value = data.enterpriseId)
    data.year && (year.value = data.year)
  })

  return {
    year,
    enterpriseId,
    enterpriseList,
    enterpriseOptions,
    isSummary
  }
}
