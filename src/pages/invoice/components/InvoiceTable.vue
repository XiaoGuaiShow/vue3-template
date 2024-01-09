<template>
  <div class="mt-24 flex jc-sb ai-c">
    <el-select v-model="company" placeholder="请选择">
      <el-option label="苏州科技" value="suzhou" />
      <el-option label="天津科技" value="tianjin" />
    </el-select>
    <div class="link">批量下载</div>
  </div>

  <el-table class="mt-12" :data="tableData" stripe border max-height="250">
    <el-table-column prop="number" label="开票编号" width="80" />
    <el-table-column prop="zhuti" label="销售主体" show-overflow-tooltip>
      <template #default="{ row }">
        <div>{{ row.zhuti || '--' }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="开票单位" show-overflow-tooltip>
      <template #default="{ row }">
        {{ row.name || '--' }}
      </template>
    </el-table-column>
    <el-table-column prop="line" label="业务线" align="center" />
    <el-table-column prop="type" label="开票类型" align="center" show-overflow-tooltip />
    <el-table-column prop="category" label="开票类目" align="center" />
    <el-table-column prop="money" label="开票金额" align="center" />
    <el-table-column prop="remark" label="备注" align="center">
      <template #default="{ row }">
        <div>{{ row.remark || '--' }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="statusDesc" label="状态" align="center">
      <template #default="{ row }">
        <div class="color-success">{{ row.statusDesc }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="email" label="邮寄信息" align="center" show-overflow-tooltip />
    <el-table-column prop="sf" label="快递单号" align="center">
      <template #default="{ row }">
        <div>{{ row.sf || '--' }}</div>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="74">
      <template #default>
        <div class="link">下载</div>
      </template>
    </el-table-column>
  </el-table>

  <div class="flex jc-sb ai-c mt-16">
    <div class="left-text">
      <span class="mr-16">合计 ¥6,000.00</span>
    </div>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      small
      :page-sizes="[5, 10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const company = ref('suzhou')
const tableData = [
  {
    id: '1',
    number: '001',
    name: '苏州思客信息技术有限公司',
    zhuti: '苏州科技公司',
    line: '酒店',
    type: '电子发票(专票)',
    category: '代订费',
    money: '1000.00',
    remark: '',
    statusDesc: '开票成功',
    email: 'admin@tripwise.cn',
    sf: ''
  },
  {
    id: '2',
    number: '001',
    name: '',
    zhuti: '',
    line: '酒店',
    type: '纸质发票(票根)',
    category: '代订费',
    money: '1000.00',
    remark: '',
    statusDesc: '已邮寄',
    email: '江苏省苏州市工业园区现代大道888号',
    sf: 'SF123456'
  }
]
const currentPage = ref(1)
const pageSize = ref(10)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>

<style scoped lang="less">
.link {
  font-size: 14px;
  color: var(--font-link);
  cursor: pointer;
}
.color-success {
  color: var(--tip-success);
}
.left-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--font-primary);
}
</style>
