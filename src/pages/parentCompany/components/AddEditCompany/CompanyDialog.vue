<template>
  <div class="company-dialog">
    <el-dialog
      v-model="props.visible"
      destroy-on-close
      :close-on-click-modal="false"
      :before-close="beforeClose"
      width="800px"
      :title="title">
      <el-form label-width="90px">
        <el-form-item label="子公司名称">
          <el-input v-model="companyName" placeholder="请输入子公司名称" />
        </el-form-item>
        <el-form-item label="结算员">
          <div>
            <div class="btn-primary plain" @click="handleAddPerson">选择人员</div>
            <div class="tag-list mt-12" v-if="settleMembers.length">
              <el-tag
                closable
                type="info"
                color="#F7F8FA"
                v-for="(item, index) in settleMembers"
                :key="index"
                @close="handleDeletePerson">
                {{ item.memberName }}
              </el-tag>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <div class="btn btn-info" @click="beforeClose">取 消</div>
          <div class="btn btn-primary" @click="handleConfirm">保存</div>
        </span>
      </template>
    </el-dialog>
  </div>
  <GroupSelector
    v-model:visible="showDialog"
    :isSingleChoice="true"
    :popSelectType="2"
    :isShowSonDep="false"
    v-if="showDialog"
    @on-ok="handleSelectConfirm" />
</template>

<script setup lang="ts">
import { saveEnterpriseAccount } from '@/api/modules/parentCompany.ts'
import mittBus from '@/utils/mitt.ts'
import { ElMessage } from 'element-plus'
const props = defineProps({
  visible: { type: Boolean },
  companyInfo: { type: Object, default: {} }
})
const emit = defineEmits(['on-close'])

const title = ref<string>('新增子公司')
watch(
  () => props.visible,
  (val) => {
    if (val) {
      title.value = props.companyInfo.id ? '编辑子公司' : '新增子公司'
    }
  }
)

const companyName = ref('')
const settleMembers = ref<any[]>([])
const showDialog = ref<boolean>(false)
const handleSelectConfirm = (data: any) => {
  if (data?.list?.length) {
    settleMembers.value = [
      {
        memberId: data.list[0].CustomerId,
        memberName: data.list[0].Name,
        jobNo: data.list[0].WorkCode
      }
    ]
  }
}

// 增加人员
const handleAddPerson = () => {
  settleMembers.value = []
  showDialog.value = true
}

// 删除人员
const handleDeletePerson = (): void => {
  settleMembers.value = []
}

// 保存
const handleConfirm = async () => {
  if (!companyName.value) return ElMessage.error('请输入子公司名称')
  if (!settleMembers.value.length) return ElMessage.error('请选择结算员')
  let params = {
    companyName: companyName.value,
    settleMembers: settleMembers.value
  }
  const res: any = await saveEnterpriseAccount(params)
  console.log(res)
  if (res.code === '0000') {
    ElMessage.success('操作成功')
    mittBus.emit('mittGetCompanyList')
    beforeClose()
  } else {
    ElMessage.error(res.message)
  }
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
