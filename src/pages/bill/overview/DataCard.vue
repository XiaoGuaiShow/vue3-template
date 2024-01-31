<template>
  <div class="flex ai-c mt-24">
    <div class="title">年度总览</div>
    <el-select class="ml-12 mr-12" v-model="props.year" placeholder="请选择" @change="yearChange">
      <el-option v-for="item in yearList" :key="item" :label="item + '年度'" :value="item" />
    </el-select>
    <el-select v-model="props.enterpriseId" placeholder="请选择" @change="handleChange">
      <el-option-group v-for="group in enterpriseOptions" :key="group.label" :label="group.label">
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-option-group>
    </el-select>
  </div>
  <div v-loading="loading">
    <div class="mt-12 flex">
      <div class="yellow-card flex-1 mr-12">
        <div class="w-full flex jc-sb ai-c">
          <div class="yellow-card-item">
            <div class="item-name">总消费</div>
            <div class="item-money">￥{{ overviewData.totalPrice }}</div>
            <div class="item-link" v-if="!isSummary" @click="goLink(1)">查看</div>
          </div>
          <img class="item-image" :src="invoiceImg" v-if="!isSummary" />
        </div>
      </div>
      <div class="yellow-card flex flex-2">
        <div class="yellow-card-item flex-1">
          <div class="item-name">已结算</div>
          <div class="item-money">￥{{ overviewData.totalPaymentAmount }}</div>
          <div class="item-link" v-if="!isSummary" @click="goLink(2)">查看</div>
        </div>
        <div class="w-full flex jc-sb ai-c flex-1">
          <div class="yellow-card-item">
            <div class="item-name">未结算</div>
            <div class="item-money">￥{{ overviewData.unPaymentAmount }}</div>
            <div class="item-link" v-if="!isSummary" @click="goLink(3)">查看</div>
          </div>

          <img class="item-image" :src="moneyImg" v-if="!isSummary" />
        </div>
      </div>
      <div class="yellow-card flex-1 ml-12" v-if="!isSummary">
        <div class="w-full flex jc-sb ai-c">
          <div class="yellow-card-item">
            <div class="item-name">当前可用额度</div>
            <div class="item-money">￥{{ overviewData.balance }}</div>
            <!-- <div class="item-link" @click="goLink(4)" v-if="settlementType === 1">还款记录</div>
            <div class="item-link" @click="goLink(7)" v-if="settlementType === 4">充值记录</div> -->
          </div>
          <img class="item-image" :src="bpayImg" />
        </div>
      </div>
    </div>
    <div class="yellow-card mt-12">
      <div class="yellow-card-item flex-1 border-right">
        <div class="item-name">已开票</div>
        <div class="item-money">￥{{ overviewData.invoiceAmount }}</div>
        <div class="item-link" v-if="!isSummary" @click="goLink(5)">查看</div>
      </div>
      <div class="yellow-card-item flex-1 ml-12">
        <div class="item-name">未开票</div>
        <div class="item-money">￥{{ overviewData.unInvoiceAmount }}</div>
        <div class="item-link" v-if="!isSummary" @click="goLink(6)">查看</div>
      </div>
      <div class="yellow-card-item flex-1">
        <div class="item-money-2">￥{{ overviewData.unVatInvoiceAmount }}</div>
        <div class="item-name-2">增值税发票未开</div>
      </div>
      <div class="yellow-card-item flex-1">
        <div class="item-money-2">￥{{ overviewData.unPrintInvoiceAmount }}</div>
        <div class="item-name-2">机票行程单未取</div>
      </div>
      <div class="yellow-card-item flex-1">
        <div class="item-money-2">￥{{ overviewData.unTakeoutInvoiceAmount }}</div>
        <div class="item-name-2">火车票根未取</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import invoiceImg from '@/assets/images/bill/invoice.png'
import moneyImg from '@/assets/images/bill/money.png'
import bpayImg from '@/assets/images/bill/bpay.png'
import type { EnterpriseItem, EnterpriseOptionItem } from '@/pages/bill/types'
import { getOverviewDatas, getCompanyList } from '@/api/bill'

const props = defineProps<{
  year: number
  yearChange: any
  enterpriseId: number
  enterpriseIdList: number[]
  setEnterpriseIdFn: any
}>()

const handleChange = (val: number) => {
  const findItem = enterpriseList.value.find((item) => item.enterpriseId === val)
  if (findItem) {
    if (findItem.type === -1) {
      // 汇总
      const ids = enterpriseList.value
        .filter((item) => item.type !== -1)
        .map((item) => item.enterpriseId)
      props.setEnterpriseIdFn(val, ids, true)
    } else {
      props.setEnterpriseIdFn(val, [val], false)
    }
  }
}
// 公司列表
const enterpriseList: Ref<EnterpriseItem[]> = ref([]) // 公司列表
const enterpriseOptions = ref<EnterpriseOptionItem[]>([])
getCompanyList(true).then((res) => {
  if (res.code === '0000') {
    enterpriseList.value = res.data
    const option1 = []
    const option2 = []
    for (const item of res.data) {
      if (item.type === 0 || item.type === -1) {
        option1.push({
          label: item.enterpriseName,
          value: item.enterpriseId
        })
        // 初始化赋值母公司id
        if (item.type === 0) {
          props.setEnterpriseIdFn(item.enterpriseId, [item.enterpriseId], false)
        }
      }
      if (item.type === 1) {
        option2.push({
          label: item.enterpriseName,
          value: item.enterpriseId
        })
      }
    }
    if (option1.length > 0) {
      enterpriseOptions.value.push({
        label: '集团',
        options: option1
      })
    }
    if (option2.length > 0) {
      enterpriseOptions.value.push({
        label: '子公司',
        options: option2
      })
    }
  }
})
const isSummary = computed(() => {
  const findItem = (enterpriseList.value as EnterpriseItem[]).find(
    (item) => item.enterpriseId === props.enterpriseId
  )
  return findItem ? findItem.type === -1 : false
})

const emits = defineEmits(['linkChange'])
const goLink = (type: number) => {
  emits('linkChange', type)
}

// 获取卡片中的数据
const overviewData = reactive({
  balance: 0, // 余额
  totalPrice: 0, // 总消费
  totalPaymentAmount: 0, // 已结算
  unPaymentAmount: 0, // 未结算
  invoiceAmount: 0, // 已开票
  unInvoiceAmount: 0, // 未开票
  unVatInvoiceAmount: 0, // 增值税发票未开
  unPrintInvoiceAmount: 0, // 机票行程单未取
  unTakeoutInvoiceAmount: 0 // 火车票根未取
})
const loading = ref(false)
const settlementType = ref() // 1授信2单结4企业钱包6支付宝——单位代付7银票
watch(
  () => [props.enterpriseIdList, props.year],
  () => {
    const data = {
      year: props.year,
      enterpriseIdList: props.enterpriseIdList
    }
    loading.value = true
    getOverviewDatas(data)
      .then((res) => {
        if (res.code === '0000') {
          overviewData.balance = res.data.balance ?? 0
          overviewData.totalPrice = res.data.totalPrice ?? 0
          overviewData.totalPaymentAmount = res.data.totalPaymentAmount ?? 0
          overviewData.unPaymentAmount = res.data.unPaymentAmount ?? 0
          overviewData.invoiceAmount = res.data.invoiceAmount ?? 0
          overviewData.unInvoiceAmount = res.data.unInvoiceAmount ?? 0
          overviewData.unVatInvoiceAmount = res.data.unVatInvoiceAmount ?? 0
          overviewData.unPrintInvoiceAmount = res.data.unPrintInvoiceAmount ?? 0
          overviewData.unTakeoutInvoiceAmount = res.data.unTakeoutInvoiceAmount ?? 0
          settlementType.value = res.data.settlementType
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
)

// 生成年份列表
function generateYears(year: number) {
  const currentYear = new Date().getFullYear()
  const years = currentYear - year
  const list = []
  for (let i = year; i <= year + years; i++) {
    list.unshift(i)
  }
  return list
}
const yearList = generateYears(2024)
</script>

<style lang="less" scoped>
.title {
  font-size: 18px;
  font-weight: 600;
  color: var(--font-primary);
}
.yellow-card {
  padding: 24px 12px 24px 24px;
  background-color: var(--bg-warning);
  display: flex;
  box-sizing: border-box;
  border-radius: 6px;
  .yellow-card-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .item-name {
      height: 16px;
      line-height: 16px;
      font-size: 16px;
      color: var(--font-secondary);
    }
    .item-money {
      height: 20px;
      line-height: 20px;
      font-size: 20px;
      font-weight: 600;
      color: var(--font-primary);
      margin-top: 6px;
    }
    .item-link {
      height: 14px;
      line-height: 14px;
      color: var(--font-link);
      cursor: pointer;
      font-size: 14px;
      margin-top: 6px;
    }
    .item-image {
      width: 62px;
      height: 62px;
    }
    .item-name-2 {
      font-size: 14px;
      height: 14px;
      line-height: 14px;
      color: var(--font-hint);
      margin-top: 4px;
    }
    .item-money-2 {
      font-size: 20px;
      height: 20px;
      font-weight: 600;
      line-height: 20px;
      color: var(--font-secondary);
    }
  }
}
.border-right {
  border-right: 1px solid var(--line-rest);
}
</style>
