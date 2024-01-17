import { Script } from 'vm';
<template>
  <div class="flex ai-c jc-sb">
    <div class="flex col ai-c item" v-if="typeof summary.totalPrice === 'number'">
      <div class="title">本期消费</div>
      <div class="money">￥{{ summary.totalPrice }}</div>
      <div class="btn">查看</div>
    </div>
    <img :src="plusImg" v-if="typeof summary.lastPeriodPayable === 'number'" />
    <div class="flex col ai-c item" v-if="typeof summary.lastPeriodPayable === 'number'">
      <div class="title flex ai-c">
        <span class="mr-4">上期未结</span>
        <el-popover placement="top" :width="310">
          <template #reference>
            <svg-icon name="tip" size="14" color="#bfbfbf"></svg-icon>
          </template>
          <div class="flex ai-c fs-12">
            <el-icon class="mr-4" color="#fab938" :size="14"><WarningFilled /></el-icon>
            上期异议及未取回票据，已自动结转到本期结算
          </div>
        </el-popover>
      </div>
      <div class="money">￥{{ summary.lastPeriodPayable }}</div>
      <div class="btn">查看</div>
    </div>
    <img :src="minusImg" v-if="typeof summary.dissentAmount === 'number'" />
    <div class="flex col ai-c item" v-if="typeof summary.dissentAmount === 'number'">
      <div class="title flex ai-c">
        <span class="mr-4">本期异议</span>
        <el-popover placement="top" :width="350">
          <template #reference>
            <svg-icon name="tip" size="14" color="#bfbfbf"></svg-icon>
          </template>
          <div class="flex ai-c fs-12">
            <el-icon class="mr-4" color="#fab938" :size="14"><WarningFilled /></el-icon>
            本期未处理完的异议，在确认账单后自动结转至下期结算
          </div>
        </el-popover>
      </div>
      <div class="money">￥{{ summary.dissentAmount }}</div>
      <div class="btn">查看</div>
    </div>
    <img :src="minusImg" v-if="typeof summary.unRetrievedAmount === 'number'" />
    <div class="flex col ai-c item" v-if="typeof summary.unRetrievedAmount === 'number'">
      <div class="title flex ai-c">
        <span class="mr-4">未取回票据</span>
        <el-popover placement="top" :width="430">
          <template #reference>
            <svg-icon name="tip" size="14" color="#bfbfbf"></svg-icon>
          </template>
          <div class="flex ai-c fs-12">
            <el-icon class="mr-4" color="#fab938" :size="14"><WarningFilled /></el-icon>
            本期未取回火车票票根/机票行程单，在确认账单后自动结转至下期结算
          </div>
        </el-popover>
      </div>
      <div class="money">￥{{ summary.unRetrievedAmount }}</div>
      <div class="btn">查看</div>
    </div>

    <img :src="minusImg" v-if="typeof summary.overPeriodRefundAmount === 'number'" />
    <div class="flex col ai-c item" v-if="typeof summary.overPeriodRefundAmount === 'number'">
      <div class="title flex ai-c">
        <span class="mr-4">跨账期退改</span>
        <el-popover placement="top" :width="420">
          <template #reference>
            <svg-icon name="tip" size="14" color="#bfbfbf"></svg-icon>
          </template>
          <div class="flex ai-c fs-12">
            <el-icon class="mr-4" color="#fab938" :size="14"><WarningFilled /></el-icon>
            本期订单如在下个账期产生退款，在确认账单后自动提前至本期结算。数据截至昨日 24 时
          </div>
        </el-popover>
      </div>
      <div class="money">￥{{ summary.overPeriodRefundAmount }}</div>
      <div class="btn">查看</div>
    </div>

    <img :src="equalImg" v-if="typeof summary.payable === 'number'" />
    <div class="flex col ai-c item last" v-if="typeof summary.payable === 'number'">
      <div class="title flex ai-c">
        <span class="mr-4">本期应结</span>
      </div>
      <div class="money">￥{{ summary.payable }}</div>
      <div class="btn">查看</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import plusImg from '@/assets/images/bill/plus.png'
import minusImg from '@/assets/images/bill/minus.png'
import equalImg from '@/assets/images/bill/equal.png'
import type { PeriodSumDTO } from '@/pages/bill/types'

interface Props {
  summary: Partial<PeriodSumDTO>
}
const props = withDefaults(defineProps<Props>(), {
  summary: () => ({
    totalPrice: 0, // 本期消费
    lastPeriodPayable: 0, // 上期未结
    dissentAmount: 0, // 异议金额
    unRetrievedAmount: 0, // 未取回票据
    overPeriodRefundAmount: 0, // 跨账期改退
    payable: 0 // 本期应结
  })
})
</script>

<style lang="less" scoped>
.item {
  .title {
    height: 14px;
    line-height: 14px;
    font-size: 14px;
    color: var(--font-secondary);
  }
  .money {
    font-size: 20px;
    font-weight: 600;
    height: 20px;
    line-height: 20px;
    color: var(--font-primary);
    margin: 4px 0;
  }
  .btn {
    height: 14px;
    line-height: 14px;
    color: var(--brand-blue);
    font-size: 14px;
    cursor: pointer;
  }
  &.last {
    padding: 0 46px;
  }
}
</style>
