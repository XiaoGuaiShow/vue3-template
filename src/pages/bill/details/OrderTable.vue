<template>
  <div class="mt-24">
    <el-form :inline="true" :model="formInline">
      <el-form-item label="异议状态" v-if="dataType === 3">
        <el-select v-model="formInline.deptId" placeholder="请选择" clearable>
          <el-option label="全部" :value="-1" />
          <el-option label="产品部门" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门">
        <el-select v-model="formInline.deptId" placeholder="请选择" clearable>
          <el-option label="测试部" :value="1" />
          <el-option label="产品部门" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品类型">
        <el-select v-model="formInline.productType" placeholder="请选择">
          <el-option label="全部" :value="-1" />
          <el-option
            v-for="item in productTypeOptions"
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
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="flex ai-c mb-18" v-if="dataType !== 3 && dataType !== 4">
      <el-checkbox v-model="checkedAll" label="全选（跨分页）" size="large" />
      <el-button type="primary" @click="openAdjustDialog('开票单位')">批量调整开票单位</el-button>
      <el-button type="primary" @click="openAdjustDialog('成本中心')">批量调整成本中心</el-button>
      <el-button type="primary" @click="openAdjustDialog('项目中心')">批量调整项目中心</el-button>
    </div>

    <el-table
      class="mt-6"
      :data="tableData"
      :span-method="objectSpanMethod"
      stripe
      border
      max-height="680">
      <el-table-column
        type="selection"
        width="55"
        align="center"
        v-if="dataType !== 3 && dataType !== 4" />
      <!-- 只在本期异议里展示 -->
      <template v-if="dataType === 3">
        <el-table-column prop="adjustType" label="调整类型" align="center"></el-table-column>
        <el-table-column prop="statusDesc" label="状态" align="center">
          <template #default="{ row }">
            <el-tag :type="statusDescComputed(row.statusDesc)">{{ row.statusDesc }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="反馈信息" align="center">
          <template #default="{ row }">
            <el-button type="primary" link v-if="row.url">查看</el-button>
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
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="memberName" label="预定人" width="215">
        <template #default="{ row }">
          <div>{{ row.memberName }}</div>
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
      <el-table-column prop="status" label="成本中心" width="138">
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
      </el-table-column>
      <el-table-column prop="trip" label="行程/商家">
        <template #default="{ row }">
          <div>{{ handleTime(row.departureDate, row.arrivalDate) }}</div>
          <div>{{ row.productInfo }}</div>
          <div>{{ row.productName }}</div>
        </template>
      </el-table-column>
      <template v-if="dataType !== 3">
        <el-table-column prop="price" label="单价(元)" width="138"></el-table-column>
        <el-table-column prop="serverPrice" label="服务费(元)" width="138" />
      </template>
    </el-table>

    <div class="flex jc-sb ai-c mt-16">
      <div class="fs-12 fw-600 c-font-primary">
        <span>合计 ¥9000.00</span>
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
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, computed } from 'vue'
import AdjustDialog from '../components/AdjustDialog.vue'
import { getBillPeriodSummaryDetail } from '@/api/bill'
import { PRODUCT_TYPE, ORDER_STATUS_TYPE } from '@/common/static'
import dayjs from 'dayjs'

const props = defineProps<{
  dataType: number
  enterpriseId: number
  periodId: number
}>()
const { dataType, enterpriseId, periodId } = toRefs(props)
const formInline = reactive({
  deptId: undefined,
  productType: -1,
  travelingPerson: '',
  orderSerialNo: undefined,
  dissentStatus: undefined
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
const orderMap = ref(new Map())
// 查询表格
function getTableData() {
  loading.value = true
  const params = {
    ...formInline,
    ...pageVO,
    ...staticParams
  }
  if (params.productType === -1) {
    Reflect.deleteProperty(params, 'productType')
  }
  setTimeout(() => {
    const resp = {
      code: '0000',
      data: {
        total: 15,
        results: [
          {
            orderSerialNo: 'DJI10210210231221',
            memberName: '张三',
            departmentName: '产品发展部',
            departureDate: '2021-02-10 13:30:00',
            arrivalDate: '2021-02-10 13:35:00',
            productInfo: '天津→上海',
            productName: 'CA2917',
            productType: 1,
            p1: '',
            p2: '',
            p3: '',
            billPrices: [
              {
                orderStatusType: 0,
                travelingPerson: '李四',
                price: 100,
                fuelTax: 10,
                airportTax: 20,
                tax: 7,
                insurancePrice: 30,
                grabTicketPrice: 5,
                speedTicketPrice: 10,
                serverPrice: 88
              },
              {
                orderStatusType: 1,
                travelingPerson: '王家明',
                price: 200,
                fuelTax: 10,
                airportTax: 20,
                tax: 7,
                insurancePrice: 30,
                grabTicketPrice: 5,
                speedTicketPrice: 10,
                serverPrice: 88
              },
              {
                orderStatusType: 2,
                travelingPerson: '王五',
                price: 300,
                fuelTax: 10,
                airportTax: 20,
                tax: 7,
                insurancePrice: 30,
                grabTicketPrice: 5,
                speedTicketPrice: 10,
                serverPrice: 88
              }
            ]
          }
        ]
      }
    }
    const newTableList: any[] = []
    resp.data.results.forEach((item) => {
      item.billPrices.forEach((item2) => {
        newTableList.push({ ...item, ...item2 })
      })
    })
    console.log(newTableList)
    tableData.value = newTableList
    loading.value = false
    orderMap.value = calculate()
  }, 1000)
  getBillPeriodSummaryDetail(params).then((res) => {
    console.log(res)
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
const productTypeOptions = ref(generateProductTypeOptions())
function generateProductTypeOptions() {
  const arr = [1, 5, 6, 7, 10]
  return arr.map((item) => {
    const value = PRODUCT_TYPE.get(item)
    return { label: value, value: item }
  })
}

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

const statusDescComputed = computed(() => {
  return (statusDesc) => {
    if (statusDesc === '待处理') {
      return 'danger'
    } else if (statusDesc === '已处理') {
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
