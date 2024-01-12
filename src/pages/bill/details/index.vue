<template>
  <div class="container">
    <div class="section flex ai-c">
      <!-- 返回 -->
      <el-link
        class="c-brand-blue fs-14 flex ai-c"
        :underline="false"
        type="primary"
        @click="goLink">
        <ArrowLeft style="width: 1em; height: 1em; margin-right: 4px" />
        返回
      </el-link>
      <div class="flex-1 ta-c fs-16 fw-600 c-font-primary">
        苏州思客信息技术有限公司2023-10-01至2023-10-31结算单
      </div>
      <div>
        <el-button type="primary" plain>导出账单</el-button>
        <el-button type="primary">确认并提交开票</el-button>
      </div>
    </div>
    <div class="section mt-12">
      <div class="fs-20 fw-600 c-font-primary">账单汇总</div>
      <SummaryExpression class="mt-12"></SummaryExpression>
    </div>
    <div class="section mt-12">
      <el-tabs v-model="activeName">
        <el-tab-pane label="本期消费" name="first">
          <OrderTable></OrderTable>
        </el-tab-pane>
        <el-tab-pane label="上期未结" name="second">
          <OrderTable></OrderTable>
        </el-tab-pane>
        <el-tab-pane label="本期异议" name="third">
          <OrderTable name="third"></OrderTable>
        </el-tab-pane>
        <el-tab-pane label="未取回票据" name="fourth">
          <OrderTable name="fourth"></OrderTable>
        </el-tab-pane>
        <el-tab-pane label="跨帐期退" name="fifth">
          <OrderTable></OrderTable>
        </el-tab-pane>
        <el-tab-pane label="本期应结" name="sixth">
          <OrderTable></OrderTable>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import OrderTable from './OrderTable.vue'
import SummaryExpression from '../components/SummaryExpression.vue'
const activeName = ref('first')
</script>

<style lang="less" scoped>
.container {
  padding: 0 12px 12px;
  .section {
    padding: 24px;
    background-color: var(--bg-white);
    border-radius: 6px;
  }
}
:deep(.el-tabs__header.is-top) {
  margin: 0;
}
</style>
