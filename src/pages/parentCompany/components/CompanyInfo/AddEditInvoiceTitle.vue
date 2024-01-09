<template>
  <div class="add-edit-invoice-title">
    <el-dialog
      v-model="props.visible"
      destroy-on-close
      :close-on-click-modal="false"
      :before-close="beforeClose"
      width="800px"
      :title="title">
      <el-form ref="ruleFormRef" :model="addForm" :rules="addRule" label-width="84px">
        <el-form-item label="开票单位" prop="invoiceTitle">
          <el-input v-model.trim="addForm.invoiceTitle" placeholder="请输入开票单位" clearable />
        </el-form-item>
        <el-form-item label="发票税号" prop="invoiceTax">
          <el-input v-model.trim="addForm.invoiceTax" placeholder="请输入发票税号" clearable />
        </el-form-item>
        <el-form-item label="公司地址" prop="companyAddress">
          <el-input v-model.trim="addForm.companyAddress" placeholder="请输入公司地址" clearable />
        </el-form-item>
        <el-form-item label="公司电话" prop="companyPhone">
          <el-input
            v-model.trim="addForm.companyPhone"
            placeholder="请输入公司电话,如0512-12345678"
            clearable />
        </el-form-item>
        <el-form-item label="开户银行" prop="bankName">
          <el-input v-model.trim="addForm.bankName" placeholder="请输入开户银行" clearable />
        </el-form-item>
        <el-form-item label="银行账号" prop="bankNo">
          <el-input v-model.trim="addForm.bankNo" placeholder="请输入银行账号" clearable />
        </el-form-item>
        <p class="cut-line"></p>
        <el-form-item label="邮寄地址" prop="" v-if="props.showAddressAndScope">
          <span class="mail-address" @click="handleChooseAddress">新增/选择</span>
        </el-form-item>
        <div class="address-info" v-if="addForm.address">
          <span>{{ addForm.address }}</span>
          <span class="c-8C8C8C m-l-10" @click="deleteAddress">
            <el-icon><CircleClose /></el-icon>
          </span>
        </div>
        <p class="cut-line"></p>
        <el-form-item label="试用范围" prop="" v-if="props.showAddressAndScope">
          <div class="try-scope">
            <div class="try-tips">维护开具当前发票单位的部门或人员</div>
            <div class="mail-address">选择范围</div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="beforeClose">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps({
  visible: { type: Boolean },
  //是否展示邮件地址和适用范围
  showAddressAndScope: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['on-close', 'on-confirm'])

const title = ref<string>('新增开票单位')
watch(
  () => props.visible,
  (val) => {
    if (val) {
      console.log('visible', val)
    }
  }
)

interface RuleForm {
  invoiceTitle: string
  invoiceTax: string
  companyAddress: string
  companyPhone: string
  bankName: string
  bankNo: string
  address: string
  mailAddressId: string
  // trialScope:string // 试用范围
}

const addForm = reactive<RuleForm>({
  bankNo: '',
  companyAddress: '',
  companyPhone: '',
  bankName: '',
  invoiceTax: '',
  invoiceTitle: '',
  mailAddressId: '',
  address: ''
})

const ruleFormRef = ref<FormInstance>()

const addRule = reactive<FormRules<RuleForm>>({
  invoiceTitle: [
    { required: true, message: '请输入开票单位', trigger: 'blur' },
    { min: 2, max: 40, message: '开票单位长度为2至40个字', trigger: 'blur' }
  ],
  invoiceTax: [
    { required: true, message: '请输入发票税号', trigger: 'blur' },
    { min: 0, max: 30, message: '发票税号最大长度为30个字', trigger: 'blur' }
  ],
  companyAddress: [
    {
      min: 0,
      max: 100,
      message: '公司地址长度最大长度为100个字',
      trigger: 'blur'
    }
  ],
  companyPhone: [{ min: 0, max: 20, message: '公司电话最大长度为20个字', trigger: 'blur' }],
  bankNo: [
    {
      min: 0,
      max: 50,
      message: '银行账号长度最大长度为50个字',
      trigger: 'blur'
    }
  ]
})

// 确定
let btnLoading = ref<boolean>(false)
const handleConfirm = async () => {
  if (!ruleFormRef) return
  try {
    await ruleFormRef.value?.validate()
    btnLoading.value = true
    console.log('142========提交参数', addForm)
    setTimeout(() => {
      btnLoading.value = false
    }, 2000)
  } catch (err) {
    btnLoading.value = false
  }

  emit('on-confirm')
}

// 关闭
const beforeClose = () => {
  emit('on-close')
}

// 选择邮寄地址
const addressVisible = ref<boolean>(false)
const handleChooseAddress = () => {
  addressVisible.value = true
}

// 删除邮寄地址
const deleteAddress = () => {
  addForm.address = ''
  addForm.mailAddressId = ''
}
</script>

<style lang="less" scoped>
.add-edit-invoice-title {
  :deep(.el-dialog__header) {
    margin-right: 0;
    background: var(--bg-rest);
  }
  .mail-address {
    padding: 0px 8px;
    border: 1px solid var(--brand-blue);
    box-sizing: border-box;
    height: 32px;
    border-radius: 2px;
    font-size: 14px;
    color: var(--brand-blue);
    cursor: pointer;
  }
  .address-info {
    padding-left: 90px;
    margin-top: -10px;
    display: flex;
    align-items: center;
    color: var(--brand-blue);
    font-size: 14px;
    margin-bottom: 12px;
  }
  .try-scope {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    .try-tips {
      font-size: 12px;
      line-height: 12px;
      color: var(--font-hint);
      margin-bottom: 12px;
    }
  }
  .cut-line {
    border-top: 1px solid var(--line-rest);
    margin-bottom: 24px;
  }
}
</style>
