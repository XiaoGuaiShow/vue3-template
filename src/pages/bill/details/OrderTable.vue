<template>
  <div class="mt-24">
    <el-form :inline="true" :model="formInline">
      <el-form-item label="异议状态" v-if="dataType === 3">
        <el-select v-model="formInline.dissentStatus" placeholder="请选择">
          <el-option label="全部" :value="-1" />
          <el-option label="待处理" :value="0" />
          <el-option label="已处理" :value="1" />
          <el-option label="自动处理" :value="9" />
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
      <el-form-item label="出行人">
        <el-input
          v-model="formInline.travelingPerson"
          placeholder="请输入名称"
          clearable></el-input>
      </el-form-item>
      <el-form-item>
        <div class="btn-primary w-100" @click="handleSearch">查询</div>
      </el-form-item>
    </el-form>
    <!-- <div class="flex ai-c mb-18" v-if="dataType !== 3 && dataType !== 4">
      <el-checkbox v-model="checkedAll" label="全选（跨分页）" size="large" />
      <div class="btn btn-primary" @click="openAdjustDialog('开票单位')">批量调整开票单位</div>
      <div class="btn btn-primary" @click="openAdjustDialog('成本中心')">批量调整成本中心</div>
      <div class="btn btn-primary" @click="openAdjustDialog('项目中心')">批量调整项目中心</div>
    </div> -->

    <el-table
      class="mt-6"
      :data="tableData"
      :span-method="objectSpanMethod"
      stripe
      border
      max-height="680"
      v-loading="loading">
      <el-table-column
        type="selection"
        width="55"
        align="center"
        v-if="dataType !== 3 && dataType !== 4" />
      <!-- 只在本期异议里展示 -->
      <template v-if="dataType === 3">
        <el-table-column prop="dissentStatus" label="状态" align="center">
          <template #default="{ row }">
            <el-tag :type="statusDescComputed(row.dissentStatus)">
              {{ DISSENT_STATUS.get(row.dissentStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="反馈信息" align="center">
          <template #default="{ row }">
            <span class="link" v-if="row.url">查看</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="账期调整" align="center">
          <template #default="{ row }">
            <el-popover placement="top" :width="400" v-if="row.url">
              <template #reference>
                <svg-icon name="tip" size="14" color="#bfbfbf"></svg-icon>
              </template>
              <div class="flex ai-c">
                <el-icon class="mr-6" color="#fab938"><WarningFilled /></el-icon>
                本期未处理完的异议，在确认账单后自动结转至下期结算
              </div>
            </el-popover>
            <span v-else>下期结算</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        prop="orderSerialNo"
        label="订单编号"
        show-overflow-tooltip
        width="150"></el-table-column>
      <el-table-column prop="memberName" label="预订人" width="215">
        <template #default="{ row }">
          <span>{{ row.memberName }}</span>
          <div>{{ row.departmentName }}</div>
        </template>
      </el-table-column>
      <!-- 在异议里不展示 -->
      <template v-if="dataType !== 3">
        <el-table-column prop="orderStatusType" label="订单类型" width="148">
          <template #default="{ row }">
            {{ ORDER_STATUS_TYPE.get(row.orderStatusType) }}
          </template>
        </el-table-column>
        <el-table-column prop="travelingPerson" label="出行人/收货人" width="138" />
      </template>
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
      <template v-if="dataType !== 3">
        <el-table-column prop="price" label="单价(元)" width="138">
          <template #default="{ row }">
            {{ handlePrice(row) }}
          </template>
        </el-table-column>
        <el-table-column prop="serverPrice" label="服务费(元)" width="138" />
      </template>
    </el-table>

    <div class="flex jc-sb ai-c mt-16">
      <div class="fs-12 fw-600 c-font-primary">
        <span>合计 ¥{{ sumTotalPrice }}</span>
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
  <AdjustDialog
    v-if="showAdjustDialog"
    :dialogTitle="dialogTitle"
    @close="showAdjustDialog = false"></AdjustDialog>
  <!-- 组织架构中选择 -->
  <GroupSelector
    v-if="commonVisible"
    v-model:visible="commonVisible"
    title="选择部门"
    :popSelectType="4"
    @on-ok="handleSelectConfirm" />
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, computed } from 'vue'
import AdjustDialog from '../components/AdjustDialog.vue'
import { getBillPeriodSummaryDetail } from '@/api/bill'
import { PRODUCT_TYPE, ORDER_STATUS_TYPE, DISSENT_STATUS } from '@/common/static'
import dayjs from 'dayjs'

const props = defineProps<{
  dataType: number
  enterpriseId: number
  periodId: number
}>()
const { dataType, enterpriseId, periodId } = toRefs(props)
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
const formInline = reactive({
  dissentStatus: -1,
  deptNames: [],
  productTypes: [],
  travelingPerson: ''
  // orderSerialNo: undefined
})
const pageVO = reactive({
  pageIndex: 1,
  pageSize: 10
})
const staticParams = reactive({
  dataType,
  enterpriseId,
  periodId
})
const tableData: Ref<any[]> = ref([])
const loading = ref(false)
const total = ref(0)
const sumTotalPrice = ref(0)
const orderMap = ref(new Map())
// 查询表格
function getTableData() {
  loading.value = true
  const params = {
    ...formInline,
    ...pageVO,
    ...staticParams
  }
  if (params.dissentStatus === -1) {
    Reflect.deleteProperty(params, 'dissentStatus')
  }
  getBillPeriodSummaryDetail(params)
    .then((res) => {
      if (res.code === '0000') {
        if (res.data) {
          total.value = res.data.total
          sumTotalPrice.value = res.data.sumTotalPrice
          const newTableList: any[] = []
          const results = res.data.results || []
          results.forEach((item: any) => {
            item.billPrices.forEach((item2: any) => {
              newTableList.push({ ...item, ...item2 })
            })
          })
          tableData.value = newTableList
          orderMap.value = calculate()
        } else {
          tableData.value = []
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}
getTableData()

const handleSearch = () => {
  pageVO.pageIndex = 1
  getTableData()
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

// 产品类型下拉
const options = ref<any[]>([])
const types = [1, 5, 6, 7, 10]
types.forEach((item) => {
  const value = PRODUCT_TYPE.get(item)
  if (value) {
    options.value.push({ label: value.replace('国内', ''), value: item })
  }
})

const checkedAll = ref(false)

const showAdjustDialog = ref(false)
const dialogTitle = ref('')
const openAdjustDialog = (title) => {
  dialogTitle.value = title
  showAdjustDialog.value = true
}

const calculate = () => {
  const map = new Map()
  tableData.value.forEach((item, index) => {
    if (map.has(item.orderSerialNo)) {
      const obj = map.get(item.orderSerialNo)
      map.set(item.orderSerialNo, { count: obj.count + 1, rowIndex: obj.rowIndex })
    } else {
      map.set(item.orderSerialNo, { count: 1, rowIndex: index })
    }
  })
  return map
}

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

const statusDescComputed = computed(() => {
  return (statusDesc: number) => {
    if (statusDesc === 0) {
      return 'danger'
    } else if (statusDesc === 1) {
      return ''
    } else {
      return ''
    }
  }
})
const objectSpanMethod = ({ row, column, rowIndex }: any) => {
  const orderObj = orderMap.value.get(row.orderSerialNo)
  if (orderObj.count > 1) {
    // 有重复的订单
    if (['orderSerialNo', 'memberName', 'trip'].includes(column.property)) {
      if (rowIndex === orderObj.rowIndex) {
        return [orderObj.count, 1]
      } else {
        return [0, 0]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.icon {
  color: red;
}
</style>
