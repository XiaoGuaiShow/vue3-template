<template>
  <div class="container">
    <div class="section">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tabs"
          :key="item.tabId"
          :label="item.label"
          :name="item.name"></el-tab-pane>
      </el-tabs>
      <!-- 账单总览 -->
      <Suspense v-if="activeName === 'first'">
        <DataCard
          v-if="activeName === 'first'"
          :year="year"
          :yearChange="yearChange"
          :enterpriseId="enterpriseId"
          :enterpriseIdList="enterpriseIdList"
          :setEnterpriseIdFn="setEnterpriseIdFn"
          @link-change="goLink"></DataCard>
      </Suspense>
      <!-- 消费数据 -->
      <ConsumptionTable
        v-if="activeName === 'second'"
        :year="year"
        :enterpriseId="enterpriseId"></ConsumptionTable>
      <!-- 账单列表 -->
      <BillList
        v-if="activeName === 'third'"
        :status="status"
        :year="year"
        :enterpriseId="enterpriseId"></BillList>
      <!-- 导出记录 -->
      <ExportRecord v-if="activeName === 'fourth'"></ExportRecord>
    </div>
    <template v-if="activeName === 'first'">
      <MonthTab :month="month" :monthChange="monthChange"></MonthTab>
      <SummaryTable
        v-if="isSummary"
        :basicParams="{
          year,
          month,
          enterpriseIdList
        }"></SummaryTable>
      <Bill
        v-else
        :year="year"
        :month="month"
        :enterpriseId="enterpriseId"
        @switch-tab="switchTab"></Bill>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import DataCard from './overview/DataCard.vue'
import MonthTab from './overview/MonthTab.vue'
import SummaryTable from './overview/SummaryTable.vue'
import Bill from './overview/Bill.vue'
import ConsumptionTable from './consumption/index.vue'
import BillList from './bill/index.vue'
import ExportRecord from './record/ExportRecord.vue'
import { useBillStore } from '@/store/modules/bill'
import mittBus from '@/utils/mitt'
import { useOverview } from './hooks/useOverview'
import { getTabIds } from '@/api/bill'

// 获取tab权限
const menuId = 64
const tabsMap = new Map([
  [82, { label: '账单总览', name: 'first', tabId: 82 }],
  [83, { label: '消费数据', name: 'second', tabId: 83 }],
  [84, { label: '账单列表', name: 'third', tabId: 84 }],
  [65, { label: '导出记录', name: 'fourth', tabId: 65 }],
  [85, { label: '导出模板', name: 'fifth', tabId: 85 }]
])
const tabs = ref<any[]>([])
const activeName = ref('')
getTabIds({ menuId }).then((res) => {
  if (res.code === '0000') {
    const data = res.data || []
    const keys = [...tabsMap.keys()]
    keys.forEach((item: number) => {
      if (data.includes(item)) {
        tabs.value.push(tabsMap.get(item))
      }
    })
    if (tabs.value.length > 0) {
      activeName.value = tabs.value[0].name
    }
  }
})

const {
  year,
  yearChange,
  enterpriseId,
  enterpriseIdList,
  setEnterpriseIdFn,
  month,
  monthChange,
  isSummary
} = useOverview()

const router = useRouter()
const handleClick = () => {
  status.value = -1
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
  data.year && yearChange(data.year)
  data.month && monthChange(data.month)
  data.enterpriseId && setEnterpriseIdFn(data.enterpriseId, [data.enterpriseId], false)
})

onBeforeRouteLeave(() => {
  billStore.resetOverviewDatas()
})
</script>

<style lang="less" scoped>
.container {
  padding: 0 12px 12px;
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
