<template>
  <div class="container">
    <div class="section">
      <div class="title">发票历史</div>
      <el-form :inline="true" :model="formInline" class="mt-24">
        <el-form-item label="结算周期">
          <el-select v-model="formInline.region" placeholder="请选择" clearable>
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="开票状态">
          <el-select v-model="formInline.region" placeholder="请选择" clearable>
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="结算单名称">
          <el-input v-model="formInline.date" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table class="mt-6" :data="tableData" stripe border max-height="280">
        <el-table-column prop="name" label="结算单名称" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="link">{{ row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="range" label="结算周期" width="215" align="center" />
        <el-table-column prop="invoiced" label="已开票" width="148" align="center" />
        <el-table-column prop="uninvoiced" label="未开票" width="138" align="center" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <div class="link" @click="goLink(scope.row)">查看明细</div>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex jc-sb ai-c mt-16">
        <div class="left-text">
          <span class="mr-16">已开票 ¥100000.00</span>
          <span>未开票 ¥9000.00</span>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { TableItem } from './types'
const router = useRouter()
const currentPage4 = ref(4)
const pageSize4 = ref(10)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const tableData = [
  {
    id: '1',
    name: '苏州思客信息技术有限公司2023-12-01至2023-12-31结算单',
    range: '2023/12/01至2023/12/31',
    invoiced: '1,000.00',
    uninvoiced: '1,000.00'
  },
  {
    id: '2',
    name: '苏州思客信息技术有限公司2023-12-01至2023-12-31结算单',
    range: '2023/12/01至2023/12/31',
    invoiced: '1,000.00',
    uninvoiced: '1,000.00'
  },
  {
    id: '3',
    name: '苏州思客信息技术有限公司2023-12-01至2023-12-31结算单',
    range: '2023/12/01至2023/12/31',
    invoiced: '1,000.00',
    uninvoiced: '1,000.00'
  },
  {
    id: '4',
    name: '苏州思客信息技术有限公司2023-12-01至2023-12-31结算单',
    range: '2023/12/01至2023/12/31',
    invoiced: '1,000.00',
    uninvoiced: '1,000.00'
  },
  {
    id: '5',
    name: '苏州思客信息技术有限公司2023-12-01至2023-12-31结算单',
    range: '2023/12/01至2023/12/31',
    invoiced: '1,000.00',
    uninvoiced: '1,000.00'
  },
  {
    id: '6',
    name: '苏州思客信息技术有限公司2023-12-01至2023-12-31结算单',
    range: '2023/12/01至2023/12/31',
    invoiced: '1,000.00',
    uninvoiced: '1,000.00'
  },
  {
    id: '7',
    name: '苏州思客信息技术有限公司2023-12-01至2023-12-31结算单',
    range: '2023/12/01至2023/12/31',
    invoiced: '1,000.00',
    uninvoiced: '1,000.00'
  }
]

const formInline = reactive({
  user: '',
  region: '',
  date: ''
})

const onSubmit = () => {
  console.log('submit!')
}

const goLink = (row: TableItem) => {
  console.log(row)
  router.push(`/invoice/history/${row.id}`)
}
</script>

<style>
.container {
  padding: 12px;
  background-color: rgb(242, 243, 245);
}
.section {
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
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
