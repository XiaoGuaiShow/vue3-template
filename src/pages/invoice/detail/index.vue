<template>
  <div class="container">
    <div class="section">
      <div class="title fs-18 flex ai-c">
        账期
        <div class="blue-tab ml-12">{{ pageDetail.periodRange }}</div>
      </div>
      <div class="yellow-block mt-24">
        <div class="yellow-block-item">
          <div class="item-title">本期开票金额</div>
          <div class="item-money">
            <span class="number fs-24">{{ pageDetail.sumInvoiceAmount }}</span>
            <span class="unit">元</span>
          </div>
        </div>
        <div class="yellow-block-item">
          <div class="item-title">增值税发票</div>
          <div class="item-money">
            <span class="number fs-20">{{ pageDetail.vatInvoiceAmount }}</span>
            <span class="unit">元</span>
          </div>
        </div>
        <div class="yellow-block-item">
          <div class="item-title">行程单</div>
          <div class="item-money">
            <span class="number fs-20">{{ pageDetail.printInvoiceAmount }}</span>
            <span class="unit">元</span>
          </div>
        </div>
        <div class="yellow-block-item">
          <div class="item-title">票根</div>
          <div class="item-money">
            <span class="number fs-20">{{ pageDetail.takeoutInvoiceAmount }}</span>
            <span class="unit">元</span>
          </div>
        </div>
      </div>
      <div class="title mt-24 fs-16">票据</div>
      <InvoiceTable
        from="invoiceDetail"
        :periodId="billStore.invoiceHistory.periodId"
        :enterpriseId="billStore.invoiceHistory.enterpriseId"></InvoiceTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InvoiceTable from '@/pages/invoice/components/InvoiceTable.vue'
import { getInvoiceHistoryDetail } from '@/api/invoice'
import { useBillStore } from '@/store/modules/bill'
const billStore = useBillStore()
const pageDetail: any = reactive({
  periodRange: '',
  sumInvoiceAmount: 0,
  vatInvoiceAmount: 0,
  printInvoiceAmount: 0,
  takeoutInvoiceAmount: 0
})
if (billStore.invoiceHistory.periodId && billStore.invoiceHistory.enterpriseId) {
  getInvoiceHistoryDetail({
    periodId: billStore.invoiceHistory.periodId as string,
    enterpriseId: billStore.invoiceHistory.enterpriseId as string
  }).then((res) => {
    if (res.code === '0000') {
      if (res.data) {
        pageDetail.periodRange = res.data.periodRange
        pageDetail.sumInvoiceAmount = res.data.sumInvoiceAmount || 0
        pageDetail.vatInvoiceAmount = res.data.vatInvoiceAmount || 0
        pageDetail.printInvoiceAmount = res.data.printInvoiceAmount || 0
        pageDetail.takeoutInvoiceAmount = res.data.takeoutInvoiceAmount || 0
      }
    }
  })
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
.title {
  font-weight: 600;
  color: var(--font-primary);
}
.blue-tab {
  background-color: var(--bg-select);
  height: 36px;
  line-height: 20px;
  border-radius: 4px;
  padding: 8px;
  color: var(--brand-blue);
  font-size: 20px;
  font-weight: 600;
  box-sizing: border-box;
}

.yellow-block {
  width: 100%;
  padding: 24px;
  background-color: var(--bg-warning);
  display: flex;
  box-sizing: border-box;
  .yellow-block-item {
    flex: 1;
    .item-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--font-secondary);
    }
    .item-money {
      height: 32px;
      line-height: 32px;
      margin-top: 6px;
    }
    .number {
      font-weight: 600;
      color: var(--font-primary);
    }
    .unit {
      font-size: 14px;
      color: var(--font-hint);
      margin-left: 4px;
    }
  }
}
</style>
