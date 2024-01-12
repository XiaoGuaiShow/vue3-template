<template>
  <div class="rule-setting">
    <div class="deduction-rule">
      <span class="title-label">扣款规则</span>
      <span>统一扣母公司</span>
      <span>每个子公司可独立结算。根据关联的发票抬头从对应的子公司或者母公司扣</span>
    </div>
    <div class="rule-setting-btn" @click="handleCommonSetting">规则设置</div>
  </div>
  <!-- 通用规则设置 -->
  <CommonSetting :visible="commonVisible" @on-close="commonVisible = false"></CommonSetting>
</template>

<script setup lang="ts">
// 通用设置
let commonVisible = ref(false)

const handleCommonSetting = () => {
  commonVisible.value = true
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
