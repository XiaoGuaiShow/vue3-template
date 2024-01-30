<template>
  <div class="export-view">
    <div class="remind-view">
      您导出的文件生成后会暂存在差旅管家上，15天后会自动过期，请您及时下载。
      <el-button type="primary" size="small" @click="getTableData">刷新列表</el-button>
    </div>

    <el-table class="mt-24" :data="tableData" v-loading="loading" stripe border max-height="560">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column prop="fileName" label="文件名" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <span class="fs-13">{{ statusList[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="accountPeriod" label="账期" width="100" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
      <el-table-column label="操作" width="120" align="center">
        <template #default="scope">
          <el-link
            class="fs-13 mr-12"
            :underline="false"
            :disabled="!scope.row.fileUrl"
            type="primary"
            @click="downloadBtnClick(scope.row)">
            下载
          </el-link>
          <el-link
            class="fs-13"
            :underline="false"
            :disabled="scope.row.status !== 1"
            type="primary"
            @click="handleDelete(scope.row)">
            删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex jc-sb ai-c mt-16">
      <div class="fs-12 fw-600 c-font-primary"></div>
      <el-pagination
        v-model:current-page="pageVo.currentIndex"
        v-model:page-size="pageVo.pageSize"
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
import { getExportRecordList, deleteExportRecordItem } from '@/api/bill'
import type { ExportRecordListItem } from '@/pages/bill/types'
import { ElMessage, ElMessageBox } from 'element-plus'

const pageVo = reactive({
  currentIndex: 1,
  pageSize: 10
})
const total = ref(0)
const tableData = ref<ExportRecordListItem[]>()
const loading = ref(false)

const getTableData = () => {
  loading.value = true
  getExportRecordList(pageVo)
    .then((res) => {
      console.log(res)
      if (res.code === '0000') {
        tableData.value = res.data?.list || []
        total.value = res.data?.total || 0
      } else {
        ElMessage.error(res.message)
      }
    })
    .finally(() => {
      loading.value = false
    })
}
getTableData()

const handleSizeChange = (val: number) => {
  pageVo.currentIndex = 1
  pageVo.pageSize = val
  getTableData()
}

const handleCurrentChange = (val: number) => {
  pageVo.currentIndex = val
  getTableData()
}
const downloadBtnClick = (row: ExportRecordListItem) => {
  if (!row.fileUrl) {
    return
  }
  window.open(row.fileUrl)
}
const handleDelete = (row: ExportRecordListItem) => {
  ElMessageBox.confirm(`确认删除选择的规则数据?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (!row.id) {
      return
    }
    deleteData(row.id)
  })
}
const deleteData = (id: string) => {
  deleteExportRecordItem(id).then((res) => {
    if (res.code === '0000') {
      ElMessage.success('删除成功')
      getTableData()
    } else {
      ElMessage.error(res.message)
    }
  })
}

const statusList = ['文件生成中 ', '文件已生成 ', '文件已失效 ', '文件已过期 ']
</script>

<style lang="less" scoped>
.link {
  font-size: 13px;
  color: var(--font-link);
  cursor: pointer;
}
.export-view {
  background-color: #fff;
  min-height: 650px;
}
.remind-view {
  box-sizing: border-box;
  background-color: #f4f4f5;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-radius: 4px;
  color: #909399;
  font-size: 14px;
  margin-top: 24px;
}

.el-table__empty-block {
  background-color: #fff;
}
:deep(.el-link) {
  font-size: 13px !important;
}
</style>
