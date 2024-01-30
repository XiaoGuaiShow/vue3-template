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
        <!-- <div class="btn btn-primary plain">导出账单</div> -->
        <div
          v-if="periodSumDTO.settlementStatus === 6"
          class="btn btn-primary"
          @click="showBillDialog = true">
          确认并提交开票
        </div>
      </div>
    </div>
    <div class="section mt-12">
      <div class="fs-20 fw-600 c-font-primary">账单汇总</div>
      <SummaryExpression class="mt-12" :summary="periodSumDTO" :type="2"></SummaryExpression>
    </div>
    <div class="section mt-12">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item in tabs" :key="item.field" :label="item.label" :name="item.field">
          <OrderTable
            v-if="activeName === item.field"
            :dataType="item.type"
            :enterpriseId="enterpriseId"
            :periodId="periodId" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <BillConfirmationDialog
      v-if="showBillDialog"
      :expressionType="2"
      :enterpriseId="enterpriseId"
      :periodId="periodId"
      @close="showBillDialog = false"
      @confirm="handleConfirm" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import OrderTable from './OrderTable.vue'
import SummaryExpression from '../components/SummaryExpression.vue'
import { useRouter, useRoute } from 'vue-router'
import { getBillPeriodSummary } from '@/api/bill'
import type { PeriodSum } from '@/pages/bill/types'
import { BILL_CATEGORY } from '@/common/static'
import { useBillStore } from '@/store/modules/bill'
import mittBus from '@/utils/mitt'

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
const route = useRoute()
const getDetail = () => {
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
            periodSumDTO.value = res.data
            // 初始化tab页签，初始化默认页签
            tabs.value = generateTabs(periodSumDTO.value)
            if (route?.query?.tabName) {
              activeName.value = route.query.tabName as string
            } else {
              activeName.value = tabs.value.length ? tabs.value[0].field : ''
            }
          } else {
            periodSumDTO.value = {
              totalPrice: 0, // 本期消费
              lastPeriodPayable: 0, // 上期未结
              dissentAmount: 0, // 异议金额
              unRetrievedAmount: 0, // 未取回票据
              overPeriodRefundAmount: 0, // 跨账期改退
              payable: 0, // 本期应退
              periodName: '',
              enterpriseId: enterpriseId.value,
              periodId: periodId.value
            }
          }
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
}
getDetail()

mittBus.on('changeTab', (tabName: any) => {
  activeName.value = tabName
  showBillDialog.value = false
})

function generateTabs(obj: any): TabItem[] {
  const tabs: TabItem[] = []
  const category = [...BILL_CATEGORY.values()]
  category.forEach((item) => {
    if (obj[item.field] || obj[item.field] === 0) {
      tabs.push(item)
    }
  })
  return tabs
}

const showBillDialog = ref(false)
const handleConfirm = () => {
  getDetail()
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
