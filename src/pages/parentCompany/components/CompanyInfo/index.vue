<template>
  <div class="company-info" v-loading="loading">
    <div class="flex jc-sb ai-c">
      <div class="title-label">{{ companyInfo.companyName || '-' }}</div>
      <el-switch
        v-model="companyInfo.isValid"
        inline-prompt
        active-text="启用"
        inactive-text="关闭"
        :active-value="1"
        :inactive-value="0"
        :before-change="beforeChange" />
    </div>
    <!-- 合作信息 -->
    <div class="box-info">
      <div class="flex jc-sb ai-c">
        <span class="info-title">合作信息</span>
      </div>
      <div class="info-content flex wrap">
        <div class="info-item">
          <span>合作模式</span>
          <span>{{ typeFilter(companyInfo.debitType) }}</span>
        </div>
      </div>
    </div>
    <!-- 财务信息 -->
    <div class="box-info">
      <div class="flex jc-sb ai-c">
        <span class="info-title">财务信息</span>
        <div class="info-title-right flex ai-c">
          <span @click="handleBalanceRemind">设置余额提醒</span>
          <span @click="goToRechargeRecords">充值</span>
        </div>
      </div>
      <div class="info-content flex wrap">
        <div class="info-item">
          <span>余额</span>
          <span>{{ companyInfo.balance || 0 }}</span>
        </div>
        <div class="info-item"></div>
        <div class="info-item">
          <span>日均消费</span>
          <span>{{ companyInfo.dailyConsumption || 0 }}元</span>
        </div>
        <div class="info-item">
          <span>可用天数</span>
          <span>{{ companyInfo.availableDays || 0 }}天</span>
        </div>
      </div>
    </div>
    <!-- 结算员信息 -->
    <div class="box-info">
      <div class="flex jc-sb ai-c">
        <span class="info-title">结算员信息</span>
        <div class="info-title-right flex ai-c">
          <span @click="handleSettlementEdit">编辑</span>
        </div>
      </div>
      <div class="info-content flex wrap">
        <div class="info-item">
          <span>结算员</span>
          <span>{{ companyInfo.settlementOfficer || '-' }}</span>
        </div>
      </div>
    </div>
    <!-- 开票单位信息 -->
    <div class="box-info">
      <div class="flex jc-sb ai-c">
        <span class="info-title">开票单位信息</span>
        <div class="info-title-right flex ai-c">
          <span @click="handleInvoiceEdit">编辑</span>
        </div>
      </div>
      <div class="info-content flex wrap">
        <div class="info-item info-item-100">
          <span>开票单位</span>
          <span>{{ companyInfo.invoiceTitles || '-' }}</span>
        </div>
      </div>
    </div>
  </div>
  <!-- 设置余额提醒 -->
  <BalanceRemind
    :visible="balanceVisible"
    :enterpriseId="companyInfo.id"
    :enterpriseName="companyInfo.companyName"
    :settlementOfficerInfos="settlementOfficerInfos"
    @on-close="balanceVisible = false"
    @on-confirm="balanceRemindConfirm"></BalanceRemind>
  <!-- 发票单位编辑 -->
  <InvoiceTitle
    v-if="invoiceVisible"
    :visible="invoiceVisible"
    @on-close="invoiceVisible = false"
    @on-confirm="invoiceTitleConfirm"></InvoiceTitle>
  <!-- 组织架构中选择 -->
  <GroupSelector
    v-if="commonVisible"
    v-model:visible="commonVisible"
    :isSingleChoice="true"
    :popSelectType="2"
    :showSettlementMember="true"
    @on-ok="handleSelectConfirm" />
</template>

<script setup lang="ts">
import { accountDetail, accountValid } from '@/api/modules/parentCompany'
import { saveSettlementUser } from '@/api/rules'
import mittBus from '@/utils/mitt.ts'
import type { CompanyInfo } from '../../types'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useZimuStore } from '@/store/modules/zimu'
const zimuStore = useZimuStore()

// 企业id
let companyId = ref<string>('')
onMounted(() => {
  // 监听点击公司列表,获取公司详情
  mittBus.on('mittGetCompanyInfo', (id: any) => {
    companyId.value = id
    getCompanyInfo(id)
  })
})

onUnmounted(() => {
  mittBus.off('mittGetCompanyInfo')
})
// 公司详情
const companyInfo = ref<CompanyInfo>({
  availableDays: 0,
  balance: 0,
  companyName: '',
  dailyConsumption: 0,
  debitType: 0,
  id: '',
  invoiceTitles: '',
  isValid: 0,
  needRecharge: 0,
  settlementOfficer: '',
  settlements: []
})
let loading = ref<boolean>(false)
const getCompanyInfo = async (id: string) => {
  loading.value = true
  try {
    loading.value = ref(true).value = true
    const res = await accountDetail({ id })
    const data = res.data as any
    companyInfo.value = data
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

// 过滤器方法
const typeFilter = (val: number) => {
  let list = [
    { value: 0, label: '无' },
    { value: 1, label: '授信垫资' },
    { value: 2, label: '单结' },
    { value: 3, label: '线下' },
    { value: 4, label: '账户充值' },
    { value: 5, label: '支付宝代扣' },
    { value: 6, label: '支付宝(单位代付)' },
    { value: 7, label: '连连支付' },
    { value: 111, label: '拉卡拉' }
  ]
  let obj = list.find((f) => f.value === val)
  return obj ? obj.label : val
}

// 公司状态
const beforeChange = async () => {
  return new Promise((resolve, reject) => {
    const stopMsg =
      '停用之前创建的订单，若需要改签支付，仍会从该账户扣款，退款也会退至此公司。\n确定要停用该公司吗？'
    const startMsg = '确认启用该子公司?'
    ElMessageBox.confirm(companyInfo.value.isValid ? stopMsg : startMsg, '提示').then(() => {
      accountValid({ id: companyInfo.value.id }).then((res: any) => {
        if (res.code === '0000') {
          ElMessage.success('操作成功')
          resolve(true)
        } else {
          ElMessage.error(res.msg)
          reject(false)
        }
      })
    })
  })
}

// 公司编辑
let commonVisible = ref<boolean>(false)
const handleSettlementEdit = () => {
  commonVisible.value = true
}
const handleSelectConfirm = (data: any) => {
  console.log(data)
  if (data && data.list) {
    const params = {
      settleMembers: [
        {
          jobNo: data.list[0].WorkCode,
          memberId: data.list[0].CustomerId,
          memberName: data.list[0].Name
        }
      ]
    }
    saveSettlementUser(params).then((res: any) => {
      if (res.code === '0000') {
        ElMessage.success('操作成功')
        commonVisible.value = false
        getCompanyInfo(companyId.value)
      } else {
        ElMessage.error(res.msg)
      }
    })
  }
}

// 设置余额提醒
const balanceVisible = ref<boolean>(false)
const settlementOfficerInfos = ref<any[]>([])

const handleBalanceRemind = () => {
  balanceVisible.value = true
}

// 设置余额提醒成功
const balanceRemindConfirm = () => {}

// 跳转充值记录页面
const goToRechargeRecords = () => {
  window.microApp.getData().pushState('/manage/#/goRecharge?enterpriseId=' + companyInfo.value.id)
}

// 发票单位编辑
const invoiceVisible = ref<boolean>(false)
const handleInvoiceEdit = () => {
  invoiceVisible.value = true
}

// 发票编辑成功
const invoiceTitleConfirm = () => {
  getCompanyInfo(companyId.value)
}
</script>

<style lang="less" scoped>
.company-info {
  background: var(--bg-white);
  border-radius: 8px;
  padding: 24px;
  .title-label {
    font-size: 16px;
    font-weight: 600;
    line-height: 16px;
    color: var(--font-primary);
  }
  :deep(.el-switch) {
    height: 20px;
  }
  .box-info {
    margin-top: 24px;
    .info-title {
      font-size: 14px;
      line-height: 14px;
      color: var(--font-primary);
    }
    .info-title-right {
      color: var(--brand-blue);
      display: flex;
      align-items: center;
      span {
        font-size: 14px;
        line-height: 14px;
        margin-left: 12px;
        cursor: pointer;
      }
    }
    .info-content {
      background: var(--bg-brand);
      padding: 12px;
      border-radius: 8px;
      margin-top: 12px;
      .info-item {
        width: 50%;
        line-height: 28px;
        display: flex;
        span:nth-child(1) {
          color: var(--font-hint);
          font-size: 13px;
          width: 65px;
          margin-right: 12px;
          align-self: flex-start;
        }
        span:nth-child(2) {
          color: var(--font-primary);
          font-size: 13px;
          flex: 1;
        }
      }
      .info-item-100 {
        width: 100%;
      }
    }
  }
}
</style>
