import { Script } from 'vm';
<template>
  <div class="flex ai-c">
    <div class="flex col ai-c item">
      <div class="title">本期消费</div>
      <div class="money">￥8000.00</div>
      <div class="btn">查看</div>
    </div>
    <img :src="plusImg" />
    <div class="flex col ai-c item">
      <div class="title flex ai-c">
        <span class="mr-4">上期未结</span>
        <el-popover placement="top" :width="360">
          <template #reference>
            <svg-icon name="tip" size="14" color="#bfbfbf"></svg-icon>
          </template>
          <div class="flex ai-c">
            <el-icon class="mr-6" color="#fab938"><WarningFilled /></el-icon>
            上期异议及未取回票据，已自动结转到本期结算
          </div>
        </el-popover>
      </div>
      <div class="money">￥8000.00</div>
      <div class="btn">查看</div>
    </div>
    <img :src="minusImg" />
  </div>
</template>

<script lang="ts" setup>
import plusImg from '@/assets/images/bill/plus.png'
import minusImg from '@/assets/images/bill/minus.png'
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
  }
}
</style>
