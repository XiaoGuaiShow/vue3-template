<template>
  <div class="mt-24 flex jc-sb ai-c">
    <el-select v-model="enterpriseId" placeholder="请选择">
      <el-option
        v-for="item in enterpriseList"
        :key="item.enterpriseId"
        :label="item.enterpriseName"
        :value="item.enterpriseId" />
    </el-select>
    <div class="link" v-if="from === 'invoiceDetail'">批量下载</div>
  </div>

  <el-table class="mt-12 my-table" :data="tableData" stripe border max-height="250">
    <el-table-column prop="invoiceSerialNo" label="开票编号" width="80" />
    <el-table-column prop="seller" label="销售主体" show-overflow-tooltip>
      <template #default="{ row }">
        <div>{{ row.seller || '--' }}</div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="from === 'invoiceDetail'"
      prop="name"
      label="开票单位"
      show-overflow-tooltip>
      <template #default="{ row }">
        <span>{{ row.name || '--' }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="buyer" label="开票单位" v-if="from === 'confirmationDialog'">
      <template #default="{ row }">
        <el-popover :width="420">
          <template #reference>
            <span class="c-brand-blue ellipsis-1">{{ row.buyer }}</span>
          </template>
          <div class="popover-form">
            <div class="flex">
              <div class="label">开票单位</div>
              <div>{{ row.buyer }}</div>
            </div>
            <div class="flex">
              <div class="label">发票税号</div>
              <div>{{ row.taxNo }}</div>
            </div>
            <div class="flex">
              <div class="label">公司地址</div>
              <div>
                {{ row.companyAddress }}
              </div>
            </div>
            <div class="flex">
              <div class="label">公司电话</div>
              <div>{{ row.companyPhone }}</div>
            </div>
            <div class="flex">
              <div class="label">开户银行</div>
              <div>{{ row.companyBank }}</div>
            </div>
            <div class="flex">
              <div class="label">银行账号</div>
              <div>{{ row.companyBankNo }}</div>
            </div>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="productType" label="业务线" align="center">
      <template #default="{ row }">
        {{ PRODUCT_TYPE.get(row.productType) || '--' }}
      </template>
    </el-table-column>
    <el-table-column prop="invoiceType" label="开票类型" align="center" show-overflow-tooltip>
      <template #default="{ row }">
        {{ INVOICE_TYPE.get(row.invoiceType) || '--' }}
      </template>
    </el-table-column>
    <el-table-column prop="item" label="开票类目" align="center" show-overflow-tooltip />
    <el-table-column prop="invoiceAmount" label="开票金额" align="center" />
    <el-table-column prop="remark" label="备注" align="center" v-if="from === 'invoiceDetail'">
      <template #default="{ row }">
        <div>{{ row.remark || '--' }}</div>
      </template>
    </el-table-column>
    <el-table-column
      prop="invoiceStatus"
      label="状态"
      align="center"
      v-if="from === 'invoiceDetail'">
      <template #default="{ row }">
        <div class="color-success">{{ row.invoiceStatus }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="email" label="邮寄信息" align="center" width="180">
      <template #default="{ row }">
        <div class="flex nowrap">
          <span class="ellipsis-1" v-if="row.emailType === '电子'">{{ row.email }}</span>
          <el-popover :width="420" v-else>
            <template #reference>
              <span class="c-brand-blue ellipsis-1">
                {{ row.email }}
              </span>
            </template>
            <div class="popover-form">
              <div class="flex">
                <div class="label">收件人</div>
                <div>苏州思科信息技术有限公司</div>
              </div>
              <div class="flex">
                <div class="label">联系电话</div>
                <div>871092819JLKNEEW</div>
              </div>
              <div class="flex">
                <div class="label">邮寄地址</div>
                <div>
                  江苏省苏州市吴中区七星街道协鑫广场20L苏州思客科技（集团）有限公司2001，2002，2003单元
                </div>
              </div>
            </div>
          </el-popover>
          <span class="link ml-8 no-wrap">更改</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="sf" label="快递单号" align="center" v-if="from === 'invoiceDetail'">
      <template #default="{ row }">
        <div>{{ row.sf || '--' }}</div>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="74" v-if="from === 'invoiceDetail'">
      <template #default>
        <div class="link">下载</div>
      </template>
    </el-table-column>
    <el-table-column label="备注" align="center" width="126" v-if="from === 'confirmationDialog'">
      <template #default="{ row }">
        <el-input v-model="row.remark" placeholder="填写（选填）"></el-input>
      </template>
    </el-table-column>
  </el-table>

  <div class="flex jc-sb ai-c mt-16">
    <div class="left-text">
      <span class="mr-16">合计 ¥6,000.00</span>
    </div>
    <el-pagination
      v-model:current-page="pageVO.pageIndex"
      v-model:page-size="pageVO.pageSize"
      small
      :page-sizes="[5, 10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBillStore } from '@/store/modules/bill'
import { getInvoiceList } from '@/api/bill'
import type { InvoiceListItem } from '@/pages/bill/types'
import { PRODUCT_TYPE, INVOICE_TYPE } from '@/common/static'

const billStore = useBillStore()
console.log('billstore', billStore)
const props = withDefaults(defineProps<{ from: string; periodId: number }>(), {
  from: 'invoiceDetail',
  periodId: 0
})
const { from } = toRefs(props)
const enterpriseId = ref<number>(0)
const enterpriseList: Ref<any[]> = ref([])
if (props.from === 'confirmationDialog') {
  enterpriseList.value = billStore.enterpriseList
  enterpriseId.value = billStore.enterpriseId
}

const pageVO = {
  pageSize: 10,
  pageIndex: 1
}
const params = {
  enterpriseId: enterpriseId.value,
  periodId: props.periodId
}
const total = ref(0)
const loading = ref(false)
const tableData: Ref<Partial<InvoiceListItem>[]> = ref([])
watchEffect(() => {
  loading.value = true
  getInvoiceList({
    ...params,
    ...pageVO
  }).then((res) => {
    console.log(res)
  })
  setTimeout(() => {
    loading.value = false
    tableData.value = [
      {
        id: 2,
        invoiceSerialNo: '1',
        seller: '001',
        buyer: '苏州思客信息技术有限公司',
        taxNo: 'efqwefq323132121',
        companyAddress: '江苏省',
        companyPhone: '0512-3191313122',
        companyBank: '中国银行',
        companyBankNo: '121312132312',
        productType: 1,
        invoiceType: 1,
        item: '经纪代理服务*服务费',
        invoiceAmount: 20000,
        remark: ''
      }
    ]
  }, 1500)
})
const handleSizeChange = (val: number) => {
  pageVO.pageSize = val
  pageVO.pageIndex = 1
}
const handleCurrentChange = (val: number) => {
  pageVO.pageIndex = val
}
</script>

<style scoped lang="less">
.link {
  font-size: 14px;
  color: var(--font-link);
  cursor: pointer;
}
.color-success {
  color: var(--tip-success);
}
.left-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--font-primary);
}
.my-table :deep(.el-input .el-input__wrapper) {
  background: none;
  box-shadow: unset;
}
.popover-form {
  font-size: 12px;
  color: var(--font-primary);
  & > div {
    margin-bottom: 12px;
    &:last-child {
      margin: 0;
    }
  }
  .label {
    width: 60px;
    flex-shrink: 0;
    margin-right: 12px;
  }
}
.no-wrap {
  white-space: nowrap;
}
</style>
