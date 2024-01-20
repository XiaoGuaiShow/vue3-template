<template>
  <div class="add-edit-company">
    <div class="title-label">新增操作</div>
    <el-button class="w-full mt-12" type="primary" :icon="Plus" @click="handleAdd">
      新增子公司
    </el-button>
    <CompanyDialog :visible="commonVisible" @on-close="commonVisible = false"></CompanyDialog>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
let commonVisible = ref<boolean>(false)

const handleAdd = () => {
  commonVisible.value = true
}
</script>

<style lang="less" scoped>
.add-edit-company {
  background: var(--bg-white);
  padding: 24px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  .title-label {
    font-size: 16px;
    font-weight: 600;
    line-height: 16px;
    color: var(--font-primary);
  }
  .title-btn {
    background: var(--brand-blue);
    color: var(--font-anti);
    font-size: 14px;
    line-height: 14px;
    width: 100%;
    text-align: center;
    padding: 9px 0;
    cursor: pointer;
  }
}
</style>
