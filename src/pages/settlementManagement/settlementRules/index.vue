<template>
  <div class="container">
    <div class="section">
      <div class="flex ai-c jc-sb">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="link">合同预览</div>
      </div>

      <div>
        <div class="block-title">合作信息</div>
        <div class="flex-box">
          <div class="text-form">
            <div class="label">结算方式</div>
            <div class="value">授信</div>
          </div>
          <div class="text-form">
            <div class="label">结算账期</div>
            <div class="value">非自然月（上月24号-本月23号)</div>
          </div>
          <div class="text-form">
            <div class="label">授信额度</div>
            <div class="value">100000</div>
          </div>
          <div class="text-form">
            <div class="label">结算单维度</div>
            <div class="value">行程结束</div>
          </div>
          <div class="text-form">
            <div class="label">合同开始</div>
            <div class="value">2023/12/31</div>
          </div>
          <div class="text-form">
            <div class="label">合同结束</div>
            <div class="value">2024/12/31</div>
          </div>
          <div class="text-form">
            <div class="label">最晚回款日</div>
            <div class="value">15 号（授信45天）</div>
          </div>
          <div class="text-form">
            <div class="label">签约主体</div>
            <div class="value">思客信息、思客国旅、大管家</div>
          </div>
        </div>
        <div class="flex">
          <div class="flex-1 mr-24">
            <div class="block-title">开票规则</div>
            <div class="flex-box">
              <div class="text-form">
                <div class="label">开票维度</div>
                <div class="value">按预订人员所属发票抬头开票</div>
              </div>
            </div>
          </div>
          <div class="flex-1">
            <div class="block-title flex ai-c jc-sb">
              结算员信息
              <div class="link">编辑</div>
            </div>
            <div class="flex-box">
              <div class="text-form">
                <div class="label">结算员</div>
                <div class="value">张三</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section mt-12">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="收费信息" name="first">
          <div v-for="(item, index) in chargeInfos" :key="index">
            <div class="block-title">{{ item.label }}</div>
            <div class="flex wrap inner-box mt-12">
              <div
                class="text-form"
                v-for="(item2, index2) in item.children"
                :key="index2"
              >
                <div class="label">{{ item2.label }}</div>
                <div class="value">{{ item2.value || "--" }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="赠送信息" name="second">
          <div class="totle-box">
            <div class="total-box-item left">
              <div class="label">赠送总价值</div>
              <div class="number">￥800000.00</div>
            </div>
            <div class="total-box-item ml-12">
              <div class="label">剩余价值</div>
              <div class="number">￥10000.00</div>
            </div>
          </div>
          <div v-for="(item, index) in giveInfos" :key="index">
            <div class="block-title">{{ item.label }}</div>
            <div class="flex wrap inner-box mt-12">
              <div
                class="text-form"
                v-for="(item2, index2) in item.children"
                :key="index2"
              >
                <div class="label">{{ item2.label }}</div>
                <div class="value">{{ item2.value || "--" }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";

const value = ref("");
const options = ref([
  { value: 1, label: "合同编号123456" },
  { value: 2, label: "差旅打印合同" },
]);

const activeName = ref("first");
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

const chargeInfos = ref([
  {
    label: "国内酒店",
    key: "酒店",
    children: [
      { label: "预订服务费(线上)", key: "BookingServerPrice", value: "" },
      { label: "预订服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "退订服务费(线上)", key: "BookingServerPrice", value: "" },
      { label: "退订服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "集团托管服务费", key: "BookingServerPrice", value: "" },
      { label: "集团托管服务费", key: "BookingServerPrice", value: "" },
    ],
  },
  {
    label: "国际酒店",
    key: "国际酒店",
    children: [
      { label: "预订服务费(线上)", key: "BookingServerPrice", value: "" },
      { label: "预订服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "退订服务费(线上)", key: "BookingServerPrice", value: "" },
      { label: "退订服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "集团托管服务费", key: "BookingServerPrice", value: "1000" },
      { label: "集团托管服务费", key: "BookingServerPrice", value: "" },
    ],
  },
  {
    label: "国内机票",
    key: "国内机票",
    children: [
      { label: "预订服务费(线上)", key: "BookingServerPrice", value: "" },
      { label: "预订服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "改签服务费(线上)", key: "BookingServerPrice", value: "" },
      { label: "改签服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "退票服务费", key: "BookingServerPrice", value: "" },
      { label: "退票服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "托管服务费", key: "BookingServerPrice", value: "" },
      { label: "行程单打印费", key: "BookingServerPrice", value: "" },
    ],
  },
  {
    label: "国际机票",
    key: "国际机票",
    children: [
      { label: "预订服务费(线上)", key: "BookingServerPrice", value: "" },
      { label: "预订服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "改签服务费(线上)", key: "BookingServerPrice", value: "" },
      { label: "改签服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "退票服务费", key: "BookingServerPrice", value: "" },
      { label: "退票服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "托管服务费", key: "BookingServerPrice", value: "" },
      { label: "行程单打印费", key: "BookingServerPrice", value: "" },
    ],
  },
  {
    label: "火车票",
    key: "火车票",
    children: [
      { label: "预订服务费(线上)", key: "BookingServerPrice", value: "" },
      { label: "预订服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "改签服务费(线上)", key: "BookingServerPrice", value: "" },
      { label: "改签服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "退票服务费", key: "BookingServerPrice", value: "" },
      { label: "退票服务费(线下)", key: "BookingServerPrice", value: "" },
      { label: "火车票代取费", key: "BookingServerPrice", value: "" },
    ],
  },
  {
    label: "用车",
    key: "用车",
    children: [
      { label: "预订服务费(线上)", key: "BookingServerPrice", value: "" },
      { label: "托管服务费", key: "BookingServerPrice", value: "" },
    ],
  },
  {
    label: "外卖",
    key: "外卖",
    children: [
      { label: "预订服务费(线上)", key: "BookingServerPrice", value: "" },
    ],
  },
  {
    label: "商务卡",
    key: "商务卡",
    children: [{ label: "支付服务费", key: "BookingServerPrice", value: "" }],
  },
  {
    label: "公共",
    key: "公共",
    children: [
      { label: "垫资费", key: "BookingServerPrice", value: "" },
      { label: "滞纳金", key: "BookingServerPrice", value: "" },
    ],
  },
]);

const giveInfos = ref([
  {
    label: "国内酒店",
    key: "酒店",
    children: [
      {
        label: "集团托管",
        key: "BookingServerPrice",
        value: "10000元（剩余10000元）",
      },
      {
        label: "单体托管",
        key: "BookingServerPrice",
        value: "8000元（剩余8000元）",
      },
      {
        label: "满减券",
        key: "BookingServerPrice",
        value: " 8000元（剩余8000元）",
      },
    ],
  },
  {
    label: "国内机票",
    key: "国内机票",
    children: [
      {
        label: "航空意外险",
        key: "BookingServerPrice",
        value: "100张（剩余100张）",
      },
      {
        label: "航班延误险",
        key: "BookingServerPrice",
        value: "100张（剩余100张）",
      },
      {
        label: "协议托管",
        key: "BookingServerPrice",
        value: " 8000元（剩余8000元）",
      },
      {
        label: "行程单打印",
        key: "BookingServerPrice",
        value: "100张（剩余100张）",
      },
      {
        label: "满减券",
        key: "BookingServerPrice",
        value: "8000元（剩余8000元）",
      },
    ],
  },
  {
    label: "火车票",
    key: "火车票",
    children: [
      {
        label: "旅行意外险",
        key: "BookingServerPrice",
        value: " 800元（剩余800元）",
      },
      {
        label: "免登录购票",
        key: "BookingServerPrice",
        value: "100张（剩余100张）",
      },
      {
        label: "免核验购票",
        key: "BookingServerPrice",
        value: "100张（剩余100张）",
      },
      {
        label: "极速出票",
        key: "BookingServerPrice",
        value: " 800元（剩余800元）",
      },
      {
        label: "火车票代取",
        key: "BookingServerPrice",
        value: "100张（剩余100张）",
      },
    ],
  },
  {
    label: "用车",
    key: "用车",
    children: [
      {
        label: "协议托管",
        key: "BookingServerPrice",
        value: " 8000元（剩余8000元）",
      },
    ],
  },
  {
    label: "系统对接",
    key: "系统对接",
    children: [
      {
        label: "开发费用",
        key: "BookingServerPrice",
        value: "10000元（剩余10000元）",
      },
      {
        label: "标准实施",
        key: "BookingServerPrice",
        value: "8000元（剩余8000元）",
      },
    ],
  },
  {
    label: "公共",
    key: "公共",
    children: [
      {
        label: "SaaS返还",
        key: "BookingServerPrice",
        value: "10000元（剩余10000元）",
      },
      {
        label: "使用月数",
        key: "BookingServerPrice",
        value: "9个月（剩余9个月）",
      },
      { label: "适用范围", key: "BookingServerPrice", value: "酒店、机票" },
    ],
  },
  {
    label: "跨合同顺延",
    key: "跨合同顺延",
    children: [
      { label: "是否允许", key: "BookingServerPrice", value: "不允许" },
    ],
  },
]);
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
.block-title {
  font-size: 14px;
  font-weight: 500;
  color: @font-primary;
  margin-top: 24px;
}
.flex-box {
  display: flex;
  flex-wrap: wrap;
  background: #fff8ed;
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
    color: #8c8c8c;
    font-size: 13px;
    width: 65px;
    margin-right: 12px;
    white-space: nowrap;
  }
  .value {
    color: @font-primary;
    font-size: 13px;
  }
}
.inner-box {
  background: @bg-brand;
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
  color: @brand-blue;
  cursor: pointer;
  font-size: 14px;
}
:deep(.el-tabs__item) {
  font-size: 16px;
  color: @font-secondary;
}
:deep(.el-tabs__item.is-active) {
  color: @brand-blue;
}
:deep(.el-tabs__active-bar) {
  background-color: @brand-blue;
}

.totle-box {
  padding: 24px;
  border-radius: 6px;
  background: @bg-brand;
  display: flex;
  align-items: center;
  .total-box-item {
    width: 50%;
    &.left {
      border-right: 1px solid @line-rest;
    }
    .label {
      color: @font-secondary;
      font-size: 16px;
      margin-bottom: 6px;
    }
    .number {
      font-size: 20px;
      font-weight: 600;
      color: @font-primary;
    }
  }
}
</style>
