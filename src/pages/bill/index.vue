<template>
  <div class="container">
    <div class="section">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="账单总览" name="first">
          <DataCard @change="handleChange"></DataCard>
        </el-tab-pane>
        <el-tab-pane label="消费数据" name="second">
          <ConsumptionTable></ConsumptionTable>
        </el-tab-pane>
        <el-tab-pane label="账单列表" name="third">
          <BillList></BillList>
        </el-tab-pane>
        <el-tab-pane label="导出记录" name="fourth">
          <ExportRecord></ExportRecord>
        </el-tab-pane>
        <el-tab-pane label="导出模板" name="fifth">Task</el-tab-pane>
      </el-tabs>
    </div>
    <template v-if="activeName === 'first'">
      <MonthTab></MonthTab>
      <SummaryTable v-if="isSummary"></SummaryTable>
      <Bill v-else></Bill>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import DataCard from './overview/DataCard.vue'
import MonthTab from './overview/MonthTab.vue'
import SummaryTable from './overview/SummaryTable.vue'
import Bill from './overview/Bill.vue'
import ConsumptionTable from './consumption/index.vue'
import BillList from './bill/index.vue'
import ExportRecord from './record/ExportRecord.vue'

const isSummary = ref(true)
const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const handleChange = (arr: [number, string, boolean, boolean]) => {
  console.log(arr)
  const [year, company, isSummaryProp] = arr
  isSummary.value = isSummaryProp
}
</script>

<style lang="less" scoped>
.container {
  padding: 12px;
  background-color: rgb(242, 243, 245);
}
.section {
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
}
:deep(.el-tabs__header.is-top) {
  margin: 0;
}
</style>
