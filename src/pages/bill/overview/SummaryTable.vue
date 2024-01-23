<template>
  <div class="inner-section">
    <el-form :inline="true" :model="formInline">
      <el-form-item label="结算状态">
        <el-select v-model="formInline.settlementStatus" placeholder="请选择">
          <el-option label="全部" :value="-1" />
          <el-option
            v-for="[key, value] of SETTLEMENT_STATUS"
            :key="key"
            :value="key"
            :label="value" />
        </el-select>
      </el-form-item>
      <el-form-item label="结算单名称">
        <el-input v-model="formInline.periodName" placeholder="请输入名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" plain @click="handleExportAll">导出汇总账单</el-button>
      </el-form-item>
    </el-form>

    <el-table class="mt-6" :data="tableData" stripe border max-height="280" v-loading="loading">
      <el-table-column prop="periodName" label="结算单名称" show-overflow-tooltip>
        <template #default="{ row }">
          <span class="link" @click="goLink(row.periodId)">{{ row.periodName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="range" label="结算周期" width="215" align="center">
        <template #default="{ row }">
          <span>{{ row.periodStartDate }}</span>
          <span v-if="row.periodStartDate && row.periodEndDate">至</span>
          <span>{{ row.periodEndDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="应结(元)" width="148" align="center" />
      <el-table-column prop="totalPaymentAmount" label="已结算(元)" width="138" align="center">
        <template #default="{ row }">
          <el-popover
            placement="top"
            :width="310"
            @before-enter="handleBeforeEnter(row.enterpriseId, row.periodId)">
            <template #reference>
              <span class="c-brand-blue">{{ row.totalPaymentAmount }}</span>
            </template>
            <div class="fs-12">
              <el-table :data="amountTable" stripe border v-loading="tLoading">
                <el-table-column prop="paymentAmount" label="还款金额(元)" />
                <el-table-column prop="paymentDate" label="还款日期" />
              </el-table>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="unPaymentAmount" label="未结算(元)" width="138" align="center" />
      <el-table-column prop="settlementStatus" label="结算单状态" width="138" align="center">
        <template #default="{ row }">
          {{ SETTLEMENT_STATUS.get(row.settlementStatus) || '' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="periodLatestPaymentDate"
        label="最晚结算日"
        width="138"
        align="center" />
      <el-table-column label="操作" width="100" align="center">
        <template #default="scope">
          <div class="link" @click="handleExport(scope.row)">导出</div>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex jc-sb ai-c mt-16">
      <div class="fs-12 fw-600 c-font-primary">
        <span class="mr-16">应结 ¥{{ sumTotalPrice }}</span>
        <span class="mr-16">已结算 ¥{{ sumTotalPaymentAmount }}</span>
        <span>未结算 ¥{{ sumUnPaymentAmount }}</span>
      </div>
      <el-pagination
        v-model:current-page="pageVO.pageIndex"
        v-model:page-size="pageVO.pageSize"
        small
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { TableItem, BasicParams, SummaryTableItem, AmountItem } from '../types'
import {
  getSummaryTableList,
  getSettledAmountDetails,
  exportPeriodItem,
  exportPeriodAll
} from '@/api/bill'
import { SETTLEMENT_STATUS } from '@/common/static'
import { useRouter } from 'vue-router'

const props = defineProps<{
  basicParams: BasicParams
}>()
const formInline = reactive({
  settlementStatus: -1,
  periodName: ''
})
const pageVO = reactive({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
const onSubmit = () => {
  pageVO.pageIndex = 1
  getTableData()
}
const tableData = ref<SummaryTableItem[]>([
  {
    enterpriseId: 12312121,
    periodId: 45,
    periodStartDate: '2023-09-16',
    periodEndDate: '2023-09-30',
    totalPaymentAmount: 10000,
    totalPrice: 32000,
    unPaymentAmount: 22000,
    settlementStatus: 1,
    periodLatestPaymentDate: '2023-09-20',
    periodName: '苏州A有限公司2023-09-16至2023-09-30结算单'
  }
])
const handleSizeChange = (val: number) => {
  pageVO.pageIndex = 1
  pageVO.pageSize = val
  getTableData()
}
const handleCurrentChange = (val: number) => {
  pageVO.pageIndex = val
  getTableData()
}
const loading = ref(false)
const sumTotalPrice = ref(0) // 应结
const sumTotalPaymentAmount = ref(0) // 已结
const sumUnPaymentAmount = ref(0) // 未结
const getTableData = () => {
  // 请求表格数据
  loading.value = true
  getSummaryTableList({
    ...props.basicParams,
    ...formInline,
    ...pageVO
  }).then((res) => {
    console.log(res)
    tableData.value = res.data.results.billDetailList
    total.value = res.data.total
    loading.value = false
    sumTotalPrice.value = res.data.sumTotalPrice
    sumTotalPaymentAmount.value = res.data.sumTotalPaymentAmount
    sumUnPaymentAmount.value = res.data.sumUnPaymentAmount
  })
}
watch(
  () => props.basicParams,
  (newVal) => {
    getTableData()
  },
  { immediate: true, deep: true }
)

// 点击结算单跳转
const router = useRouter()
const goLink = (id: number) => {
  router.push(`/bill/details/${id}`)
}

// 已结算金额鼠标悬浮表格
const amountTable = ref<AmountItem[]>([])
const tLoading = ref(false)
const amountMap = new Map<number, AmountItem[]>()
const handleBeforeEnter = (enterpriseId: number, periodId: number) => {
  // 判断能不能中map中拿到数据
  const data = amountMap.get(periodId)
  if (data) {
    amountTable.value = data
    tLoading.value = false
    return
  }
  const params = {
    enterpriseId,
    periodId
  }
  tLoading.value = true
  setTimeout(() => {
    amountTable.value = [
      { paymentAmount: 1000, paymentDate: '2023-12-12' },
      { paymentAmount: 4000, paymentDate: '2024-12-12' },
      { paymentAmount: 5000, paymentDate: '2022-12-12' }
    ]
    amountMap.set(periodId, amountTable.value)
    tLoading.value = false
  }, 1000)
  getSettledAmountDetails(params).then((res) => {
    if (res.code === '0000') {
      amountTable.value = res.data
      amountMap.set(periodId, amountTable.value)
    }
    tLoading.value = false
  })
}

// 导出
const handleExport = (row: TableItem) => {
  exportPeriodItem({ periodId: row.periodId, enterpriseId: row.enterpriseId }).then((res) => {
    console.log(res)
  })
}
const handleExportAll = () => {
  const params = {
    ...props.basicParams,
    ...formInline,
    ...pageVO
  }
  if (params.settlementStatus === -1) {
    Reflect.deleteProperty(params, 'settlementStatus')
  }
  exportPeriodAll(params).then((res) => {
    console.log(res)
  })
}
</script>

<style lang="less" scoped>
.link {
  color: var(--brand-blue);
  cursor: pointer;
  font-size: 13px;
}
.inner-section {
  padding: 24px;
  background: var(--bg-white);
  border-radius: 0 0 8px 8px;
  border-left: 1px solid var(--line-rest);
  border-right: 1px solid var(--line-rest);
  border-bottom: 1px solid var(--line-rest);
}
</style>
