<template>
  <div class="rule-setting">
    <div class="deduction-rule">
      <span class="title-label">扣款规则</span>
      <span>{{ deductionAccountType ? '统一从母公司扣款' : '子公司从自己公司扣款' }}</span>
    </div>
    <div class="rule-setting-btn" @click="handleCommonSetting">规则设置</div>
  </div>
  <!-- 通用规则设置 -->
  <CommonSetting :visible="commonVisible" @on-close="handleClose"></CommonSetting>
</template>

<script setup lang="ts">
import { commonSettingInfo } from '@/api/modules/parentCompany'
import { ElMessage } from 'element-plus'
// 通用设置
let commonVisible = ref(false)

const handleCommonSetting = () => {
  commonVisible.value = true
}

const deductionParentAccountStatus = ref()
const deductionAccountType = ref()
// 获取设置信息
const getSettingInfo = () => {
  commonSettingInfo().then((res: any) => {
    if (res.code === '0000') {
      if (res.data) {
        deductionParentAccountStatus.value = res.data.deductionParentAccountStatus || 0
        deductionAccountType.value = res.data.deductionAccountType || 0
      }
    } else {
      ElMessage.error(res.msg)
    }
  })
}
getSettingInfo()

const handleClose = () => {
  commonVisible.value = false
  getSettingInfo()
}
</script>

<style lang="less" scoped>
.rule-setting {
  background: var(--bg-white);
  border-radius: 8px;
  padding: 38px 24px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .deduction-rule {
    display: flex;
    align-items: center;
    .title-label {
      font-size: 16px;
      font-weight: 600;
      line-height: 16px;
      color: var(--font-primary);
    }
    span:nth-child(1) {
      margin-right: 12px;
    }
    span:nth-child(2) {
      margin-right: 12px;
      font-size: 14px;
    }
    span:nth-child(3) {
      color: var(--font-hint);
      font-size: 12px;
    }
  }
  .rule-setting-btn {
    background: var(--brand-blue);
    color: var(--font-anti);
    font-size: 14px;
    line-height: 14px;
    padding: 9px 16px;
    cursor: pointer;
  }
}
</style>
