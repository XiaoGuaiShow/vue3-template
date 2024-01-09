<template>
  <div class="parent-company">
    <div class="left-container">
      <!-- 新增公司 -->
      <AddEditCompany></AddEditCompany>
      <!-- 公司列表 -->
      <CompanyList></CompanyList>
    </div>
    <div class="right-container">
      <!-- 规则设置 -->
      <RuleSetting></RuleSetting>
      <!-- 公司信息 -->
      <CompanyInfo></CompanyInfo>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.parent-company {
  display: flex;
  padding: 12px;
  background: var(--bg_gary);
  height: 100vh;
  .left-container {
    width: 25%;
    margin-right: 12px;
  }
  .right-container {
    flex: 1;
  }
}
</style>
