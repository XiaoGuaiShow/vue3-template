<template>
  <TwDialog
    title="提示"
    width="800px"
    @on-ok="onOk"
    @on-cancel="onCancel"
    :modal="props.open"
    :footer="{ showCancelButton: false, okButtonDisabled: confirmDisabled }">
    <div v-if="status !== 2">
      <div class="header">
        <div class="ing" v-if="status === 0">为您开具电子发票中...</div>
        <div class="success-status" v-if="status === 1">
          <el-icon class="success-icon">
            <SuccessFilled />
          </el-icon>
          <h2>开票完成</h2>
          <p>电子发票已为您开具成功，纸质发票将在 2-3 个工作日内为您邮寄！请您关注</p>
        </div>
      </div>
      <div class="content" :class="{ success: status === 1 }" ref="scrollContainerRef">
        <div
          class="content-item"
          :class="[{ read: isRead(item) }]"
          v-for="(item, index) in data"
          :key="index">
          <span class="content-item-title">{{ item.title }}</span>
          <span class="content-item-content">{{ item.content }}</span>
          <el-icon class="success-icon" v-if="status === 1 && isRead(item)">
            <SuccessFilled />
          </el-icon>
        </div>
      </div>
    </div>
    <div class="noResult" v-else>
      <div class="status">
        <el-icon class="status-icon">
          <WarningFilled />
        </el-icon>
        <h2>开票中</h2>
        <p>发票将在1-3个工作日内开具，请自行下载或邮箱（快递）查收。</p>
      </div>
    </div>
  </TwDialog>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:open', 'onCancel'])

const scrollContainerRef = ref<any>(null)
const confirmDisabled = ref(true)
const status = ref(0) // 0: 开票中 1: 开票成功 2: 开票失败
const data = ref([
  {
    title: '电子发票(专票) 苏州科技有限公司',
    content: '机票 ¥100.00',
    status: 1
  },
  {
    title: '电子发票(专票) 苏州科技有限公司',
    content: '机票 ¥100.00',
    state: 0 // 0: 未读 1: 已读
  },
  {
    title: '电子发票(专票) 苏州科技有限公司',
    content: '机票 ¥100.00',
    status: 0
  },
  {
    title: '电子发票(专票) 苏州科技有限公司',
    content: '机票 ¥100.00',
    status: 0
  },
  {
    title: '电子发票(专票) 苏州科技有限公司',
    content: '机票 ¥100.00',
    status: 0
  },
  {
    title: '电子发票(专票) 苏州科技有限公司',
    content: '机票 ¥100.00',
    status: 0
  },
  {
    title: '电子发票(专票) 苏州科技有限公司',
    content: '机票 ¥100.00',
    status: 0
  },
  {
    title: '电子发票(专票) 苏州科技有限公司',
    content: '机票 ¥100.00',
    status: 0
  }
])
const scrollInterval = ref<any>(null)
const scrollTimeout = ref<any>(null)
const currentIndex = ref<number>(0)

const isRead = computed(() => {
  return function (item: any) {
    return item.status === 1
  }
})

function scroll() {
  scrollInterval.value = setInterval(() => {
    data.value[currentIndex.value].status = 1
    currentIndex.value++
    scrollTimeout.value = setTimeout(() => {
      scrollContainerRef.value.scrollTo({
        top: (currentIndex.value - 3) * 66,
        behavior: 'smooth'
      })
    }, 300)
    if (currentIndex.value >= data.value.length) {
      clearInterval(scrollInterval.value)
      setTimeout(() => {
        status.value = 1
        confirmDisabled.value = false
      }, 500)
    }
  }, 500)
}

function onCancel() {
  clearInterval(scrollInterval.value)
  clearTimeout(scrollTimeout.value)
  emit('update:open', false)
}
function onOk(done: any) {
  done()
}

onMounted(() => {
  scroll()
})
</script>
<style scoped lang="less">
.header {
  text-align: center;
  max-height: 500px;
  transition: all 0.3s ease-out;

  .ing {
    font-size: 18px;
    font-weight: 600;
    padding: 25px 0 15px;
    color: #141414;
  }

  .success-status {
    padding: 30px 0;
    animation-name: zoomInDown;
    animation-duration: 0.5s;
    animation-fill-mode: both;

    .success-icon {
      font-size: 70px;
      color: #00d1b6;
    }

    h2 {
      font-size: 20px;
      font-weight: normal;
      padding: 15px 0 10px;
      color: #141414;
    }

    p {
      font-size: 13px;
      color: #595959;
    }
  }
}

.content {
  position: relative;
  height: 256px;
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 0 !important;
  }

  &.success {
    height: 150px;

    .content-item {
      height: 36px;
      margin-bottom: 6px;
      font-size: 12px;

      .content-item-title {
        margin-right: 5px;
      }

      .content-item-content {
        margin-right: 10px;
      }

      .success-icon {
        font-size: 18px;
      }
    }
  }
}

.content-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  color: #141414;
  text-align: center;
  width: 100%;
  height: 56px;
  line-height: 56px;
  background: #f6faff;
  margin-bottom: 10px;
  opacity: 0.5;
  transition: all 0.3s ease-out;

  &.read {
    opacity: 1;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .content-item-title {
    font-weight: bold;
    margin-right: 10px;
  }

  .content-item-content {
    margin-right: 30px;
  }

  .success-icon {
    font-size: 28px;
    color: #00d1b6;
  }
}

.noResult {
  text-align: center;
  padding: 100px 0;
  animation-name: zoomIn;
  animation-duration: 0.5s;
  animation-fill-mode: both;

  .status {
    .status-icon {
      font-size: 70px;
      color: #fab938;
    }

    h2 {
      font-size: 20px;
      font-weight: normal;
      padding: 15px 0 10px;
      color: #141414;
    }

    p {
      font-size: 13px;
      color: #595959;
    }
  }
}

.dialog-footer {
  padding-top: 10px;
  text-align: right;
  box-sizing: border-box;
}

@keyframes zoomInDown {
  0% {
    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    opacity: 0;
    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
  }

  60% {
    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    opacity: 1;
    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
  }
}

@keyframes zoomIn {
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  50% {
    opacity: 1;
  }
}
</style>
