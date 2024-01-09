<template>
  <div class="common-setting">
    <el-dialog
      v-model="props.visible"
      destroy-on-close
      :close-on-click-modal="false"
      :before-close="beforeClose"
      width="800px"
      title="扣款规则设置">
      <div class="setting-title">请选择子公司从哪个公司扣款?</div>
      <el-radio-group v-model="deductionParentAccountStatus">
        <el-radio :label="1">子公司从自己公司扣款</el-radio>
        <el-radio :label="0">统一从母公司扣款</el-radio>
      </el-radio-group>
      <div class="setting-title">当员工下单未找到扣款公司时，是否从母公司扣款?</div>
      <el-radio-group v-model="deductionParentAccountStatus">
        <el-radio :label="1">是，保障员工出行</el-radio>
        <el-radio :label="0">否，不允许下单</el-radio>
      </el-radio-group>
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
// import request from '@/request/request.js'
// import { platformApi } from '@/request/api/platform'
// import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
const props = defineProps(['visible'])
const emit = defineEmits(['on-close'])

watch(
  () => props.visible,
  (val) => {
    if (val) {
      getSettingInfo()
    }
  }
)

let deductionParentAccountStatus = ref()
// 获取设置信息
const getSettingInfo = async () => {
  console.log('44========获取信息')
  // try {
  // 	const res = await request({
  // 		apiModule: platformApi.accountCommonSettingInfo,
  // 		data: {}
  // 	})
  // 	if (res.code == '0000') {
  // 		deductionParentAccountStatus.value = res.data.deductionParentAccountStatus || 0
  // 	} else {
  // 		ElMessage.error(res.message)
  // 	}
  // } catch (err) {}
}

// 保存确认
const handleConfirm = async () => {
  // try {
  // 	let params = {
  // 		deductionParentAccountStatus: deductionParentAccountStatus.value
  // 	}
  // 	const res = await request({
  // 		apiModule: platformApi.accountCommonSetting,
  // 		data: params
  // 	})
  // 	if (res.code == '0000') {
  // 		ElMessage.success('设置成功')
  // 		beforeClose()
  // 	}
  // } catch (err) {}
}
const beforeClose = () => {
  emit('on-close')
}
</script>
<style lang="less" scoped>
.common-setting {
  :deep(.el-dialog__header) {
    margin-right: 0;
    background: var(--bg-rest);
  }
  .setting-title {
    color: var(--font-primary);
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 24px;
    &:not(:first-child) {
      margin-top: 48px;
    }
  }
}
</style>
