<template>
  <div class="container">
    <div class="section">
      <div class="title">发票历史</div>
      <el-form :inline="true" :model="params" class="mt-24">
        <el-form-item>
          <el-select v-model="params.enterpriseId" placeholder="请选择" clearable>
            <el-option-group
              v-for="group in enterpriseOptions"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="结算周期">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :value-format="'YYYY-MM-DD'"
            @change="dateChange" />
        </el-form-item>
        <el-form-item label="开票状态">
          <el-select v-model="params.invoiceStatus" placeholder="请选择">
            <el-option label="全部" :value="-1" />
            <el-option label="已开票" :value="1" />
            <el-option label="未开票" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="结算单名称">
          <el-input v-model="params.periodName" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <div class="btn-primary w-100" @click="onSubmit">查询</div>
        </el-form-item>
      </el-form>

      <el-table class="mt-6" :data="tableData" stripe border max-height="280" v-loading="loading">
        <el-table-column prop="periodName" label="结算单名称" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="link" @click="goBill(row)">
              {{ row.periodName + row.periodCycle + '结算单' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="periodCycle" label="结算周期" width="215" align="center" />
        <el-table-column prop="invoiceAmount" label="已开票" width="148" align="center" />
        <el-table-column prop="unInvoiceAmount" label="未开票" width="138" align="center" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <div class="link" @click="goLink(scope.row)">查看明细</div>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex jc-sb ai-c mt-16">
        <div class="left-text">
          <span class="mr-16">已开票 ¥{{ sumInvoiceAmount }}</span>
          <span>未开票 ¥{{ sumUnInvoiceAmount }}</span>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { TableItem } from '@/pages/bill/types'
import { useYearAndCompany } from '@/pages/bill/hooks/overview'
import { getInvoiceHistoryList } from '@/api/invoice'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { useBillStore } from '@/store/modules/bill'

const { enterpriseId, enterpriseOptions } = await useYearAndCompany(false)
const loading = ref(false)
const total = ref(0)
const pageVO = {
  pageIndex: 1,
  pageSize: 10
}
const dateRange = ref<any>('')
const nowDate = dayjs(new Date()).format('YYYY-MM-DD')
const lastThreeMonth = dayjs(nowDate).subtract(3, 'month').format('YYYY-MM-DD')
dateRange.value = [lastThreeMonth, nowDate]
const params: any = reactive({
  enterpriseId: enterpriseId.value || 0,
  invoiceStatus: -1,
  periodStartDate: lastThreeMonth, // 开始日期
  periodEndDate: nowDate, // 结束日期
  year: '',
  periodName: ''
})
const router = useRouter()
// 获取路由参数信息，给搜索条件-开票状态赋值
const routeInfo = useRoute()
if (routeInfo?.query?.status) {
  params.invoiceStatus = Number(routeInfo.query.status as string)
} else {
  params.invoiceStatus = -1
}
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
const tableData = ref<TableItem[]>([])
const sumInvoiceAmount = ref(0) // 已开票金额
const sumUnInvoiceAmount = ref(0) // 未开票金额
function getTableList() {
  loading.value = true
  const newParams = {
    ...params,
    ...pageVO
  }
  if (newParams.invoiceStatus === -1) {
    Reflect.deleteProperty(newParams, 'invoiceStatus')
  }
  getInvoiceHistoryList(newParams)
    .then((res) => {
      if (res.code === '0000') {
        if (res.data) {
          tableData.value = res.data.results || []
          total.value = res.data.total
          sumInvoiceAmount.value = res.data.sumInvoiceAmount || 0
          sumUnInvoiceAmount.value = res.data.sumUnInvoiceAmount || 0
        }
      } else {
        ElMessage.error(res.msg || '请求失败')
      }
    })
    .finally(() => {
      loading.value = false
    })
}
getTableList()
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

const billStore = useBillStore()
const goLink = (row: TableItem) => {
  billStore.setInvoiceHistory(row.periodId, row.enterpriseId)
  router.push('invoice-history-detail')
}
const goBill = (row: TableItem) => {
  billStore.setOverviewDatas(row)
  router.push('bill')
}
</script>

<style lang="less" scoped>
.container {
  padding: 0 12px 12px;
  background-color: rgb(242, 243, 245);
}
.section {
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  min-height: 600px;
}
.title {
  font-size: 16px;
  font-weight: 500;
  color: var(--font-primary);
}
:deep(.el-form-item__label) {
  color: var(--font-primary);
}
:deep(.el-table thead tr th) {
  background-color: var(--bg_tbhead);
}
:deep(.el-table thead) {
  color: var(--font-primary);
  font-size: 13px;
  font-weight: 600;
}
.el-table {
  font-size: 13px;
}
.link {
  color: var(--brand-blue);
  cursor: pointer;
  font-size: 13px;
}
.left-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--font-primary);
}
</style>
