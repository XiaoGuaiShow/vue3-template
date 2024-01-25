<template>
  <div class="container">
    <div class="section">
      <div class="flex ai-c jc-sb">
        <el-select v-model="activeContractId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.paperCode"
            :value="item.id"
            @change="optionChange" />
        </el-select>
        <div class="link" @click="download">合同预览</div>
      </div>

      <div>
        <div class="block-title">合作信息</div>
        <div class="flex-box">
          <div class="text-form">
            <div class="label">结算方式</div>
            <div class="value">
              {{ RULE_SETTLEMENT_TYPE.get(details.contractSettlement.settlementType) }}
            </div>
          </div>
          <div class="text-form">
            <div class="label">结算账期</div>
            <div class="value">{{ details.contractSettlement.settlementPeriodDesc }}</div>
          </div>
          <div class="text-form">
            <div class="label">授信额度</div>
            <div class="value">{{ details.contractSettlement.quota }}</div>
          </div>
          <div class="text-form">
            <div class="label">结算单维度</div>
            <div class="value">
              {{ SETTLEMENT_DIMENSION.get(details.contractSettlement.dimension) || '--' }}
            </div>
          </div>
          <div class="text-form">
            <div class="label">合同开始</div>
            <div class="value">{{ details.contractSettlement.startDate || '--' }}</div>
          </div>
          <div class="text-form">
            <div class="label">合同结束</div>
            <div class="value">{{ details.contractSettlement.endDate || '--' }}</div>
          </div>
          <div class="text-form">
            <div class="label">最晚回款日</div>
            <div class="value">{{ details.contractSettlement.latestPaymentDateDesc || '--' }}</div>
          </div>
          <div class="text-form">
            <div class="label">签约主体</div>
            <div class="value">{{ details.contractSettlement.contractSignMain || '--' }}</div>
          </div>
        </div>
        <div class="flex">
          <div class="flex-1 mr-24">
            <div class="block-title">开票规则</div>
            <div class="flex-box">
              <div class="text-form">
                <div class="label">开票维度</div>
                <div class="value">{{ details.dimension.dimensionName || '--' }}</div>
              </div>
            </div>
          </div>
          <div class="flex-1">
            <div class="block-title flex ai-c jc-sb">
              结算员信息
              <div class="link" @click="visible = true">编辑</div>
            </div>
            <div class="flex-box">
              <div class="text-form">
                <div class="label">结算员</div>
                <div class="value">{{ details.accountUser.memberName || '--' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section mt-12">
      <el-tabs v-model="activeName">
        <el-tab-pane label="收费信息" name="first">
          <div v-for="item in chargeInfos" :key="item.key">
            <div class="block-title">{{ item.label }}</div>
            <div class="flex wrap inner-box mt-12">
              <div class="text-form" v-for="item2 in item.children" :key="item2.key">
                <div class="label">{{ item2.label }}</div>
                <div class="value">{{ computedQuota(item.key, item2.key) }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="赠送信息" name="second">
          <!-- <div class="totle-box">
            <div class="total-box-item left">
              <div class="label">赠送总价值</div>
              <div class="number">￥800000.00</div>
            </div>
            <div class="total-box-item ml-12">
              <div class="label">剩余价值</div>
              <div class="number">￥10000.00</div>
            </div>
          </div> -->
          <div v-for="(item, index) in giveInfos" :key="index">
            <div class="block-title">{{ item.label }}</div>
            <div class="flex wrap inner-box mt-12">
              <div class="text-form" v-for="(item2, index2) in item.children" :key="index2">
                <div class="label">{{ item2.label }}</div>
                <div class="value">{{ item2.value || '--' }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <GroupSelector
    v-if="visible"
    :popSelectType="2"
    @onOk="handleInnerDialogConfirm"
    @update:visible="(e) => (visible = e)" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getContractList, getContractDetails, saveSettlementUser } from '@/api/rules'
import {
  RULE_SETTLEMENT_TYPE,
  SETTLEMENT_DIMENSION,
  YES_OR_NO,
  PRODUCT_TYPE
} from '@/common/static'
import GroupSelector from '@/components/biz/GroupSelector/index.vue'
import { ElMessage } from 'element-plus'

const visible = ref(false)
const settleMembers = ref<any[]>([])
interface OptionItem {
  id: string
  paperCode: string
  annex: string
}
const options: Ref<OptionItem[]> = ref([])
const activeContractId = ref('')
const downloadUrl = ref('')
getContractList().then((res) => {
  if (res.code === '0000') {
    if (res.data?.length) {
      options.value = res.data
      activeContractId.value = res.data[0].id
      downloadUrl.value = res.data[0].annex
      getDetails(activeContractId.value)
    }
  }
})

const loading = ref(false)
const details: any = reactive({
  accountUser: {},
  contractSettlement: {
    settlementType: 0,
    quota: 0,
    settlementPeriodDesc: '',
    dimension: '--',
    startDate: '--',
    endDate: '--'
  },
  dimension: {}
})
const giveInfos = ref([
  {
    label: '国内酒店',
    key: 1,
    children: [
      {
        label: '集团托管',
        key: 11,
        value: ''
      },
      {
        label: '单体托管',
        key: 12,
        value: ''
      },
      {
        label: '满减券',
        key: 13,
        value: ''
      }
    ]
  },
  {
    label: '国内机票',
    key: 5,
    children: [
      {
        label: '航空意外险',
        key: 51,
        value: ''
      },
      {
        label: '航班延误险',
        key: 52,
        value: ''
      },
      {
        label: '协议托管',
        key: 53,
        value: ''
      },
      {
        label: '行程单打印',
        key: 54,
        value: ''
      },
      {
        label: '满减券',
        key: 55,
        value: ''
      }
    ]
  },
  {
    label: '火车票',
    key: 6,
    children: [
      {
        label: '旅行意外险',
        key: 61,
        value: ''
      },
      {
        label: '免登录购票',
        key: 62,
        value: ''
      },
      {
        label: '免核验购票',
        key: 63,
        value: ''
      },
      {
        label: '极速出票',
        key: 64,
        value: ''
      },
      {
        label: '火车票代取',
        key: 65,
        value: ''
      }
    ]
  },
  {
    label: '用车',
    key: 7,
    children: [
      {
        label: '协议托管',
        key: 71,
        value: ''
      }
    ]
  },
  {
    label: '系统对接',
    key: 50,
    children: [
      {
        label: '开发费用',
        key: 501,
        value: ''
      },
      {
        label: '标准实施',
        key: 502,
        value: ''
      }
    ]
  },
  {
    label: '公共',
    key: 51,
    children: [
      {
        label: 'SaaS返还',
        key: 511,
        value: ''
      },
      {
        label: '使用月数',
        show: true,
        key: 'months',
        value: ''
      },
      { label: '适用范围', key: 'range', show: true, value: '' }
    ]
  },
  {
    label: '跨合同顺延',
    key: 'custom_01',
    show: true,
    children: [{ label: '是否允许', key: 'isCrossContractExtension', show: true, value: '' }]
  }
])
function getDetails(id: string) {
  loading.value = true
  getContractDetails(id).then((res) => {
    if (res.code === '0000') {
      if (res.data) {
        details.accountUser = res.data.accountUser || {}
        res.data.contractSettlement && (details.contractSettlement = res.data.contractSettlement)
        details.dimension = res.data.dimension || {}
        giveInfos.value = filterGiveResults(
          giveInfos.value,
          details.contractSettlement.giveMap,
          details.contractSettlement
        )
        // 赋值选中结算员
        settleMembers.value = [
          {
            CustomerId: res.data.accountUser.memberId,
            Name: res.data.accountUser.memberName
          }
        ]
      }
    }
    loading.value = false
  })
}

const activeName = ref('first')

const chargeInfos = ref([
  {
    label: '国内酒店',
    key: 1,
    children: [
      { label: '预订服务费(线上)', key: 1, value: '' },
      { label: '预订服务费(线下)', key: -1, value: '' },
      { label: '退订服务费(线上)', key: 3, value: '' },
      { label: '退订服务费(线下)', key: -3, value: '' },
      { label: '集团托管服务费', key: 42, value: '' },
      { label: '单体托管服务费', key: 41, value: '' }
    ]
  },
  {
    label: '国际酒店',
    key: 11,
    children: [
      { label: '预订服务费(线上)', key: 1, value: '' },
      { label: '预订服务费(线下)', key: -1, value: '' },
      { label: '退订服务费(线上)', key: 3, value: '' },
      { label: '退订服务费(线下)', key: -3, value: '' },
      { label: '集团托管服务费', key: 42, value: '' },
      { label: '单体托管服务费', key: 41, value: '' }
    ]
  },
  {
    label: '国内机票',
    key: 5,
    children: [
      { label: '预订服务费(线上)', key: 1, value: '' },
      { label: '预订服务费(线下)', key: -1, value: '' },
      { label: '改签服务费(线上)', key: 2, value: '' },
      { label: '改签服务费(线下)', key: -2, value: '' },
      { label: '退订服务费(线上)', key: 3, value: '' },
      { label: '退订服务费(线下)', key: -3, value: '' },
      { label: '托管服务费', key: 4, value: '' },
      { label: '行程单打印费', key: 5, value: '' }
    ]
  },
  {
    label: '国际机票',
    key: 51,
    children: [
      { label: '预订服务费(线上)', key: 1, value: '' },
      { label: '预订服务费(线下)', key: -1, value: '' },
      { label: '改签服务费(线上)', key: 2, value: '' },
      { label: '改签服务费(线下)', key: -2, value: '' },
      { label: '退订服务费(线上)', key: 3, value: '' },
      { label: '退订服务费(线下)', key: -3, value: '' },
      { label: '托管服务费', key: 4, value: '' },
      { label: '行程单打印费', key: 5, value: '' }
    ]
  },
  {
    label: '火车票',
    key: 6,
    children: [
      { label: '预订服务费(线上)', key: 1, value: '' },
      { label: '预订服务费(线下)', key: -1, value: '' },
      { label: '改签服务费(线上)', key: 2, value: '' },
      { label: '改签服务费(线下)', key: -2, value: '' },
      { label: '退订服务费(线上)', key: 3, value: '' },
      { label: '退订服务费(线下)', key: -3, value: '' },
      { label: '火车票代取费', key: 9, value: '' }
    ]
  },
  {
    label: '用车',
    key: 7,
    children: [
      { label: '预订服务费(线上)', key: 1, value: '' },
      { label: '托管服务费', key: 4, value: '' }
    ]
  },
  {
    label: '外卖',
    key: 10,
    children: [{ label: '预订服务费(线上)', key: 1, value: '' }]
  },
  {
    label: '商务卡',
    key: 100,
    children: [{ label: '支付服务费', key: 6, value: '' }]
  },
  {
    label: '公共',
    key: 101,
    children: [
      { label: '垫资费', key: 7, value: '' },
      { label: '滞纳金', key: 8, value: '' }
    ]
  }
])

const computedQuota = computed(() => {
  const chargeMap = details.contractSettlement.chargeMap
  return (productType: number, itemId: number) => {
    if (chargeMap) {
      const values = chargeMap[productType]
      if (values && values.length) {
        const findItem = values.find((item: any) => item.item === itemId)
        if (findItem) {
          return findItem.quota
        }
      }
    }
    return '--'
  }
})

function filterGiveResults(staticResults: any, giveMap: any, obj: any) {
  if (giveMap) {
    const productTypes = Object.keys(giveMap).map((it) => Number(it))
    const results = staticResults
      .filter((item: any) => {
        return productTypes.includes(item.key) || item.show === true
      })
      .map((item: any) => {
        const itemIds = (giveMap[item.key] || []).map((item2: any) => item2.item)
        return {
          ...item,
          children: item.children
            .filter((item2: any) => {
              return itemIds.includes(item2.key) || item2.show === true
            })
            .map((item2: any) => {
              const giveItem = (giveMap[item.key] || []).find(
                (item3: any) => item3.item === item2.key
              )
              const res = {
                ...item2,
                value: (giveItem?.quota || '') + (giveItem?.unitDesc || '')
              }
              if (item2.key === 'isCrossContractExtension') {
                res.value = YES_OR_NO.get(obj.isCrossContractExtension)
              }
              if (item2.key === 'months') {
                res.value = obj.months + '个月'
              }
              if (item2.key === 'range') {
                res.value = (obj.productTypes || [])
                  .map((type: number) => PRODUCT_TYPE.get(type))
                  .join('、')
              }
              return res
            })
        }
      })
    return results
  }
  return []
}

const handleInnerDialogConfirm = (data: any) => {
  console.log(data)
  if (data?.list?.length > 0) {
    const user = data.list[0]
    // const enterpriseId = JSON.parse(localStorage.getItem('EnterpriseId') || '{}').data
    // const userInfo = JSON.parse(localStorage.getItem('EnterpriseId') || '{}').data
    const params = {
      // enterpriseId: enterpriseId,
      // enterpriseName: '',
      // memberId: 0,
      // memberIdStr: '',
      settleMembers: [
        {
          jobNo: user.SIId,
          memberId: user.CustomerId,
          memberName: user.Name
        }
      ]
      // userName: ''
    }
    saveSettlementUser(params).then((res) => {
      if (res.code === '0000') {
        ElMessage.success('编辑成功')
        getDetails(activeContractId.value)
      }
    })
  }
}

const download = () => {
  if (downloadUrl.value) {
    window.open(downloadUrl.value, '_blank')
  }
}

const optionChange = (val: string) => {
  const findItem = options.value.find((item) => item.id === val)
  if (findItem) {
    downloadUrl.value = findItem.annex
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 12px;
  background-color: rgb(242, 243, 245);
}
.section {
  padding: 24px;
  background-color: var(--bg-white);
  border-radius: 8px;
}
.block-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--font-primary);
  margin-top: 24px;
}
.flex-box {
  display: flex;
  flex-wrap: wrap;
  background: var(--bg-warning);
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
}
.text-form {
  width: 50%;
  height: 28px;
  display: flex;
  align-items: center;
  .label {
    color: var(--font-hint);
    font-size: 13px;
    width: 65px;
    margin-right: 12px;
    white-space: nowrap;
  }
  .value {
    color: var(--font-primary);
    font-size: 13px;
  }
}
.inner-box {
  background: var(--bg-brand);
  padding: 12px 12px 0 12px;
  border-radius: 8px;
  .text-form {
    width: 25%;
    margin-bottom: 12px;
    .label {
      width: 100px;
    }
  }
}
.link {
  color: var(--brand-blue);
  cursor: pointer;
  font-size: 14px;
}
:deep(.el-tabs__item) {
  font-size: 16px;
  color: var(--font-secondary);
}
:deep(.el-tabs__item.is-active) {
  color: var(--brand-blue);
}
:deep(.el-tabs__active-bar) {
  background-color: var(--brand-blue);
}

.totle-box {
  padding: 24px;
  border-radius: 6px;
  background: var(--bg-brand);
  display: flex;
  align-items: center;
  .total-box-item {
    width: 50%;
    &.left {
      border-right: 1px solid var(--line-rest);
    }
    .label {
      color: var(--font-secondary);
      font-size: 16px;
      margin-bottom: 6px;
    }
    .number {
      font-size: 20px;
      font-weight: 600;
      color: var(--font-primary);
    }
  }
}
</style>
