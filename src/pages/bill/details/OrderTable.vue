<template>
  <div class="mt-24">
    <el-form :inline="true" :model="formInline">
      <el-form-item label="所属部门">
        <el-select v-model="formInline.dep" placeholder="请选择" clearable>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品类型">
        <el-select v-model="formInline.type" placeholder="请选择" clearable>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="出行人">
        <el-input v-model="formInline.user" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="flex ai-c mb-18" v-if="name !== 'third' && name !== 'fourth'">
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
        v-if="name !== 'third' && name !== 'fourth'" />
      <!-- 只在本期异议里展示 -->
      <template v-if="name === 'third'">
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
      <el-table-column prop="orderNumber" label="订单编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="user" label="预定人" width="215">
        <template #default="{ row }">
          <div>张三</div>
          <div>产品发展部</div>
        </template>
      </el-table-column>
      <!-- 在异议里不展示 -->
      <template v-if="name !== 'third'">
        <el-table-column prop="orderType" label="订单类型" width="148" />
        <el-table-column prop="per" label="出行人/收货人" width="138" />
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
        <template #default="scope">
          <div>06-23 06:54至06.58</div>
          <div>苏州-惠山</div>
          <div>G7098</div>
        </template>
      </el-table-column>
      <template v-if="name !== 'third'">
        <el-table-column prop="price" label="单价(元)" width="138" />
        <el-table-column prop="price2" label="服务费(元)" width="138" />
      </template>
    </el-table>

    <div class="flex jc-sb ai-c mt-16">
      <div class="fs-12 fw-600 c-font-primary">
        <span class="mr-16">应结 ¥100000.00</span>
        <span class="mr-16">已结算 ¥100000.00</span>
        <span>未结算 ¥9000.00</span>
      </div>
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        small
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
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

const props = defineProps<{
  name?: string
}>()

const { name } = toRefs(props)
const formInline = reactive({
  dep: '',
  type: '',
  user: ''
})
const checkedAll = ref(false)
const tableData = ref([
  {
    id: 1,
    statusDesc: '待处理',
    orderNumber: '1027109832193813812',
    user: '张三',
    dep: '产品发展部',
    orderType: '预订单',
    per: '张三',
    adjustType: '订单异议',
    status: '已结算',
    lastDay: '2022-01-01',
    url: '111',
    needInvoiced: '100000.00',
    range: '2023/12/01至2023/12/31',
    price: 200,
    price2: 200
  },
  {
    id: 2,
    statusDesc: '待处理',
    orderNumber: '1027109832193813812',
    user: '张三',
    dep: '产品发展部',
    orderType: '预订单',
    per: '张三',
    uninvoiced: '90',
    url: '111',
    status: '已结算',
    lastDay: '2022-01-01',
    needInvoiced: '100000.00',
    range: '2023/12/01至2023/12/31',
    price: 200,
    price2: 200
  },
  {
    id: 4,
    statusDesc: '已处理',
    orderNumber: '1027109832193813812',
    user: '张三',
    dep: '产品发展部',
    orderType: '预订单',
    per: '张三',
    uninvoiced: '90',
    status: '已结算',
    lastDay: '2022-01-01',
    needInvoiced: '100000.00',
    range: '2023/12/01至2023/12/31',
    price: 200,
    price2: 200
  },
  {
    id: 3,
    orderNumber: '1027109832193813822',
    user: '张三',
    dep: '产品发展部',
    url: '111',
    orderType: '预订单',
    per: '张三',
    uninvoiced: '90',
    status: '已结算',
    lastDay: '2022-01-01',
    needInvoiced: '100000.00',
    range: '2023/12/01至2023/12/31',
    price: 200,
    price2: 200
  },
  {
    id: 3,
    orderNumber: '10271098322193813822',
    user: '张三',
    dep: '产品发展部',
    orderType: '预订单',
    per: '张三',
    uninvoiced: '90',
    status: '已结算',
    lastDay: '2022-01-01',
    needInvoiced: '100000.00',
    range: '2023/12/01至2023/12/31',
    price: 200,
    price2: 200
  },
  {
    id: 3,
    orderNumber: '10271098321933813822',
    user: '张三',
    dep: '产品发展部',
    url: '111',
    orderType: '预订单',
    per: '张三',
    uninvoiced: '90',
    status: '已结算',
    lastDay: '2022-01-01',
    needInvoiced: '100000.00',
    range: '2023/12/01至2023/12/31',
    price: 200,
    price2: 200
  },
  {
    id: 3,
    orderNumber: '10271098321933813822',
    user: '张三',
    dep: '产品发展部',
    orderType: '预订单',
    per: '张三',
    uninvoiced: '90',
    status: '已结算',
    url: '111',
    lastDay: '2022-01-01',
    needInvoiced: '100000.00',
    range: '2023/12/01至2023/12/31',
    price: 200,
    price2: 200
  }
])

const showAdjustDialog = ref(false)
const dialogTitle = ref('')
const openAdjustDialog = (title) => {
  dialogTitle.value = title
  showAdjustDialog.value = true
}

const calculate = () => {
  const map = new Map()
  tableData.value.forEach((item, index) => {
    if (map.has(item.orderNumber)) {
      const obj = map.get(item.orderNumber)
      map.set(item.orderNumber, { count: obj.count + 1, rowIndex: obj.rowIndex })
    } else {
      map.set(item.orderNumber, { count: 1, rowIndex: index })
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

// console.log(calculate())
const orderMap = calculate()

const objectSpanMethod = ({ row, column, rowIndex }) => {
  const orderObj = orderMap.get(row.orderNumber)
  if (orderObj.count > 1) {
    // 有重复的订单
    if (['orderNumber', 'user', 'trip'].includes(column.property)) {
      if (rowIndex === orderObj.rowIndex) {
        return [orderObj.count, 1]
      } else {
        return [0, 0]
      }
    }
  }
}
console.log(22222222222222)

const currentPage4 = ref(4)
const pageSize4 = ref(10)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>

<style lang="less" scoped>
.icon {
  color: red;
}
</style>
