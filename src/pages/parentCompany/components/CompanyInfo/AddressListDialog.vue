<template>
  <el-dialog v-model="dialogVisible" title="选择邮寄地址" width="960" @closed="handleClose">
    <div>
      <el-form :inline="true">
        <el-form-item label="地址">
          <el-input
            v-model="address"
            placeholder="请输入地址名称"
            clearable
            style="width: 140px"
            @change="inputChange"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button plain :icon="Plus" @click="openDialog">新增邮寄地址</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe border max-height="285">
        <el-table-column label="选择" width="60" align="center" class-name="single-radio">
          <template #default="scope">
            <el-radio
              :label="scope.row.id.toString()"
              v-model="tableRadio"
              @change="() => selectRadio(scope.row)">
              <i></i>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="收件省市区" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.provinceName + row.cityName + row.regionName || '' }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="收件详细地址" show-overflow-tooltip />
        <el-table-column prop="receiver" label="收件人" width="100"></el-table-column>
        <el-table-column prop="receiverPhone" label="收件人联系电话" width="130"></el-table-column>
        <el-table-column prop="receiverEmail" label="邮箱" width="160" />
        <el-table-column label="操作" align="center" width="80">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <!-- <el-button type="primary" link @click="handleDelete(scope.row)">删除</el-button> -->
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
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <AddressFormDialog
    v-if="showDialog"
    :rowId="rowId"
    @close="showDialog = false"
    @on-confirm="afterDialogConfirm" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMailingAddressList } from '@/api/address'

const props = defineProps<{
  activeId?: string | undefined
}>()
const emits = defineEmits(['close', 'onConfirm'])

const dialogVisible = ref(false)
onMounted(() => {
  dialogVisible.value = true
})
const handleClose = () => {
  emits('close')
}

const showDialog = ref(false)
const rowId = ref('')
const openDialog = () => {
  rowId.value = ''
  showDialog.value = true
}
const afterDialogConfirm = () => {
  showDialog.value = false
  getTableData()
}
// 编辑
const handleEdit = (row: any) => {
  rowId.value = row.id
  showDialog.value = true
}

onMounted(() => {
  getTableData()
})
const tableData = ref<any[]>([])
const pageVO = reactive({
  currentIndex: 1,
  pageSize: 10
})
const total = ref(0)
const loading = ref(false)
const address = ref('')
// 获取列表数据
const getTableData = async () => {
  const params = {
    mailAddress: address.value,
    ...pageVO
  }
  loading.value = true
  const { code, msg, data } = await getMailingAddressList(params)
  if (code == '0000') {
    tableData.value = data?.list || []
    total.value = data?.total || 0
  } else {
    ElMessage.error(msg)
  }
  loading.value = false
}

// 页码
const handleCurrentChange = (val: number) => {
  pageVO.currentIndex = val
  getTableData()
}
const handleSizeChange = (val: number) => {
  pageVO.currentIndex = 1
  pageVO.pageSize = val
  getTableData()
}
const inputChange = (val: string) => {
  address.value = val
  getTableData()
}
// 删除
const handleDelete = async (row) => {
  try {
    let params = {
      mailAddressIds: [row.id]
    }
    const res = await request({
      apiModule: invoiceApi.batchDeleteMailAddress,
      data: params
    })
    if (res.code == '0000') {
      ElMessage.success('删除成功')
      getTableData()
    } else {
      await ElMessageBox.alert(`${res.message}`, '提示', {
        confirmButtonText: '知道了',
        type: 'warning',
        center: true
      })
    }
  } catch (err) {}
}

// 表格单选
const tableRadio: Ref<string | number> = ref('')
if (props.activeId) {
  tableRadio.value = props.activeId
}
const onConfirm = () => {
  if (!tableRadio.value && !selectedRow.value) {
    ElMessage.error('请选择邮寄地址')
    return
  }
  emits('onConfirm', selectedRow.value)
}

const selectedRow = ref(null)
const selectRadio = (row: any) => {
  selectedRow.value = row
}
</script>

<style scoped lang="less">
.link-btn {
  color: var(--brand-blue);
  cursor: pointer;
}
</style>
