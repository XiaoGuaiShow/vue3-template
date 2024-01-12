<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800" @closed="handleClose">
    <div>
      <div class="flex jc-sb">
        <div class="fs-16 fw-500 c-font-primary">{{ dialogTitle }}调整</div>
        <el-button
          v-if="dialogTitle === '开票单位'"
          type="primary"
          link
          @click="innerVisible = true">
          添加开票单位
        </el-button>
      </div>
      <div class="mt-12 flex ai-c">
        <div class="flex-1">
          <el-input class="left-input" v-model="originCompany" disabled></el-input>
          <el-input class="left-input" v-model="originCompany" disabled></el-input>
        </div>
        <div class="m-0-8">调整为</div>
        <el-select class="flex-1" v-model="adjustCompany" :placeholder="'请选择' + dialogTitle">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </div>
      <div class="mt-12 flex ai-c">
        <div class="flex-1">
          <el-input class="left-input" v-model="originCompany" disabled></el-input>
        </div>
        <div class="m-0-8">调整为</div>
        <el-select class="flex-1" v-model="adjustCompany" :placeholder="'请选择' + dialogTitle">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <AddEditInvoiceTitle
    :visible="innerVisible"
    :showAddressAndScope="false"
    @on-close="innerVisible = false"></AddEditInvoiceTitle>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted } from 'vue'
import AddEditInvoiceTitle from '@/pages/parentCompany/components/CompanyInfo/AddEditInvoiceTitle.vue'

const props = defineProps<{
  dialogTitle: string
}>()
const { dialogTitle } = toRefs(props)

const emits = defineEmits(['close'])

const dialogVisible = ref(false)
onMounted(() => {
  dialogVisible.value = true
})
const handleClose = () => {
  console.log('动画结束后执行')
  emits('close')
}

const originCompany = ref('苏州思客信息有限公司')
const adjustCompany = ref('')
const innerVisible = ref(false)
</script>
<style scoped lang="less">
/* .dialog-footer button:first-child {
  margin-right: 10px;
} */
.left-input + .left-input {
  margin-top: 8px;
}
</style>
