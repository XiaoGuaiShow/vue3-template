<template>
  <div class="container">
    <div class="section">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
            <div class="block-title">结算员信息</div>
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
          <div v-for="(item, index) in infos" :key="index">
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
        <el-tab-pane label="赠送信息" name="second">Config</el-tab-pane>
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

const infos = ref([
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
  color: #141414;
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
    color: #141414;
    font-size: 13px;
  }
}
.inner-box {
  background: #f6faff;
  padding: 12px;
  border-radius: 8px;
  .text-form {
    width: 25%;
    .label {
      width: 100px;
    }
  }
}
:deep(.el-tabs__item) {
  font-size: 16px;
}
</style>
