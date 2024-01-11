<template>
  <div class="flex ai-c mt-24">
    <div class="title">年度总览</div>
    <el-select class="ml-12 mr-12" v-model="year" placeholder="请选择">
      <el-option label="2022年度" value="2022" />
      <el-option label="2023年度" value="2023" />
      <el-option label="2024年度" value="2024" />
    </el-select>
    <el-select v-model="company" placeholder="Select" @change="handleSelectCompany">
      <el-option-group v-for="group in options" :key="group.label" :label="group.label">
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
            <div class="item-money">￥1,000,000.00</div>
            <div class="item-link" v-if="!isSummary">查看</div>
          </div>
          <img class="item-image" :src="invoiceImg" v-if="!isSummary" />
        </div>
      </div>
      <div class="yellow-card flex flex-2">
        <div class="yellow-card-item flex-1">
          <div class="item-name">已结算</div>
          <div class="item-money">￥800,000.00</div>
          <div class="item-link" v-if="!isSummary">查看</div>
        </div>
        <div class="w-full flex jc-sb ai-c flex-1">
          <div class="yellow-card-item">
            <div class="item-name">未结算</div>
            <div class="item-money">￥200,000.00</div>
            <div class="item-link" v-if="!isSummary">查看</div>
          </div>

          <img class="item-image" :src="moneyImg" v-if="!isSummary" />
        </div>
      </div>
      <div class="yellow-card flex-1 ml-12" v-if="!isSummary">
        <div class="w-full flex jc-sb ai-c">
          <div class="yellow-card-item">
            <div class="item-name">当前可用额度</div>
            <div class="item-money">￥2,000,000.00</div>
            <div class="item-link" @click="goToRechargeRecords">还款记录</div>
          </div>
          <img class="item-image" :src="bpayImg" />
        </div>
      </div>
    </div>
    <div class="yellow-card mt-12">
      <div class="yellow-card-item flex-1 border-right">
        <div class="item-name">已开票</div>
        <div class="item-money">￥200,000.00</div>
        <div class="item-link" v-if="!isSummary">查看</div>
      </div>
      <div class="yellow-card-item flex-1 ml-12">
        <div class="item-name">未开票</div>
        <div class="item-money">￥200,000.00</div>
        <div class="item-link" v-if="!isSummary">查看</div>
      </div>
      <div class="yellow-card-item flex-1">
        <div class="item-money-2">￥800.00</div>
        <div class="item-name-2">增值税发票未开</div>
      </div>
      <div class="yellow-card-item flex-1">
        <div class="item-money-2">￥200.00</div>
        <div class="item-name-2">机票行程单未取</div>
      </div>
      <div class="yellow-card-item flex-1">
        <div class="item-money-2">￥200.00</div>
        <div class="item-name-2">火车票根未取</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useYearAndCompany } from '../hooks/overview'
import { useRouter } from 'vue-router'
import invoiceImg from '@/assets/images/bill/invoice.png'
import moneyImg from '@/assets/images/bill/money.png'
import bpayImg from '@/assets/images/bill/bpay.png'
const router = useRouter()
const emits = defineEmits(['change'])
const options = [
  {
    label: '集团',
    options: [
      {
        value: 'sike',
        label: '苏州思客'
      },
      {
        value: 'huizong',
        label: '集团汇总'
      }
    ]
  },
  {
    label: '子公司',
    options: [
      {
        value: 'gl',
        label: '思客国旅'
      },
      {
        value: 'sh',
        label: '上海思客'
      }
    ]
  }
]
const { year, company, loading, isSummary, handleSelectCompany } = useYearAndCompany()
watch(
  () => [year.value, company.value, isSummary.value],
  (newVal) => {
    emits('change', newVal)
  },
  {
    immediate: true
  }
)

const goToRechargeRecords = () => {
  const hasChild = cooperate.value.childSurveys ? cooperate.value.childSurveys.length > 0 : false
  router.push('/repayment?hasChild=' + Number(hasChild))
}
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
