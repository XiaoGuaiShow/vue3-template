<template>
  <div class="inner-section">
    <div class="title fs-18 flex ai-c">
      账期
      <div class="blue-tab ml-12">10/01-10/31</div>
    </div>

    <div class="bill-card">
      <div>
        <div class="flex jc-sb ai-c">
          <div class="left-block flex primary green grey">
            <div class="circle flex ai-c jc-c">
              <svg-icon class="icon" name="bill" size="48"></svg-icon>
            </div>
            <div class="ml-24 flex col jc-c">
              <div class="fs-24 fw-600 left-block-title">已出账</div>
              <div class="flex mt-12 ai-c">
                <div class="fs-18 fw-500 c-font-primary">最晚结算日: 2023/11/15</div>
                <div class="flex ai-c elliptic ml-12">
                  <img :src="timeImg" alt="" />
                  <div class="fs-12 h-12 lh-12 c-font-hint ml-2">距最晚结算日</div>
                  <div class="fs-16 h-16 lh-16 c-brand-blue">12天</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <el-button type="primary" plain>查看账单明细</el-button>
            <el-button type="primary">确认账单</el-button>
            <el-button type="primary">查看发票</el-button>
          </div>
        </div>
      </div>

      <div style="height: 142px; background-color: #fff; margin-top: 24px"></div>

      <div class="section mt-24">
        <div class="fs-20 fw-600 c-font-primary h-20 lh-20">账单分类概览</div>
        <div class="bill-item" v-for="(item, index) in feeClassList(billData)" :key="index">
          <div
            class="bill-item-col"
            v-for="(item2, index2) in productTypeList(item.productDTOList)"
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
            <div v-for="(item3, index3) in feeTypeList(item2.feeDetailDTOList)" :key="index3">
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
</template>

<script lang="ts" setup>
import timeImg from '@/assets/images/bill/time.png'
import { ref } from 'vue'
import { FEE_TYPE, PRODUCT_TYPE, FEE_CLASS } from '@/common/static'
import { sortBy } from 'lodash-es'
import type { FeeTypeItem, ProductTypeItem, FeeClassItem } from './types'

const billData = ref([
  {
    a: 1,
    feeClass: 0,
    productDTOList: [
      {
        productType: 0,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 5,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 51,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 1,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 11,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 6,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      }
    ]
  },
  {
    feeClass: 1,
    productDTOList: [
      {
        productType: 0,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 5,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 51,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 1,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 11,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 6,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      }
    ]
  },
  {
    feeClass: 2,
    productDTOList: [
      {
        productType: 0,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 5,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 51,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 1,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 11,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 6,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      }
    ]
  },
  {
    feeClass: 0,
    productDTOList: [
      {
        productType: 7,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 51,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 5,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 9,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 1,
            totalPrice: '5000.00'
          },
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          }
        ]
      },
      {
        productType: 0,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 2,
            totalPrice: '999.00'
          },
          {
            feeType: 3,
            totalPrice: '2121.00'
          },
          {
            feeType: 1,
            totalPrice: '5000.00'
          }
        ]
      },
      {
        productType: 1,
        productTotalPrice: '6000.00',
        feeDetailDTOList: [
          {
            feeType: 3,
            totalPrice: '300.00'
          },
          {
            feeType: 2,
            totalPrice: '200.00'
          },
          {
            feeType: 1,
            totalPrice: '100.00'
          }
        ]
      }
    ]
  }
])
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
