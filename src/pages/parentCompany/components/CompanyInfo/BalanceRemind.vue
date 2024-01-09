<template>
  <div class="balance-remind">
    <el-dialog
      v-model="props.visible"
      destroy-on-close
      :close-on-click-modal="false"
      :before-close="beforeClose"
      width="800px"
      title="余额提醒设置">
      <el-form ref="ruleFormRef" :model="balanceForm" :rules="rules" label-width="80px">
        <el-form-item label="类型选择" prop="modelType">
          <el-select
            v-model="balanceForm.modelType"
            placeholder="请选择提醒类型"
            style="width: 100%">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="额度低于" v-if="balanceForm.modelType === 2" prop="reminderBalance">
          <el-input
            type="number"
            v-model.number="balanceForm.reminderBalance"
            placeholder="请输入金额">
            <template #suffix>
              <span>元短信提醒</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="提醒间隔" v-if="balanceForm.modelType === 2" prop="reminderInterval">
          <el-input
            type="number"
            v-model.number="balanceForm.reminderInterval"
            placeholder="请输入提醒时间间隔">
            <template #suffix>
              <span>小时</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="提醒人" prop="userInfos">
          <el-button type="primary" plain size="default" @click="handleAddPerson">
            选择提醒人
          </el-button>
        </el-form-item>
        <div class="personList">
          <el-form-item
            v-for="(item, index) in balanceForm.userInfos"
            :key="item.key"
            :prop="'userInfos.' + index + '.Phone'"
            :rules="[
              {
                required: true,
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入有效的手机号',
                trigger: ['change', 'blur']
              }
            ]"
            class="person-item"
            label-width="0px">
            <span class="peoson-item-name">{{ item.Name }}</span>
            <el-input
              v-model="item.Phone"
              class="person-item-input"
              placeholder="请输入提醒人手机号" />
            <span class="person-item-delete" @click="handleDeletePerson(index)">
              <el-icon class="c-8C8C8C"><Close /></el-icon>
            </span>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="beforeClose">取消</el-button>
          <el-button type="primary" @click="handleConfirm()">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 组织架构中选择 -->
  </div>
</template>

<script setup lang="ts">
// import request from '@/request/request.js'
// import { platformApi } from '@/request/api/platform'
// import { ElMessage } from 'element-plus'
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  enterpriseId: {
    type: String,
    default: ''
  },
  enterpriseName: {
    type: String,
    default: ''
  },
  settlementOfficerInfos: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['on-close', 'on-confirm'])

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.enterpriseId) {
        getInfo() // 详情
      }
    }
  }
)

interface RuleForm {
  modelType: number | any
  reminderBalance: number
  reminderInterval: number
  userInfos: any[]
}

let balanceForm = reactive<RuleForm>({
  modelType: null,
  reminderBalance: 0,
  reminderInterval: 0,
  userInfos: []
})

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules<RuleForm>>({
  modelType: [{ required: true, message: '请选择提醒类型', trigger: ['change', 'blur'] }],
  reminderBalance: [
    { required: true, message: '请输入提醒额度', trigger: ['change', 'blur'] },
    {
      pattern: /^[1-9]\d*$/,
      validator: (rule: any, value: any, callback: any) => {
        if (!/^[1-9]\d*$/.test(value)) {
          callback(new Error('只能输入正整数'))
        } else {
          callback()
        }
      }
    }
  ],
  reminderInterval: [
    { required: true, message: '请输入提醒时间间隔', trigger: ['change', 'blur'] },
    {
      trigger: ['change', 'blur'],
      pattern: /^[1-9]\d*$/,
      validator: (rule: any, value: any, callback: any) => {
        if (!/^[1-9]\d*$/.test(value)) {
          callback(new Error('只能输入正整数'))
        } else {
          callback()
        }
      }
    }
  ],
  userInfos: [
    { type: 'array', required: true, message: '请选择提醒人', trigger: ['change', 'blur'] }
  ]
})

// 类型列表
const typeList = ref([
  {
    label: '根据使用情况智能提醒',
    value: 1
  },
  {
    label: '低于设定金额时提醒',
    value: 2
  }
])

// const resetForm = () => {
// 	ruleFormRef.value?.clearValidate()
// 	ruleFormRef.value?.resetFields()
// 	balanceForm.modelType = null
// 	balanceForm.reminderBalance = 0
// 	balanceForm.reminderInterval = 0
// 	balanceForm.userInfos = []
// }
// 获取配置详情
const getInfo = async () => {
  // try {
  // 	const res = await request({
  // 		apiModule: platformApi.balanceReminderDetail,
  // 		params: { enterpriseId: props.enterpriseId }
  // 	})
  // 	if (res.code == '0000') {
  // 		if (!res.data) {
  // 			resetForm()
  // 		} else {
  // 			const { modelType, reminderBalance, reminderInterval, userInfos } = res.data
  // 			balanceForm.modelType = modelType
  // 			balanceForm.reminderBalance = reminderBalance
  // 			balanceForm.reminderInterval = reminderInterval
  // 			balanceForm.userInfos = (userInfos || []).map((m) => ({
  // 				...m,
  // 				Name: m.name,
  // 				Phone: m.phone,
  // 				CustomerId: m.customerId
  // 			}))
  // 		}
  // 	} else {
  // 		ElMessage.error(res.message)
  // 	}
  // } catch (err) {}
}

// 保存确认
// 保存确认
const handleConfirm = async () => {
  if (!ruleFormRef) return
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      const memberIds = balanceForm.userInfos.map((info) => info.CustomerId).join(',')
      const phones = balanceForm.userInfos.map((info) => info.Phone).join(',')
      const names = balanceForm.userInfos.map((info) => info.Name).join(',')
      const params = {
        enterpriseId: props.enterpriseId,
        enterpriseName: props.enterpriseName,
        modelType: balanceForm.modelType,
        reminderBalance: balanceForm.modelType === 2 ? balanceForm.reminderBalance : 0,
        reminderInterval: balanceForm.modelType === 2 ? balanceForm.reminderInterval : 0,
        memberIds,
        phones,
        names
      }
      saveData(params)
    } else {
      return false
    }
  })
}
// 保存数据
let btnLoading = ref(false)
const saveData = async (params: object) => {
  console.log(params)

  try {
    btnLoading.value = true
    // const res = await request({
    // 	apiModule: platformApi.balanceReminderSave,
    // 	data: params
    // })
    // if (res.code === '0000') {
    // 	emit('on-confirm')
    // 	beforeClose()
    // } else {
    // 	ElMessage.error(res.message)
    // }
    btnLoading.value = false
  } catch (err) {
    btnLoading.value = false
  }
}
// 删除人
const handleDeletePerson = (index: number) => {
  balanceForm.userInfos.splice(index, 1)
}

// 组织架构选择人员
const staffListVisable = ref<boolean>(false)
const handleAddPerson = () => {
  staffListVisable.value = true
}

const beforeClose = () => {
  emit('on-close')
}
</script>
<style lang="less" scoped>
.balance-remind {
  .personList {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-left: 80px;
    .person-item {
      width: 44%;
      position: relative;
      &:nth-child(n + 1) {
        margin-right: 5px;
      }
      .person-item-input :deep(.el-input__wrapper) {
        padding-left: 85px;
      }
      .peoson-item-name {
        position: absolute;
        left: 10px;
        width: 60px;
        z-index: 1;
        color: #141414;
        font-size: 14px;
        padding-right: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:after {
          content: '';
          display: inline-block;
          width: 1px;
          height: 14px;
          position: absolute;
          top: 10px;
          right: 0;
          background: #d8d8d8;
        }
      }
      .person-item-delete {
        position: absolute;
        right: 10px;
        top: 2px;
        color: #8c8c8c;
        cursor: pointer;
        &:before {
          content: '';
          display: inline-block;
          width: 1px;
          height: 14px;
          position: absolute;
          top: 8px;
          left: -10px;
          background: #d8d8d8;
        }
      }
    }
  }
}
</style>
