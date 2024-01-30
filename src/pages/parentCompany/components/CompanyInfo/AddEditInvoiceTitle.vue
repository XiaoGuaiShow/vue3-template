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
        <el-form-item label="所属公司" prop="accountId">
          <el-select v-model="addForm.accountId" style="width: 100%">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :value="item.id"
              :label="item.companyName"></el-option>
          </el-select>
        </el-form-item>
        <p class="cut-line" v-if="props.showAddressAndScope"></p>
        <el-form-item class="mt-18" label="邮寄地址" prop="" v-if="props.showAddressAndScope">
          <span class="mail-address" @click="handleChooseAddress">新增/选择</span>
        </el-form-item>
        <div class="address-info" v-if="mailAddress">
          <span>{{ mailAddress }}</span>
          <el-icon class="ml-4" size="16" color="#595959" @click="deleteAddress">
            <CircleCloseFilled />
          </el-icon>
        </div>
        <p class="cut-line" v-if="props.showAddressAndScope"></p>
        <el-form-item class="mt-18" label="试用范围" prop="" v-if="props.showAddressAndScope">
          <div class="try-scope">
            <div class="try-tips">维护开具当前发票单位的部门或人员</div>
            <div class="mail-address" @click="openGroupSelector">选择范围</div>
            <div class="mt-12 flex wrap" v-if="addForm.dimensionType === 2">
              <el-tag
                class="mr-6 mb-12 mb-6"
                v-for="item in addForm.departments"
                :key="item.deptId"
                closable
                @close="deleteItem(addForm.dimensionType, item.deptId)">
                {{ item.deptName }}
              </el-tag>
            </div>
            <div class="mt-12 flex wrap" v-if="addForm.dimensionType === 1">
              <el-tag
                class="mr-6 mb-12 mb-6"
                v-for="item in addForm.users"
                :key="item.memberId"
                closable
                @close="deleteItem(addForm.dimensionType, item.memberId)">
                {{ item.memberName }}
              </el-tag>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <div class="btn btn-info" @click="beforeClose">取 消</div>
          <div class="btn btn-primary" v-loading="btnLoading" @click="handleConfirm">保存</div>
        </span>
      </template>
    </el-dialog>
  </div>
  <AddressListDialog
    v-if="showAddressListDialog"
    :activeId="addForm.mailAddressId"
    @close="showAddressListDialog = false"
    @on-confirm="confirmChooseAddress" />
  <!-- 组织架构中选择 -->
  <GroupSelector
    v-if="commonVisible"
    v-model:visible="commonVisible"
    :popSelectType="popSelectType"
    :before-list="beforeList"
    @on-ok="handleSelectConfirm" />
</template>

<script setup lang="ts">
import { ref, reactive, defineProps } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { saveInvoiceUnit, getInvoiceDetail, getEnterpriseDimension } from '@/api/invoice'
import { getBelongCompanyList } from '@/api/bill'
import { ElMessage } from 'element-plus'

interface Props {
  visible: boolean
  showAddressAndScope?: boolean
  invoiceId?: string | number | undefined
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  //是否展示邮件地址和适用范围
  showAddressAndScope: true,
  invoiceId: ''
})
const emit = defineEmits(['on-close', 'on-confirm'])

const companyList = ref<any[]>([])
const getAllCompanyList = () => {
  getBelongCompanyList().then((res) => {
    if (res.code === '0000') {
      companyList.value = res.data || []
    }
  })
}
getAllCompanyList()

const beforeList = ref<any[]>([])
const title = props.invoiceId ? '编辑开票单位' : '新增开票单位'
if (props.invoiceId) {
  getInvoiceDetail(props.invoiceId).then((res) => {
    if (res.code === '0000') {
      if (res.data) {
        addForm.accountId = res.data.accountId || 0
        addForm.bankName = res.data.bankName
        addForm.bankNo = res.data.bankNo
        addForm.companyAddress = res.data.companyAddress
        addForm.companyPhone = res.data.companyPhone
        addForm.invoiceTax = res.data.invoiceTax
        addForm.invoiceTitle = res.data.invoiceTitle
        addForm.mailAddressId = res.data.mailAddressId
        addForm.id = res.data.id
        addForm.departments = res.data.departments || []
        addForm.users = res.data.users || []
        mailAddress.value = res.data.address
      }
    }
  })
}

interface RuleForm {
  invoiceTitle: string
  invoiceTax: string
  companyAddress: string
  companyPhone: string
  bankName: string
  bankNo: string
  mailAddressId: string
  accountId?: number | string
  id?: string | number
  dimensionType: 1 | 2
  departments: any[]
  users: any[]
}

const addForm = reactive<RuleForm>({
  accountId: '',
  bankNo: '',
  companyAddress: '',
  companyPhone: '',
  bankName: '',
  invoiceTax: '',
  invoiceTitle: '',
  mailAddressId: '',
  dimensionType: 1, // 1人员 2部门
  departments: [], // 部门集合
  users: [] // 人员集合
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
    { required: true, message: '请输入公司地址', trigger: 'blur' },
    { min: 0, max: 100, message: '公司地址长度最大长度为100个字', trigger: 'blur' }
  ],
  companyPhone: [
    { required: true, message: '请输入公司电话', trigger: 'blur' },
    { min: 0, max: 20, message: '公司电话最大长度为20个字', trigger: 'blur' }
  ],
  bankName: [
    { required: true, message: '请输入开户银行', trigger: 'blur' },
    { min: 0, max: 50, message: '开户银行最大长度为50个字', trigger: 'blur' }
  ],
  bankNo: [
    { required: true, message: '请输入银行账号', trigger: 'blur' },
    { min: 0, max: 50, message: '银行账号长度最大长度为50个字', trigger: 'blur' }
  ]
})

const popSelectType = ref(1) // 1人员 4部门
getEnterpriseDimension().then((res) => {
  if (res.code === '0000') {
    addForm.dimensionType = res.data.dimensionType || 1
    if (addForm.dimensionType === 1) {
      popSelectType.value = 1
    } else if (addForm.dimensionType === 2) {
      popSelectType.value = 4
    }
  }
})
const commonVisible = ref(false)
const openGroupSelector = () => {
  commonVisible.value = true
}
const handleSelectConfirm = (data: any) => {
  if (data && data.list?.length) {
    beforeList.value = [...data.list]
    if (addForm.dimensionType === 1) {
      addForm.users = data.list.map((item: any) => {
        return {
          deptId: item.ParentDepartmentId,
          jobNo: item.WorkCode,
          memberId: item.CustomerId,
          memberName: item.Name
        }
      })
    } else if (addForm.dimensionType === 2) {
      addForm.departments = data.list.map((item: any) => {
        return {
          deptId: item.Id,
          deptName: item.Name,
          hasChild: 0
        }
      })
    }
  }
}
const deleteItem = (type: number, id: number) => {
  if (type === 2) {
    addForm.departments = addForm.departments.filter((item: any) => item.deptId !== id)
  } else if (type === 1) {
    addForm.users = addForm.users.filter((item: any) => item.memberId !== id)
  }
}

// 确定
let btnLoading = ref<boolean>(false)
const handleConfirm = async () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      btnLoading.value = true
      const params = props.invoiceId ? { ...addForm, id: props.invoiceId } : addForm
      saveInvoiceUnit(params)
        .then((res) => {
          if (res.code === '0000') {
            ElMessage.success('保存成功')
            emit('on-close')
            emit('on-confirm')
          } else {
            ElMessage.error(res.msg)
          }
        })
        .finally(() => {
          btnLoading.value = false
        })
    }
  })
}

// 关闭
const beforeClose = () => {
  emit('on-close')
}

// 选择邮寄地址
const mailAddress = ref('')
const showAddressListDialog = ref<boolean>(false)
const handleChooseAddress = () => {
  showAddressListDialog.value = true
}
const confirmChooseAddress = (row: any) => {
  showAddressListDialog.value = false
  addForm.mailAddressId = row.id
  mailAddress.value = row.provinceName + row.regionName + row.cityName + row.address
}
// 删除邮寄地址
const deleteAddress = () => {
  addForm.mailAddressId = ''
  mailAddress.value = ''
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
      margin-top: 10px;
    }
  }
  .cut-line {
    border-top: 1px solid var(--line-rest);
  }
}
</style>
