<template>
  <div class="inner-section">
    <el-form :inline="true" :model="formInline">
      <el-form-item label="交易日期">
        <el-date-picker
          v-model="formInline.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item label="产品类型">
        <el-select
          v-model="formInline.productType"
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
          v-model="formInline.productType"
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
        <el-input v-model="formInline.name" placeholder="请输入出行人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" plain @click="handleExport">导出账单</el-button>
      </el-form-item>
    </el-form>

    <el-table class="mt-6" :data="tableData" stripe border max-height="280">
      <el-table-column prop="name" label="订单编号" show-overflow-tooltip>
        <template #default="{ row }">
          <span class="link">{{ row.number }}</span>
          <div>火车票</div>
        </template>
      </el-table-column>
      <el-table-column prop="range" label="预定人">
        <template #default="{ row }">
          <div>{{ row.booker }}</div>
          <div>产品发展部</div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="订单类型" />
      <el-table-column prop="receiver" label="出行人/收货人" />
      <el-table-column prop="unit" label="开票单位" show-overflow-tooltip />
      <el-table-column prop="unit" label="成本中心" show-overflow-tooltip />
      <el-table-column prop="unit" label="项目中心" show-overflow-tooltip />
      <el-table-column prop="status" label="行程/商家" width="160">
        <template #default="{ row }">
          <div>06-23 06:54至06.58</div>
          <div>苏州-惠山</div>
          <div>G7098</div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价(元)" />
      <el-table-column prop="price" label="服务费(元)" />
      <el-table-column prop="price" label="退改费(元)" />
      <el-table-column prop="price" label="应付金额(元)" />
      <el-table-column prop="way" label="支付方式" />
    </el-table>

    <div class="flex jc-sb ai-c mt-16">
      <div class="fs-12 fw-600 c-font-primary">
        <span>合计 ¥9000.00</span>
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
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { TableItem } from '../types'
const formInline = reactive({
  dateRange: '',
  productType: 0,
  status: '',
  name: ''
})
const onSubmit = () => {
  console.log('submit!')
}
const tableData = ref([
  {
    id: 1,
    number: '2306789099900987',
    booker: '李逍遥',
    type: '退票单',
    receiver: '李青山',
    unit: '苏州A有限公司2023-09-16至2023-09-30结算单',
    invoiced: '100000.00',
    price: '900',
    status: '已结算',
    lastDay: '2022-01-01',
    needInvoiced: '100000.00',
    way: '授信账户'
  },
  {
    id: 2,
    number: '2306789099900987',
    booker: '王大锤',
    type: '退票单',
    receiver: '李青山',
    unit: '苏州A有限公司2023-09-16至2023-09-30结算单',
    invoiced: '100000.00',
    price: '190',
    status: '已结算',
    lastDay: '2022-01-01',
    needInvoiced: '100000.00',
    way: '授信账户'
  }
])
const handleExport = (row: TableItem) => {
  console.log(row)
}

const currentPage4 = ref(4)
const pageSize4 = ref(10)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const options = [
  { label: '1', value: 1 },
  { label: '2', value: 2 }
]
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
}
</style>
