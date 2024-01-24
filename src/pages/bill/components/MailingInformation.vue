<template>
  <el-dialog v-model="dialogVisible" title="编辑邮寄信息" width="800" @closed="handleClose">
    <el-form :model="form" ref="ruleFormRef" :rules="rules" label-width="130px">
      <el-form-item label="邮寄地址" prop="mailAddress">
        <el-input
          v-model.trim="form.mailAddress"
          placeholder="请输入邮寄地址"
          clearable
          class="w-all" />
      </el-form-item>
      <el-form-item label="收件人" prop="mailUserName">
        <el-input
          v-model.trim="form.mailUserName"
          placeholder="请输入收件人姓名"
          clearable
          class="w-all" />
      </el-form-item>
      <el-form-item label="收件人联系电话" prop="mailUserPhone">
        <el-input
          v-model.trim="form.mailUserPhone"
          placeholder="请输入联系电话"
          clearable
          class="w-all" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="btnLoading">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { modifyInvoiceItem } from '@/api/invoice'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  enterpriseId: number | string
  invoiceId: number | string
  rowData: any
}>()

onMounted(() => {
  if (props.rowData) {
    form.mailAddress = props.rowData.mailAddress
    form.mailUserName = props.rowData.mailUserName
    form.mailUserPhone = props.rowData.mailUserPhone
  }
})

const ruleFormRef = ref()
const form = reactive({
  mailAddress: '',
  mailUserName: '',
  mailUserPhone: ''
})
const rules = reactive({
  mailAddress: [{ required: true, message: '请输入邮寄地址', trigger: 'blur' }],
  mailUserName: [{ required: true, message: '请输入邮寄收件人姓名', trigger: 'blur' }],
  mailUserPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
})

const emits = defineEmits(['close', 'confirm'])

const dialogVisible = ref(false)
onMounted(() => {
  dialogVisible.value = true
})
const handleClose = () => {
  console.log('动画结束后执行')
  emits('close')
}

const btnLoading = ref(false)
const handleConfirm = () => {
  btnLoading.value = true
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate((valid: any) => {
    if (valid) {
      modifyInvoiceItem({
        ...form,
        enterpriseId: props.enterpriseId,
        id: props.invoiceId
      })
        .then((res) => {
          if (res.code === '0000') {
            ElMessage.success('修改成功')
            emits('confirm')
            emits('close')
          }
        })
        .finally(() => {
          btnLoading.value = false
        })
    }
  })
}
</script>
<style scoped lang="less">
.section {
  padding: 24px;
  border: 1px solid var(--line-rest);
  border-radius: 6px;
}
.left-input + .left-input {
  margin-top: 8px;
}
</style>
