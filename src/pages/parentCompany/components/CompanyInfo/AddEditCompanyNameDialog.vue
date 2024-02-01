<template>
  <el-dialog v-model="dialogVisible" title="编辑子公司信息" width="800" @closed="handleClose">
    <el-form :model="form" ref="ruleFormRef" :rules="rules" label-width="130px">
      <el-form-item label="子公司名称" prop="companyName">
        <el-input
          v-model.trim="form.companyName"
          placeholder="请输入子公司名称"
          clearable
          class="w-all" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <div class="btn-info mr-10" @click="dialogVisible = false">取消</div>
        <div class="btn-primary" @click="handleConfirm" v-loading="btnLoading">保存</div>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { saveEnterpriseAccount } from '@/api/modules/parentCompany'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  rowData: any
}>()

onMounted(() => {
  if (props.rowData) {
    form.companyName = props.rowData.companyName
  }
})

const ruleFormRef = ref()
const form = reactive({
  companyName: ''
})
const rules = reactive({
  companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
})

const emits = defineEmits(['close', 'confirm'])

const dialogVisible = ref(false)
onMounted(() => {
  dialogVisible.value = true
})
const handleClose = () => {
  emits('close')
}

const btnLoading = ref(false)
const handleConfirm = () => {
  btnLoading.value = true
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate((valid: any) => {
    if (valid) {
      saveEnterpriseAccount({
        ...form,
        settleMembers: props.rowData.settlements,
        id: props.rowData.id
      })
        .then((res: any) => {
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
