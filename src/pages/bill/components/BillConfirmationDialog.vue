<template>
  <el-dialog v-model="dialogVisible" title="确认并提交开票" width="1000" @closed="handleClose">
    <div>
      <div class="section">
        <div class="fs-20 fw-600 c-font-primary">账单汇总</div>
        <SummaryExpression class="mt-12" :summary="summaryData"></SummaryExpression>
      </div>
      <div class="fs-16 fw-600 c-font-primary mt-24">开票概览</div>
      <InvoiceTable
        from="confirmationDialog"
        :periodId="periodId"
        :enterpriseId="enterpriseId"></InvoiceTable>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="btnLoading">
          确认并提交开票申请
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import SummaryExpression from '../components/SummaryExpression.vue'
import InvoiceTable from '@/pages/invoice/components/InvoiceTable.vue'
import { getBillPeriodSummary } from '@/api/bill'
import { confirmInvoiceApplication } from '@/api/invoice'
import type { PeriodSum } from '@/pages/bill/types'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  enterpriseId: number
  periodId: number
}>()
const summaryData: Ref<Partial<PeriodSum>> = ref({})
watchEffect(() => {
  getBillPeriodSummary({
    enterpriseId: props.enterpriseId,
    periodId: props.periodId
  }).then((res) => {
    summaryData.value = res.data
  })
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
  confirmInvoiceApplication({
    enterpriseId: props.enterpriseId,
    periodId: props.periodId
  })
    .then((res) => {
      if (res.code === '0000') {
        ElMessage.success('确认成功')
        emits('confirm')
        emits('close')
      }
    })
    .finally(() => {
      dialogVisible.value = false
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
