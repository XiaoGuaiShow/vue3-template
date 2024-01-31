<template>
  <div class="mt-24 flex jc-sb ai-c">
    <el-select v-model="params.invoiceTitle" placeholder="请选择" clearable>
      <el-option v-for="(item, index) in enterpriseList" :key="index" :label="item" :value="item" />
    </el-select>
    <div class="link" v-if="from === 'invoiceDetail' && isAllDownload" @click="handleDownload()">
      批量下载
    </div>
  </div>

  <el-table
    class="mt-12 my-table"
    :data="tableData"
    stripe
    border
    :max-height="from === 'invoiceDetail' ? 560 : 280"
    v-loading="loading">
    <el-table-column type="index" label="开票编号" width="80" align="center">
      <template #default="{ $index }">
        {{ (pageVO.pageIndex - 1) * pageVO.pageSize + ($index + 1) }}
      </template>
    </el-table-column>
    <el-table-column prop="seller" label="销售主体" show-overflow-tooltip>
      <template #default="{ row }">
        <span>{{ row.seller || '--' }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-if="from === 'invoiceDetail'"
      prop="invoiceTitle"
      label="开票单位"
      show-overflow-tooltip>
      <template #default="{ row }">
        <span>{{ row.invoiceTitle || '--' }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="invoiceTitle" label="开票单位" v-if="from === 'confirmationDialog'">
      <template #default="{ row }">
        <el-popover :width="420">
          <template #reference>
            <span class="c-brand-blue ellipsis-1">{{ row.invoiceTitle }}</span>
          </template>
          <div class="popover-form">
            <div class="flex">
              <div class="label">开票单位</div>
              <div>{{ row.invoiceTitle }}</div>
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
        {{ PRODUCT_TYPE_PART.get(row.productType) || '--' }}
      </template>
    </el-table-column>
    <el-table-column prop="invoiceType" label="开票类型" align="center" show-overflow-tooltip>
      <template #default="{ row }">
        {{
          INVOICE_CATEGORY.get(row.category) +
          '(' +
          (INVOICE_TYPE.get(row.invoiceType) || '--') +
          ')'
        }}
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
        <div class="color-success">{{ INVOICE_STATUS.get(row.invoiceStatus) || '-' }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="mailAddress" label="邮寄信息" align="center" width="180">
      <template #default="{ row }">
        <div class="flex nowrap">
          <span class="ellipsis-1" v-if="from === 'invoiceDetail'">{{ row.mailAddress }}</span>
          <el-popover :width="420" v-else>
            <template #reference>
              <span class="c-brand-blue ellipsis-1 w-full">
                {{ row.mailAddress }}
              </span>
            </template>
            <div class="popover-form">
              <div class="flex">
                <div class="label">收件人</div>
                <div>{{ row.mailUserName }}</div>
              </div>
              <div class="flex">
                <div class="label">联系电话</div>
                <div>{{ row.mailUserPhone }}</div>
              </div>
              <div class="flex">
                <div class="label">邮寄地址</div>
                <div>{{ row.mailAddress }}</div>
              </div>
            </div>
          </el-popover>
          <span
            class="link ml-8 no-wrap"
            v-if="from === 'confirmationDialog'"
            @click="openDialog(row)">
            更改
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="trackingNumber"
      label="快递单号"
      align="center"
      v-if="from === 'invoiceDetail'">
      <template #default="{ row }">
        <div>{{ row.trackingNumber || '--' }}</div>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="80" v-if="from === 'invoiceDetail'">
      <template #default="{ row }">
        <span class="link" v-if="row.isDownload" @click="handleDownload(row.invoiceId)">下载</span>
        <span v-else>--</span>
      </template>
    </el-table-column>
    <el-table-column label="备注" align="center" width="126" v-if="from === 'confirmationDialog'">
      <template #default="{ row }">
        <el-input
          v-model="row.remark"
          placeholder="填写（选填）"
          v-if="row.category === 0"
          @blur="handleModify(row)"></el-input>
        <span v-else>--</span>
      </template>
    </el-table-column>
  </el-table>

  <div class="flex jc-sb ai-c mt-16">
    <div class="left-text">
      <span class="mr-16">合计 ¥{{ sumInvoiceAmount }}</span>
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
    <!-- <MailingInformation
      :enterpriseId="enterpriseId"
      :invoiceId="rowInvoiceId"
      :rowData="rowData"
      v-if="showMailingInformation"
      @close="showMailingInformation = false"
      @confirm="getTableList" /> -->
    <AddressListDialog
      v-if="showMailingInformation"
      @close="showMailingInformation = false"
      @on-confirm="handleConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getInvoiceList } from '@/api/bill'
import { getInvoiceTitleList, downloadInvoice, modifyInvoiceItem } from '@/api/invoice'
import type { InvoiceListItem } from '@/pages/bill/types'
import { PRODUCT_TYPE_PART, INVOICE_TYPE, INVOICE_STATUS, INVOICE_CATEGORY } from '@/common/static'
// import MailingInformation from '@/pages/bill/components/MailingInformation.vue'
import { ElMessage } from 'element-plus'
import AddressListDialog from '@/pages/parentCompany/components/CompanyInfo/AddressListDialog.vue'

const props = withDefaults(
  defineProps<{ from: string; periodId: string | number; enterpriseId: string | number }>(),
  {
    from: 'invoiceDetail',
    periodId: '',
    enterpriseId: ''
  }
)
const { from } = toRefs(props)
const enterpriseList: Ref<any[]> = ref([])
const showMailingInformation = ref(false)
const rowInvoiceId = ref('')
const rowData = ref<any>()
const openDialog = (row: any) => {
  rowData.value = row
  rowInvoiceId.value = row.invoiceId
  showMailingInformation.value = true
}
getInvoiceTitleList({
  periodId: props.periodId,
  enterpriseId: props.enterpriseId
}).then((res) => {
  if (res.code === '0000') {
    enterpriseList.value = res.data || []
  }
})

const handleModify = (row: any) => {
  modifyInvoiceItem({
    mailAddress: row.mailAddress,
    mailUserName: row.mailUserName,
    mailUserPhone: row.mailUserPhone,
    enterpriseId: props.enterpriseId,
    invoiceId: row.invoiceId,
    remark: row.remark
  }).then((res) => {
    if (res.code === '0000') {
      ElMessage.success('保存成功')
    }
  })
}

const handleConfirm = (row: any) => {
  modifyInvoiceItem({
    mailAddress: row.address,
    mailUserName: row.receiver,
    mailUserPhone: row.receiverPhone,
    enterpriseId: props.enterpriseId,
    invoiceId: rowInvoiceId,
    remark: row.remark
  }).then((res) => {
    if (res.code === '0000') {
      ElMessage.success('保存成功')
      getTableList()
    }
  })
}

const pageVO = reactive({
  pageSize: 10,
  pageIndex: 1
})
const params = reactive({
  invoiceTitle: '',
  enterpriseId: props.enterpriseId,
  periodId: props.periodId
})
const total = ref(0)
const loading = ref(false)
const tableData: Ref<Partial<InvoiceListItem>[]> = ref([])
const sumInvoiceAmount = ref(0)
const isAllDownload = ref(false)

watchEffect(() => {
  loading.value = true
  getInvoiceList({
    ...params,
    pageIndex: pageVO.pageIndex,
    pageSize: pageVO.pageSize
  })
    .then((res) => {
      if (res.code === '0000') {
        if (res.data) {
          tableData.value = res.data.results || []
          total.value = res.data.total || 0
          sumInvoiceAmount.value = res.data.sumInvoiceAmount || 0
          isAllDownload.value = res.data.isAllDownload || false
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
})
const handleSizeChange = (val: number) => {
  pageVO.pageSize = val
  pageVO.pageIndex = 1
}
const handleCurrentChange = (val: number) => {
  pageVO.pageIndex = val
}

function getTableList() {
  loading.value = true
  getInvoiceList({
    ...params,
    pageIndex: pageVO.pageIndex,
    pageSize: pageVO.pageSize
  })
    .then((res) => {
      if (res.code === '0000') {
        if (res.data) {
          tableData.value = res.data.results || []
          total.value = res.data.total || 0
          sumInvoiceAmount.value = res.data.sumInvoiceAmount || 0
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const handleDownload = (invoiceId?: string) => {
  const params = {
    periodId: props.periodId,
    invoiceId
  }
  if (!invoiceId) {
    Reflect.deleteProperty(params, 'invoiceId')
  }
  downloadInvoice(params)
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
