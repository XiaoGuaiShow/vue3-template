<template>
  <div class="inner-section">
    <el-form :inline="true" :model="params">
      <el-form-item label="结算周期">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :value-format="'YYYY-MM-DD'"
          style="width: 250px"
          @change="dateChange" />
      </el-form-item>
      <el-form-item label="结算状态">
        <el-select v-model="params.settlementStatus" placeholder="请选择">
          <el-option label="全部" :value="-1" />
          <el-option
            v-for="[key, value] in SETTLEMENT_STATUS"
            :key="key"
            :label="value"
            :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="结算单名称">
        <el-input
          v-model="params.periodName"
          placeholder="请输入名称"
          clearable
          style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="btn-primary w-100" @click="onSubmit">查询</div>
      </el-form-item>
    </el-form>

    <el-table class="mt-6" :data="tableData" stripe border max-height="560" v-loading="loading">
      <el-table-column prop="periodName" label="结算单名称" show-overflow-tooltip>
        <template #default="{ row }">
          <span class="link" @click="handleLink(row)">
            {{ row.periodName + row.periodCycle + '结算单' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="periodCycle" label="结算周期" width="200" align="center" />
      <el-table-column prop="totalPrice" label="应结(元)" width="100" align="center" />
      <el-table-column prop="totalPaymentAmount" label="已结算(元)" width="100" align="center">
        <template #default="{ row }">
          <el-popover
            v-if="row.settlementType === 1 && row.totalPaymentAmount > 0"
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
          <span v-else>{{ row.totalPaymentAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unPaymentAmount" label="未结算(元)" width="100" align="center" />
      <el-table-column prop="invoiced" label="发票信息" width="100" align="center">
        <template #default="{ row }">
          <span class="link" @click="goLink(row)">发票构成</span>
        </template>
      </el-table-column>
      <el-table-column prop="trackingNumber" label="快递单号" width="100" align="center" />
      <el-table-column prop="settlementStatus" label="结算单状态" width="100" align="center">
        <template #default="{ row }">
          {{ SETTLEMENT_STATUS.get(row.settlementStatus) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="periodLatestPaymentDate"
        label="最晚结算日"
        width="100"
        align="center" />
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
import { getBillList, getSettledAmountDetails } from '@/api/bill'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { useBillStore } from '@/store/modules/bill'
import { SETTLEMENT_STATUS } from '@/common/static'
import { AmountItem } from '@/pages/bill/types'
import mittBus from '@/utils/mitt'

const billStore = useBillStore()
const props = defineProps<{
  status: number
  year: number
  enterpriseId: number
}>()
const { status } = toRefs(props)

const loading = ref(false)
const total = ref(0)
const pageVO = {
  pageIndex: 1,
  pageSize: 10
}
const currentYear = new Date().getFullYear()
const dateRange = ref<any>([`${currentYear}-01-01`, `${currentYear}-12-31`])
const params: any = reactive({
  enterpriseId: 0,
  settlementStatus: status || -1,
  periodStartDate: `${currentYear}-01-01`,
  periodEndDate: `${currentYear}-12-31`,
  year: '',
  periodName: ''
})
const dateChange = (date: any) => {
  if (date && date.length === 2) {
    params.periodStartDate = dayjs(date[0]).format('YYYY-MM-DD')
    params.periodEndDate = dayjs(date[1]).format('YYYY-MM-DD')
    params.year = ''
  } else {
    params.periodStartDate = ''
    params.periodEndDate = ''
  }
}
const tableData = ref<any[]>([])
const sumTotalPrice = ref(0)
const sumTotalPaymentAmount = ref(0)
const sumUnPaymentAmount = ref(0)
function getTableList() {
  loading.value = true
  const newParams = {
    ...params,
    ...pageVO
  }
  if (newParams.settlementStatus === -1) {
    Reflect.deleteProperty(newParams, 'settlementStatus')
  }
  getBillList(newParams)
    .then((res) => {
      if (res.code === '0000') {
        if (res.data) {
          tableData.value = res.data.results || []
          total.value = res.data.total
          sumTotalPrice.value = res.data.sumTotalPrice || 0
          sumTotalPaymentAmount.value = res.data.sumTotalPaymentAmount || 0
          sumUnPaymentAmount.value = res.data.sumUnPaymentAmount || 0
        }
      } else {
        ElMessage.error(res.msg || '请求失败')
      }
    })
    .finally(() => {
      loading.value = false
    })
}
watch(
  () => [props.enterpriseId, props.year],
  (newVal) => {
    const [enterpriseId, year] = newVal
    if (enterpriseId && enterpriseId !== 0) {
      params.enterpriseId = enterpriseId
      dateRange.value = [`${year}-01-01`, `${year}-12-31`]
      params.periodStartDate = `${year}-01-01`
      params.periodEndDate = `${year}-12-31`
      getTableList()
    }
  },
  {
    immediate: true
  }
)
const handleSizeChange = (val: number) => {
  pageVO.pageSize = val
  pageVO.pageIndex = 1
  getTableList()
}
const handleCurrentChange = (val: number) => {
  pageVO.pageIndex = val
  getTableList()
}
const onSubmit = () => {
  pageVO.pageIndex = 1
  getTableList()
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
  getSettledAmountDetails(params)
    .then((res) => {
      if (res.code === '0000') {
        amountTable.value = res.data || []
        amountMap.set(periodId, amountTable.value)
      }
    })
    .finally(() => {
      tLoading.value = false
    })
}

const router = useRouter()
const goLink = (row: any) => {
  billStore.setInvoiceHistory({
    periodId: row.periodId,
    enterpriseId: row.enterpriseId,
    year: row.year,
    month: row.month
  })
  router.push('/invoice-history-detail')
}
const handleLink = (row: any) => {
  // 跳转到账单总览的账单详情
  mittBus.emit('willToBillDetail', {
    periodId: row.periodId,
    enterpriseId: row.enterpriseId,
    year: row.year,
    month: row.month
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
  padding: 24px 0;
  background: var(--bg-white);
  min-height: 650px;
}
</style>
