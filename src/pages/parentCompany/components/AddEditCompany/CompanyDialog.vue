<template>
  <div class="company-dialog">
    <el-dialog
      v-model="props.visible"
      destroy-on-close
      :close-on-click-modal="false"
      :before-close="beforeClose"
      width="800px"
      :title="title">
      <el-form :model="form" label-width="90px">
        <el-form-item label="子公司名称">
          <el-input v-model="form.companyName" />
        </el-form-item>
        <el-form-item label="结算员">
          <el-button type="primary" plain @click="handleAddPerson">选择人员</el-button>
        </el-form-item>
        <el-form-item label="" v-if="form.settlementOfficers && form.settlementOfficers.length">
          <div class="tag-list">
            <el-tag
              closable
              type="info"
              color="#F7F8FA"
              v-for="(item, index) in form.settlementOfficers"
              :key="index"
              @close="handleDeletePerson(index)">
              {{ item.name }}
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="beforeClose">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { saveEnterpriseAccount } from '@/api/modules/parentCompany.ts'
import { ref, reactive, watch, toRefs } from 'vue'
import mittBus from '@/utils/mitt.ts'
const props = defineProps({
  visible: { type: Boolean },
  companyInfo: { type: Object, default: {} }
})
const emit = defineEmits(['on-close'])

const title = ref<string>('')
watch(
  () => props.visible,
  (val) => {
    if (val) {
      title.value = props.companyInfo.id ? '编辑子公司' : '新增子公司'
    }
  }
)

const form = reactive<any>({
  companyName: '',
  settlementOfficers: []
})
const { settlementOfficers } = toRefs(form)

// 增加人员
const handleAddPerson = () => {
  const newPerson: { name: string } = { name: '迪丽热巴' }
  form.settlementOfficers = [...settlementOfficers.value, newPerson]
}

// 删除人员
const handleDeletePerson = (index: number): void => {
  const updatedSettlementOfficers = [...settlementOfficers.value]
  updatedSettlementOfficers.splice(index, 1)
  form.settlementOfficers = updatedSettlementOfficers
}

// 保存
const handleConfirm = async () => {
  console.log('确定', form, settlementOfficers.value)
  try {
    let params = form
    await saveEnterpriseAccount(params)
    mittBus.emit('mittGetCompanyList')
    beforeClose()
  } catch (error) {}
}
// 关闭
const beforeClose = () => {
  emit('on-close')
}
</script>

<style lang="less" scoped>
.company-dialog {
  :deep(.el-dialog__header) {
    margin-right: 0;
    background: var(--bg-rest);
  }
  .el-tag {
    margin-right: 12px;
  }
}
</style>
