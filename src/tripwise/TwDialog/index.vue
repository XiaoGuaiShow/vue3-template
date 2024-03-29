<template>
  <div class="tw-dialog">
    <el-dialog
      v-bind="$attrs"
      v-model="open"
      @closed="handleAfterClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <slot name="header">
        <div class="dialog-header">
          <span>{{ $attrs.name }}</span>
          <el-icon class="close-icon" @click="handleCancel">
            <Close />
          </el-icon>
        </div>
      </slot>
      <div class="dialog-content">
        <slot></slot>
      </div>
      <slot name="footer">
        <div class="dialog-footer" v-if="props.footer !== null">
          <el-button @click="handleCancel" v-if="footer.showCancelButton">
            {{ props.cancelButtonText }}
          </el-button>
          <el-button
            type="primary"
            @click="handleOk"
            :disabled="footer.okButtonDisabled"
            v-if="footer.showOkButton">
            {{ props.okButtonText }}
          </el-button>
        </div>
      </slot>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  footer: {
    type: Object
  },
  cancelButtonText: {
    type: String,
    default: '取消'
  },
  okButtonText: {
    type: String,
    default: '确定'
  }
})

const emit = defineEmits(['onCancel', 'onOk'])

interface FooterOptions {
  okButtonDisabled: boolean
  showCancelButton: boolean
  showOkButton: boolean
}

const defaultFooter: FooterOptions = {
  okButtonDisabled: false,
  showCancelButton: true,
  showOkButton: true
}
const open = ref(true)
const footer = ref<FooterOptions>(
  props.footer
    ? {
        ...defaultFooter,
        ...props.footer
      }
    : defaultFooter
)

const handleAfterClose = () => {
  emit('onCancel')
}

const handleCancel = () => {
  open.value = false
}

const handleOk = () => {
  emit('onOk', handleCancel)
}

onUpdated(() => {
  footer.value = {
    ...footer.value,
    ...props.footer
  }
})
</script>

<style scoped lang="less">
.tw-dialog {
  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    color: var(--font-primary);
    font-weight: 500;
    font-size: 16px;
    background: var(--bg-rest);
    margin-right: 0;

    .close-icon {
      cursor: pointer;
      font-size: 16px;
      color: var(--font-disable);
    }
  }

  .dialog-content {
    padding: 20px;
    box-sizing: border-box;
  }

  .dialog-footer {
    padding: 10px 20px 20px;
    text-align: right;
    box-sizing: border-box;
  }
}
</style>
