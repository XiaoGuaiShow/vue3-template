<template>
  <div class="invoice-title">
    <el-dialog
      v-model="props.visible"
      destroy-on-close
      :close-on-click-modal="false"
      :before-close="beforeClose"
      width="1000px"
      title="选择开票单位">
      <div class="search-action">
        <span class="search-title">开票单位</span>
        <el-input
          v-model="params.invoiceTitle"
          placeholder="请输入开票单位名称"
          clearable
          @change="getTableList"></el-input>
        <div class="add-invoice-title" @click="handleAddInvoice">
          <el-icon><Plus /></el-icon>
          <span>新增开票单位</span>
        </div>
      </div>
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        row-key="id"
        stripe
        border
        v-loading="loading"
        max-height="560"
        @select="handleSelectionChange"
        @select-all="handleSelectionAllChange">
        <el-table-column type="selection" width="55" align="center" reserve-selection />
        <el-table-column prop="invoiceTitle" label="开票单位" show-overflow-tooltip />
        <el-table-column prop="invoiceTax" label="发票税号" show-overflow-tooltip />
        <el-table-column prop="companyAddress" label="公司地址" show-overflow-tooltip />
        <el-table-column prop="companyPhone" label="公司电话" show-overflow-tooltip />
        <el-table-column prop="bankName" label="开户银行" show-overflow-tooltip />
        <el-table-column prop="bankNo" label="银行账号" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="120">
          <template #default="{ row }">
            <div class="table-action">
              <span class="link-btn" @click="handleEditInvoice(row)">编辑</span>
              <span class="link-btn ml-12" @click="handleDelete(row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex jc-sb ai-c mt-16">
        <div class="fs-12 fw-600 c-font-primary"></div>
        <el-pagination
          v-model:current-page="pageVO.currentIndex"
          v-model:page-size="pageVO.pageSize"
          small
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <div class="btn-primary" @click="handleConfirm">确 定</div>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- 新增编辑开票单位 -->
  <AddEditInvoiceTitle
    v-if="invoiceEditVisible"
    :visible="invoiceEditVisible"
    :invoiceId="invoiceId"
    @on-close="invoiceEditVisible = false"
    @on-confirm="saveConfirm"></AddEditInvoiceTitle>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import {
  deleteInvoiceUnit,
  getInvoiceList,
  getSelectedCompanyInvoice,
  saveSelectedCompanyInvoice
} from '@/api/invoice'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'
import { useZimuStore } from '@/store/modules/zimu'

const zimuStore = useZimuStore()

const props = defineProps({
  visible: { type: Boolean }
})
const emit = defineEmits(['on-close', 'on-confirm'])
const pageVO = reactive({
  currentIndex: 1,
  pageSize: 10
})
const loading = ref(false)
const tableData = ref<any[]>([])
const params = reactive({
  accountId: zimuStore.currentEnterprise?.id,
  invoiceTitle: ''
})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const total = ref(0)
const selectedIds = ref<string[]>([])
function getTableList() {
  loading.value = true
  getInvoiceList({
    ...pageVO,
    ...params
  }).then((res: any) => {
    if (res.code === '0000') {
      if (res.data) {
        tableData.value = res.data?.list || []
        total.value = res.data.total
        nextTick(() => {
          tableData.value.forEach((row) => {
            if (selectedIds.value.includes(row.id)) {
              multipleTableRef.value!.toggleRowSelection(row, true)
            }
          })
        })
      }
    } else {
      ElMessage.error(res.message)
    }
    loading.value = false
  })
}

getCompanyInvoices().then((resp) => {
  if (resp.code === '0000') {
    selectedIds.value = resp.data || []
    getTableList()
  }
})

// 获取公司已勾选列表
function getCompanyInvoices() {
  return getSelectedCompanyInvoice(zimuStore.currentEnterprise?.id)
}

// 单选
const handleSelectionChange = (selection: any, row: any) => {
  if (selectedIds.value.includes(row.id)) {
    selectedIds.value = selectedIds.value.filter((item) => item !== row.id)
  } else {
    selectedIds.value.push(row.id)
  }
}
// 全选
const handleSelectionAllChange = (selection: any) => {
  if (selection.length) {
    // 全选
    const ids = selection.map((item: any) => item.id)
    selectedIds.value = [...new Set([...selectedIds.value, ...ids])]
  } else {
    // 取消全选
    const tableIds = tableData.value.map((item: any) => item.id)
    selectedIds.value = selectedIds.value.filter((item) => !tableIds.includes(item))
  }
}

// 页码  测试打钩用
const handleCurrentChange = (val: number) => {
  pageVO.currentIndex = val
  getTableList()
}
const handleSizeChange = (val: number) => {
  pageVO.pageSize = val
  pageVO.currentIndex = 1
  getTableList()
}
// 确定
const btnLoading = ref(false)
const handleConfirm = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.error('请选择开票单位')
  }
  btnLoading.value = true
  const params = {
    accountId: zimuStore.currentEnterprise?.id || 0,
    invoiceIds: selectedIds.value
  }
  saveSelectedCompanyInvoice(params)
    .then((res) => {
      if (res.code === '0000') {
        ElMessage.success('操作成功')
        beforeClose()
        emit('on-confirm')
      } else {
        ElMessage.error(res.msg)
      }
    })
    .finally(() => {
      btnLoading.value = false
    })
}

// 关闭
const beforeClose = () => {
  emit('on-close')
}

// 发票新增编辑
const invoiceEditVisible = ref<boolean>(false)
const invoiceId = ref('')
const handleAddInvoice = () => {
  invoiceId.value = ''
  invoiceEditVisible.value = true
}
const handleEditInvoice = (row: any) => {
  invoiceId.value = row.id
  invoiceEditVisible.value = true
}
const saveConfirm = () => {
  getTableList()
}
const handleDelete = (row: any) => {
  ElMessageBox.confirm('是否删除该发票抬头?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    deleteInvoiceUnit(row.id).then((res) => {
      if (res.code === '0000') {
        ElMessage.success('删除成功')
        if (tableData.value.length === 1) {
          pageVO.currentIndex = 1
        }
        getTableList()
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    })
  })
}
</script>

<style lang="less" scoped>
.invoice-title {
  :deep(.el-dialog__header) {
    margin-right: 0;
    background: var(--bg-rest);
  }
  .search-action {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    .search-title {
      font-size: 14px;
      line-height: 14px;
      color: var(--font-primary);
    }
    .el-input {
      width: 160px;
      margin: 0 24px 0 10px;
    }
    .add-invoice-title {
      color: var(--brand-blue);
      display: flex;
      align-items: center;
      border-radius: 2px;
      height: 32px;
      line-height: 14px;
      padding: 0 16px;
      border: 1px solid var(--brand-blue);
      box-sizing: border-box;
      cursor: pointer;
      span {
        margin-left: 6px;
      }
    }
  }
  .table-page {
    margin-top: 16px;
    display: flex;
    flex-direction: row-reverse;
  }
  //表格内容颜色
  :deep(.el-table__body tbody tr:nth-child(odd)) {
    background-color: var(--bg-white);
  }
  :deep(.el-table__body tbody tr:nth-child(even) td) {
    background-color: var(--bg_tbbody);
  }
  :deep(.el-table__header-wrapper) {
    thead {
      th {
        div {
          font-weight: 600;
          font-size: 14px;
          color: var(--font-primary);
        }
      }
    }
  }
}
.link-btn {
  color: var(--brand-blue);
  cursor: pointer;
}
</style>
