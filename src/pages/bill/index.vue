<template>
  <div class="container">
    <div class="section">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="账单总览" name="first">
          <Suspense>
            <DataCard @change="handleChange" @link-change="goLink"></DataCard>
          </Suspense>
        </el-tab-pane>
        <el-tab-pane label="消费数据" name="second">
          <ConsumptionTable v-if="activeName === 'second'"></ConsumptionTable>
        </el-tab-pane>
        <el-tab-pane label="账单列表" name="third">
          <BillList :status="status" v-if="activeName === 'third'"></BillList>
        </el-tab-pane>
        <el-tab-pane label="导出记录" name="fourth">
          <ExportRecord v-if="activeName === 'fourth'"></ExportRecord>
        </el-tab-pane>
        <!-- <el-tab-pane label="导出模板" name="fifth">Task</el-tab-pane> -->
      </el-tabs>
    </div>
    <template v-if="activeName === 'first'">
      <MonthTab @month-change="monthChange"></MonthTab>
      <SummaryTable v-if="isSummary" :basicParams="basicParams"></SummaryTable>
      <Bill v-else :basicParams="basicParams" @switch-tab="switchTab"></Bill>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DataCard from './overview/DataCard.vue'
import MonthTab from './overview/MonthTab.vue'
import SummaryTable from './overview/SummaryTable.vue'
import Bill from './overview/Bill.vue'
import ConsumptionTable from './consumption/index.vue'
import BillList from './bill/index.vue'
import ExportRecord from './record/ExportRecord.vue'
import type { BasicParams } from './types'
import { useBillStore } from '@/store/modules/bill'
import mittBus from '@/utils/mitt'

const router = useRouter()

const isSummary = ref(false)
const activeName = ref('first')
const basicParams = reactive<BasicParams>({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  enterpriseIdList: []
})

const handleClick = () => {
  status.value = -1
}
const handleChange = (arr: [number, number[], boolean]) => {
  const [year, enterpriseIdList, isSummaryProp] = arr
  isSummary.value = isSummaryProp
  basicParams.year = year
  basicParams.enterpriseIdList = enterpriseIdList
}

const monthChange = (month: number) => {
  basicParams.month = month
}

const status = ref(-1) // 0 全部 1已结算 2未结算
const billStore = useBillStore()
const goLink = (type: number) => {
  // 1总消费 2已结算 3未结算 4还款记录 5已开票 6未开票 7充值记录
  if (type === 1) {
    activeName.value = 'second'
  } else if (type === 2) {
    activeName.value = 'third'
    status.value = 18
  } else if (type === 3) {
    activeName.value = 'third'
    status.value = -1
  } else if (type === 4) {
    const childEnterprise = billStore.enterpriseList.filter((item: any) => item.type === 1)
    const hasChild = childEnterprise.length > 0
    router.push('repayment?hasChild=' + Number(hasChild))
  } else if (type === 5) {
    router.push(`/invoice-history?status=1`)
  } else if (type === 6) {
    router.push(`/invoice-history?status=0`)
  } else if (type === 7) {
    const childEnterprise = billStore.enterpriseList.filter((item: any) => item.type === 1)
    const hasChild = childEnterprise.length > 0
    router.push(`/recharge?hasChild=` + Number(hasChild))
  }
}

const switchTab = (tab: string) => {
  activeName.value = tab
}

// 监听其他组件需要跳转到账单总览
mittBus.on('willToBillDetail', (data: any) => {
  activeName.value = 'first'
})
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
