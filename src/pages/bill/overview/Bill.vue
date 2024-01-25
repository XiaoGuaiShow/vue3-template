<template>
  <div class="inner-section" v-loading="loading">
    <div class="title fs-18 flex ai-c">
      账期
      <div
        class="blue-tab ml-12"
        v-for="(item, index) in billPeriodList"
        :key="item.periodRange"
        :class="{ active: activeIndex === index }"
        @click="tabClick(index)">
        {{ item.periodRange }}
      </div>
    </div>

    <div class="bill-card" v-loading="sLoading">
      <div>
        <div class="flex jc-sb ai-c">
          <div class="left-block flex" :class="[statusColor(detail.settlementStatus)]">
            <div class="circle flex ai-c jc-c">
              <svg-icon class="icon" name="bill" size="48"></svg-icon>
            </div>
            <div class="ml-24 flex col jc-c">
              <div class="fs-24 fw-600 left-block-title">
                {{
                  detail.settlementStatus
                    ? SETTLEMENT_STATUS.get(detail.settlementStatus)
                    : '未出账'
                }}
              </div>
              <div class="flex mt-12 ai-c">
                <div class="fs-18 fw-500 c-font-primary" v-if="detail.periodLatestPaymentDate">
                  最晚结算日: {{ detail.periodLatestPaymentDate }}
                </div>
                <div
                  class="flex ai-c elliptic ml-12"
                  v-if="detail.countDown && detail.countDown > 0">
                  <img :src="timeImg" alt="" />
                  <div class="fs-12 h-12 lh-12 c-font-hint ml-2">距最晚结算日</div>
                  <div class="fs-16 h-16 lh-16 c-brand-blue">{{ detail.countDown }}天</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <el-button type="primary" plain @click="goLink(1)" v-if="detail.settlementStatus">
              查看账单明细
            </el-button>
            <el-button type="primary" plain @click="goLink(2)" v-else>查看消费明细</el-button>
            <el-button
              type="primary"
              @click="showBillDialog = true"
              v-if="detail.settlementStatus === 6">
              确认账单
            </el-button>
            <el-button
              type="primary"
              v-if="typeof detail.settlementStatus === 'number' && detail.settlementStatus > 6"
              @click="goLink(3)">
              查看发票
            </el-button>
          </div>
        </div>
      </div>

      <div class="section mt-24">
        <div class="fs-20 fw-600 c-font-primary">账单汇总</div>
        <SummaryExpression class="mt-12" :summary="detail.periodSum"></SummaryExpression>
      </div>

      <div class="section mt-24">
        <div class="fs-20 fw-600 c-font-primary h-20 lh-20">账单分类概览</div>
        <div
          class="bill-item"
          v-for="(item, index) in feeClassList(detail.feeClassSumList)"
          :key="index">
          <div
            class="bill-item-col"
            v-for="(item2, index2) in productTypeList(item.productList)"
            :key="index2"
            :class="{ header: item2.productType === 0 }">
            <div class="l-label">
              {{
                item2.productType === 0
                  ? FEE_CLASS.get(item.feeClass)
                  : PRODUCT_TYPE.get(item2.productType)
              }}
            </div>
            <div class="l-money">
              {{ +item2.productTotalPrice === 0 ? '-' : `￥${item2.productTotalPrice}` }}
            </div>
            <div v-for="(item3, index3) in feeTypeList(item2.feeDetailList)" :key="index3">
              <span class="s-label">{{ FEE_TYPE.get(item3.feeType) }}</span>
              <template v-if="+item3.totalPrice === 0">-</template>
              <template v-else>
                <span v-if="item2.productType === 0">￥</span>
                {{ item3.totalPrice }}
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <BillConfirmationDialog
    v-if="showBillDialog"
    :enterpriseId="billPeriodList[activeIndex].enterpriseId"
    :periodId="billPeriodList[activeIndex].periodId"
    @close="showBillDialog = false"
    @confirm="handleConfirm" />
</template>

<script lang="ts" setup>
import timeImg from '@/assets/images/bill/time.png'
import { ref } from 'vue'
import { FEE_TYPE, PRODUCT_TYPE, FEE_CLASS, SETTLEMENT_STATUS } from '@/common/static'
import { sortBy } from 'lodash-es'
import type {
  FeeTypeItem,
  ProductTypeItem,
  FeeClassItem,
  BillPeriodItem,
  BasicParams,
  BillPeriodDetail
} from '../types'
import SummaryExpression from '../components/SummaryExpression.vue'
import BillConfirmationDialog from '../components/BillConfirmationDialog.vue'
import { getBillPeriodList, getBillPeriodDetail } from '@/api/bill'
import mittBus from '@/utils/mitt'
import { useBillStore } from '@/store/modules/bill'
import { useRouter } from 'vue-router'
const router = useRouter()

const loading = ref(true)
const props = defineProps<{
  basicParams: BasicParams
}>()
// 获取选中月份的账期列表
const billPeriodList = ref<BillPeriodItem[]>([])
const activeIndex = ref(0)
// 查询该月有多少账期
watchEffect(() => {
  const enterpriseId = props.basicParams.enterpriseIdList[0]
  if (!enterpriseId) return
  loading.value = true
  getBillPeriodList({
    enterpriseId,
    month: props.basicParams.month,
    year: props.basicParams.year
  })
    .then((res) => {
      billPeriodList.value = res.data || []
      activeIndex.value = res.data.length ? 0 : -1
      getBillDeatil()
    })
    .finally(() => {
      loading.value = false
    })
})
const tabClick = (index: number) => {
  activeIndex.value = index
}
mittBus.on('changePage', (data: any) => {
  const findIndex = billPeriodList.value.findIndex((item) => item.periodId === data.periodId)
  if (findIndex > -1) {
    activeIndex.value = findIndex
  }
})

const sLoading = ref(false)
const detail: Ref<BillPeriodDetail> = ref({
  countDown: 0,
  periodLatestPaymentDate: '',
  feeClassSumList: [],
  periodRange: '',
  settlementStatus: undefined,
  periodSum: {}
})
function getBillDeatil() {
  sLoading.value = true
  if (billPeriodList.value.length === 0) return
  const activePeriod = billPeriodList.value[activeIndex.value]
  const params = {
    enterpriseId: activePeriod.enterpriseId,
    periodId: activePeriod.periodId,
    periodStartDate: activePeriod.periodStartDate,
    periodEndDate: activePeriod.periodEndDate
  }
  getBillPeriodDetail(params)
    .then((res) => {
      if (res.code === '0000') {
        detail.value = res.data
      }
    })
    .catch((err) => {
      console.log('eeeeeeeeeeeee', err)
      detail.value = {
        countDown: 0,
        periodLatestPaymentDate: '',
        feeClassSumList: [],
        periodRange: '',
        settlementStatus: undefined,
        periodSum: {}
      }
    })
    .finally(() => {
      sLoading.value = false
    })
}

const handleConfirm = () => {
  getBillDeatil()
}

const statusColor = computed(() => {
  return (status: any) => {
    if (status === 18) return 'green'
    if (status >= 6 && status <= 15) return 'primary'
    return 'grey'
  }
})

const showBillDialog = ref(false)
// feeType排序
const sortFeeTypeList = [...FEE_TYPE.keys()]
const feeTypeList = computed(() => {
  return (list: FeeTypeItem[]) => {
    const newList = sortBy(list, function (o) {
      return sortFeeTypeList.indexOf(o.feeType)
    })
    return newList
  }
})
// productType排序
const sortProductTypeList = [...PRODUCT_TYPE.keys()]
const productTypeList = computed(() => {
  return (list: ProductTypeItem[]) => {
    const newList = sortBy(list, function (o) {
      return sortProductTypeList.indexOf(o.productType)
    })
    return newList
  }
})
// feeClass排序
const sortFeeClassList = [...FEE_CLASS.keys()]
const feeClassList = computed(() => {
  return (list: FeeClassItem[]) => {
    const newList = sortBy(list, function (o) {
      return sortFeeClassList.indexOf(o.feeClass)
    })
    return newList
  }
})

const emit = defineEmits(['switchTab'])
const billStore = useBillStore()
const goLink = (type: number) => {
  const periodId = billPeriodList.value[activeIndex.value].periodId
  const enterpriseId = billPeriodList.value[activeIndex.value].enterpriseId
  if (type === 1) {
    billStore.setBillDetail(periodId, enterpriseId)
    router.push(`/bill/details`)
  } else if (type === 2) {
    emit('switchTab', 'second')
  } else if (type === 3) {
    const periodId = billPeriodList.value[activeIndex.value].periodId
    router.push({
      path: `/invoice/history/${periodId}`
    })
  }
}
</script>

<style lang="less" scoped>
.link {
  color: var(--brand-blue);
  cursor: pointer;
  font-size: 13px;
}
.inner-section {
  padding: 24px;
  background: var(--bg-white);
  border-radius: 0 0 8px 8px;
  border-left: 1px solid var(--line-rest);
  border-right: 1px solid var(--line-rest);
  border-bottom: 1px solid var(--line-rest);
}
.title {
  font-weight: 600;
  color: var(--font-primary);
}
.blue-tab {
  background: var(--bg-unselect);
  color: var(--font-secondary);
  height: 36px;
  line-height: 20px;
  border-radius: 4px;
  padding: 8px;
  font-size: 20px;
  font-weight: 600;
  box-sizing: border-box;
  cursor: pointer;
  &.active {
    background-color: var(--bg-select);
    color: var(--brand-blue);
  }
}
.bill-card {
  padding: 24px;
  border: 1px solid var(--line-brand);
  background: var(--bg-brand);
  border-radius: 8px;
  margin-top: 24px;
}
.left-block {
  &.primary {
    .circle {
      background: var(--tag_blue);
    }
    .icon,
    .left-block-title {
      color: var(--brand-blue);
    }
  }
  &.green {
    .circle {
      background: var(--bg-success);
    }
    .icon,
    .left-block-title {
      color: var(--tip-success);
    }
  }
  &.grey {
    .circle {
      background: var(--bg-white);
    }
    .icon,
    .left-block-title {
      color: var(--font-disable);
    }
  }
  .circle {
    width: 80px;
    height: 80px;
    border-radius: 100%;
  }
}
.elliptic {
  border: 1px solid var(--line-brand);
  background: var(--bg-brand);
  height: 26px;
  border-radius: 15px;
  padding: 0 6px;
}
.section {
  padding: 24px;
  background-color: var(--bg-white);
  border-radius: 6px;
}
.bill-item {
  margin-top: 24px;
  display: flex;
  .bill-item-col {
    text-align: right;
    color: var(--font-hint);
    font-size: 13px;
    font-weight: 500;
    width: 82px;
    margin-left: 12px;
    &.header {
      text-align: left;
      width: 200px;
      margin-right: 12px;
      .l-label {
        font-size: 16px;
        font-weight: 600;
        color: var(--font-primary);
        height: 16px;
        line-height: 16px;
        margin-top: 0;
      }
      .l-money {
        font-size: 20px;
        font-weight: 600;
        color: var(--brand-blue);
        height: 20px;
        line-height: 20px;
      }
      .s-label {
        display: inline-block;
      }
    }
    .l-label {
      font-size: 13px;
      color: var(--font-primary);
      margin-top: 0;
    }
    .l-money {
      font-size: 13px;
      color: var(--font-primary);
      height: 20px;
      line-height: 20px;
      margin-top: 4px;
    }
    & > div {
      margin-top: 12px;
      height: 13px;
      line-height: 13px;
    }
    .s-label {
      display: none;
    }
  }
}
</style>
