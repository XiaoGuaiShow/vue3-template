<template>
  <div class="container" v-loading="loading">
    <div class="section flex ai-c">
      <!-- 返回 -->
      <el-link
        class="c-brand-blue fs-14 flex ai-c"
        :underline="false"
        type="primary"
        @click="goBack">
        <ArrowLeft style="width: 1em; height: 1em; margin-right: 4px" />
        返回
      </el-link>
      <div class="flex-1 ta-c fs-16 fw-600 c-font-primary">
        {{ periodSumDTO.periodName }}
      </div>
      <div>
        <el-button type="primary" plain>导出账单</el-button>
        <el-button type="primary">确认并提交开票</el-button>
      </div>
    </div>
    <div class="section mt-12">
      <div class="fs-20 fw-600 c-font-primary">账单汇总</div>
      <SummaryExpression class="mt-12" :summary="periodSumDTO"></SummaryExpression>
    </div>
    <div class="section mt-12">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item in tabs" :key="item.field" :label="item.label" :name="item.field">
          <OrderTable :dataType="item.type" :enterpriseId="enterpriseId" :periodId="periodId" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import OrderTable from './OrderTable.vue'
import SummaryExpression from '../components/SummaryExpression.vue'
import { useRouter } from 'vue-router'
import { getBillPeriodSummary } from '@/api/bill'
import type { PeriodSum } from '@/pages/bill/types'
import { BILL_CATEGORY } from '@/common/static'
import { useBillStore } from '@/store/modules/bill'
const billStore = useBillStore()
// init
const router = useRouter()
const activeName = ref('')
const periodId = computed(() => billStore.billDetail.periodId)
const enterpriseId = computed(() => billStore.billDetail.enterpriseId)
interface TabItem {
  label: string
  field: string
  type: number
}
const tabs: Ref<TabItem[]> = ref([])
const loading = ref(false)

// 获取账单汇总信息
const periodSumDTO: Ref<Partial<PeriodSum>> = ref({
  periodName: ''
})
watchEffect(() => {
  if (periodId.value && enterpriseId.value) {
    loading.value = true
    const params = {
      enterpriseId: enterpriseId.value,
      periodId: periodId.value
    }
    getBillPeriodSummary(params)
      .then((res) => {
        if (res.code === '0000') {
          if (res.data) {
            periodSumDTO.value = {
              totalPrice: 10000, // 本期消费
              lastPeriodPayable: 12, // 上期未结
              dissentAmount: 500, // 异议金额
              unRetrievedAmount: 2500, // 未取回票据
              overPeriodRefundAmount: 800, // 跨账期改退
              payable: 4000, // 本期应退
              periodName: '苏州思客信息技术有限公司2023-10-01至2023-10-31结算单1'
            }
            // 初始化tab页签，初始化默认页签
            tabs.value = generateTabs(periodSumDTO.value)
            activeName.value = tabs.value.length ? tabs.value[0].field : ''
          }
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
})

function generateTabs(obj: Partial<PeriodSum>): TabItem[] {
  const tabs: TabItem[] = []
  const category = [...BILL_CATEGORY.values()]
  console.log(category)
  category.forEach((item) => {
    if (obj[item.field] || obj[item.field] === 0) {
      tabs.push(item)
    }
  })
  return tabs
}

const goBack = () => {
  router.go(-1)
}
</script>

<style lang="less" scoped>
.container {
  padding: 0 12px 12px;
  .section {
    padding: 24px;
    background-color: var(--bg-white);
    border-radius: 6px;
  }
}
:deep(.el-tabs__header.is-top) {
  margin: 0;
}
</style>
