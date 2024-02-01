<template>
  <div class="parent-company">
    <div class="left-container">
      <!-- 新增公司 -->
      <AddEditCompany v-if="isManager"></AddEditCompany>
      <!-- 公司列表 -->
      <CompanyList></CompanyList>
    </div>
    <div class="right-container">
      <!-- 规则设置 -->
      <RuleSetting v-if="isManager"></RuleSetting>
      <!-- 公司信息 -->
      <CompanyInfo></CompanyInfo>
    </div>
  </div>
</template>

<script setup lang="ts">
import CompanyList from '@/pages/parentCompany/components/CompanyList/index.vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const isManager = computed(() => userStore.userInfo.isManager === 1)
</script>

<style lang="less" scoped>
.parent-company {
  display: flex;
  padding: 0 12px 12px;
  align-items: stretch;
  .left-container {
    width: 240px;
    margin-right: 12px;
    display: flex;
    flex-direction: column;
  }
  .right-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
