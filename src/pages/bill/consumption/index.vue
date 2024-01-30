<template>
  <div class="inner-section">
    <el-form :inline="true" :model="formInline">
      <el-form-item label="交易日期">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="false"
          style="width: 250px"
          @change="dateRangeChange" />
      </el-form-item>
      <el-form-item label="产品类型">
        <el-select
          v-model="formInline.productTypes"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择"
          style="width: 240px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门">
        <el-select
          v-model="formInline.deptNames"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择"
          style="width: 240px"
          @click="commonVisible = true"
          @change="deptChange">
          <el-option
            v-for="item in selectedList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="出行人">
        <el-input v-model="formInline.travelingPerson" placeholder="请输入出行人"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="btn btn-primary w-100" @click="onSubmit">查询</div>
        <!-- <div class="btn btn-primary plain w-100" type="primary" plain @click="handleExport">
          导出账单
        </div> -->
      </el-form-item>
    </el-form>

    <el-table class="mt-6" :data="tableData" stripe border max-height="1000" v-loading="loading">
      <el-table-column prop="orderSerialNo" label="订单编号" show-overflow-tooltip width="150">
        <template #default="{ row }">
          <span>{{ row.orderSerialNo }}</span>
          <div>{{ PRODUCT_TYPE.get(row.productType) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="memberName" label="预定人" width="215">
        <template #default="{ row }">
          <div>{{ row.memberName }}</div>
          <div>{{ row.departmentName }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="orderStatusType" label="订单类型" width="148">
        <template #default="{ row }">
          {{ ORDER_STATUS_TYPE.get(row.orderStatusType) }}
        </template>
      </el-table-column>
      <el-table-column prop="travelingPerson" label="出行人/收货人" width="138" />
      <el-table-column label="开票单位" width="138">
        <template #default="{ row }">
          {{ row.invoiceTitle }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="status" label="成本中心" width="138">
        <template #default="{ row }">
          <div class="flex">
            <el-dropdown trigger="click">
              <span class="flex ai-c">
                苏州科技公司
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>广州技术公司</el-dropdown-item>
                  <el-dropdown-item>武汉美丽公司</el-dropdown-item>
                  <el-dropdown-item>杭州电子公司</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="lastDay" label="项目中心" width="138">
        <template #default="{ row }">
          <div class="flex">
            <el-dropdown trigger="click">
              <span class="flex ai-c">
                苏州科技公司
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>广州技术公司</el-dropdown-item>
                  <el-dropdown-item>武汉美丽公司</el-dropdown-item>
                  <el-dropdown-item>杭州电子公司</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column prop="trip" label="行程/商家" width="190">
        <template #default="{ row }">
          <div>{{ handleTime(row.departureDate, row.arrivalDate) }}</div>
          <div>{{ row.productInfo }}</div>
          <div>{{ row.productName }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价(元)"></el-table-column>
      <el-table-column prop="serverPrice" label="服务费(元)" />
      <el-table-column prop="refundPrice" label="退改费(元)" />
      <el-table-column prop="serverPrice" label="应付金额(元)" width="110">
        <template #default="{ row }">
          {{ handlePrice(row) }}
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="支付方式" width="138">
        <template #default="{ row }">
          {{ PAY_TYPE.get(row.payType) || '-' }}
        </template>
      </el-table-column>
    </el-table>

    <div class="flex jc-sb ai-c mt-16">
      <div class="fs-12 fw-600 c-font-primary">
        <span>合计 ¥{{ totalPrice }}</span>
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
  <!-- 组织架构中选择 -->
  <GroupSelector
    v-if="commonVisible"
    v-model:visible="commonVisible"
    :popSelectType="4"
    @on-ok="handleSelectConfirm" />
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { TableItem } from '../types'
import { getConsumptionData } from '@/api/bill'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { PRODUCT_TYPE, ORDER_STATUS_TYPE, PAY_TYPE } from '@/common/static'

const props = defineProps<{
  year: number
  enterpriseId: number
}>()

const commonVisible = ref(false)
const selectedList = ref<any[]>([])
const handleSelectConfirm = (data: any) => {
  if (data && data.list) {
    formInline.deptNames = data.list.map((item: any) => item.Name)
    selectedList.value = data.list
  }
}
const deptChange = (val: number[]) => {
  selectedList.value = selectedList.value.filter((item) => val.includes(item.Id))
}

const onSubmit = () => {
  pageVO.pageIndex = 1
  getTableData()
}

const loading = ref(false)
const pageVO = reactive({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
const currentYear = new Date().getFullYear()
const dateRange = ref<any>([`${currentYear}-01-01`, `${currentYear}-12-31`])
const formInline = reactive({
  periodStartDate: `${currentYear}-01-01`,
  periodEndDate: `${currentYear}-12-31`,
  productTypes: [],
  deptNames: [],
  travelingPerson: '',
  enterpriseId: 0
})

const totalPrice = ref(0)
const tableData = ref<any[]>([])
function getTableData() {
  loading.value = true
  getConsumptionData({
    ...formInline,
    ...pageVO
  })
    .then((res) => {
      if (res.code === '0000') {
        if (res.data?.results) {
          const newTableList: any[] = []
          res.data.results.forEach((item: any) => {
            item.billPrices.forEach((item2: any) => {
              newTableList.push({ ...item, ...item2 })
            })
          })
          tableData.value = newTableList
          total.value = res.data.total
          totalPrice.value = res.data.sumTotalPrice
        }
      } else {
        ElMessage.error(res.msg)
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
    if (enterpriseId) {
      formInline.enterpriseId = enterpriseId
      dateRange.value = [`${year}-01-01`, `${year}-12-31`]
      formInline.periodStartDate = `${year}-01-01`
      formInline.periodEndDate = `${year}-12-31`
      getTableData()
    }
  },
  {
    immediate: true
  }
)
const dateRangeChange = (date: any) => {
  if (date && date.length === 2) {
    formInline.periodStartDate = dayjs(date[0]).format('YYYY-MM-DD')
    formInline.periodEndDate = dayjs(date[1]).format('YYYY-MM-DD')
  } else {
    formInline.periodStartDate = ''
    formInline.periodEndDate = ''
  }
}

const handleExport = (row: TableItem) => {
  console.log(row)
}

const handleSizeChange = (val: number) => {
  pageVO.pageSize = val
  pageVO.pageIndex = 1
  getTableData()
}
const handleCurrentChange = (val: number) => {
  pageVO.pageIndex = val
  getTableData()
}

const options = ref<any[]>([])
const types = [1, 5, 6, 7, 10]
types.forEach((item) => {
  const value = PRODUCT_TYPE.get(item)
  if (value) {
    options.value.push({ label: value.replace('国内', ''), value: item })
  }
})

// 计算单价
const handlePrice = computed(() => {
  return (row: any) => {
    if (row.productType === 5) {
      return row.price + row.fuelTax + row.airportTax + row.tax + row.insurancePrice
    } else if (row.productType == 6) {
      return row.price + row.grabTicketPrice + row.speedTicketPrice
    } else {
      return row.price
    }
  }
})

// 处理时间
const handleTime = (startTime: string, endTime: string) => {
  if (!startTime && !endTime) {
    return '--'
  }
  const start = dayjs(startTime)
  const end = dayjs(endTime)
  const startYear = start.format('YYYY')
  const endYear = end.format('YYYY')
  const startMonthDay = start.format('MM-DD')
  const endMonthDay = end.format('MM-DD')
  const startHour = start.format('HH:mm')
  const endHour = end.format('HH:mm')
  if (startYear !== endYear) {
    return `${startYear}-${startMonthDay} ${startHour}至${endYear}-${endMonthDay} ${endHour}`
  } else if (startMonthDay !== endMonthDay) {
    return `${startMonthDay} ${startHour}至${endMonthDay} ${endHour}`
  } else {
    return `${startMonthDay} ${startHour}至${endHour}`
  }
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
  min-height: 600px;
}
</style>
