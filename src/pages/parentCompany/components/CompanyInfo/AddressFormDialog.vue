<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800" @closed="handleClose">
    <div>
      <el-form :model="form" ref="ruleFormRef" :rules="rules" label-width="130px">
        <el-form-item label="收件省市区" prop="proCityAreaId">
          <el-cascader
            ref="cascaderRef"
            v-model="form.proCityAreaId"
            :options="cityOptions"
            :props="cityProps"
            @change="handleChange"
            class="w-all" />
        </el-form-item>
        <el-form-item label="收件详细地址" prop="address">
          <el-input
            v-model.trim="form.address"
            placeholder="请输入收件详细地址"
            clearable
            class="w-all" />
          <!-- <span class="c-brand-blue" @click="reuseInvoiceAddress">复用发票地址</span> -->
        </el-form-item>
        <el-form-item label="收件人" prop="receiver">
          <el-input
            v-model.trim="form.receiver"
            placeholder="请输入收件人姓名"
            clearable
            class="w-all" />
        </el-form-item>
        <el-form-item label="收件人联系电话" prop="receiverPhone">
          <el-input
            v-model.trim="form.receiverPhone"
            placeholder="请输入联系电话"
            clearable
            class="w-all" />
        </el-form-item>
        <el-form-item label="邮箱" prop="receiverEmail">
          <el-input
            v-model.trim="form.receiverEmail"
            placeholder="请输入邮箱"
            clearable
            class="w-all" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <div class="btn btn-info" @click="dialogVisible = false">取消</div>
        <div class="btn btn-primary" @click="confirm" v-loading="btnLoading">保存</div>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getAddressList, createAddress, modifyAddress, getAddressDetail } from '@/api/address'
import { useZimuStore } from '@/store/modules/zimu'
const zimuStore = useZimuStore()

const emits = defineEmits(['close', 'onConfirm'])
const props = defineProps<{
  rowId: string
}>()

const dialogVisible = ref(false)
const dialogTitle = ref('')
dialogTitle.value = props.rowId ? '编辑邮寄地址' : '新增邮寄地址'
onMounted(() => {
  dialogVisible.value = true
})
const handleClose = () => {
  emits('close')
}

const data: any = reactive({
  title: '',
  form: {
    proCityAreaId: undefined,
    address: '',
    receiver: '',
    receiverPhone: '',
    receiverEmail: ''
  },
  cityOptions: [], //所有省市区数据
  areaIds: [], //省市区ids
  areaNames: [] //省市区names
})
const { form, cityOptions, areaIds, areaNames } = toRefs(data)

const rules = reactive<FormRules>({
  proCityAreaId: [
    {
      required: true,
      message: '省市区不能为空',
      trigger: ['blur', 'change']
    }
  ],
  address: [
    {
      required: true,
      message: '收件详细地址不能为空',
      trigger: ['blur', 'change']
    }
  ],
  receiver: [
    {
      required: true,
      message: '收件人姓名不能为空',
      trigger: ['blur', 'change']
    }
  ],
  receiverPhone: [
    {
      required: true,
      message: '联系电话不能为空',
      trigger: ['blur', 'change']
    },
    {
      pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
      message: '请输入合法电话',
      trigger: 'blur'
    }
  ],
  receiverEmail: [
    {
      required: true,
      message: '邮箱不能为空',
      trigger: ['blur', 'change']
    },
    {
      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
      message: '邮箱格式不正确',
      trigger: 'blur'
    }
  ]
})
const ruleFormRef = ref<FormInstance>()

// 复用发票地址
const reuseInvoiceAddress = () => {
  form.value.address = zimuStore?.address || ''
}

// 获取详情数据
const getInfo = async () => {
  let params = {
    mailAddressId: props.rowId
  }
  const { code, data, msg } = await getAddressDetail(params)
  if (code === '0000') {
    form.value = data
    let ids = [data.provinceCode, data.cityCode, data.regionCode].map(Number)
    let names = [data.provinceName, data.cityName, data.regionName]
    form.value.proCityAreaId = ids
    areaIds.value = ids
    areaNames.value = names
  } else {
    ElMessage.error(msg)
  }
}
if (props.rowId) {
  getInfo()
}
// 提交
const confirm = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      saveData()
    } else {
      return false
    }
  })
}
// 保存数据
let btnLoading = ref(false)
const saveData = () => {
  const { address, receiver, receiverPhone, receiverEmail } = form.value
  const [provinceCode, cityCode, regionCode] = areaIds.value
  const [provinceName, cityName, regionName] = areaNames.value
  const params = {
    provinceCode,
    cityCode,
    regionCode,
    provinceName,
    cityName,
    regionName,
    address,
    receiver,
    receiverPhone,
    receiverEmail
  }
  const data = props.rowId ? { ...params, id: props.rowId } : params
  const requestPromise = props.rowId ? modifyAddress : createAddress
  requestPromise(data).then((res) => {
    if (res.code === '0000') {
      btnLoading.value = false
      ElMessage.success('操作成功')
      emits('onConfirm')
      beforeClose()
    } else {
      ElMessage.error(res.msg)
      btnLoading.value = false
    }
  })
}

// 关闭
const beforeClose = () => {
  emits('close')
}
// 省市区
const cityProps: any = {
  expandTrigger: 'hover',
  value: 'Id',
  label: 'Name',
  children: 'ChildList'
}
const cascaderRef = ref(null)
const handleChange = (val: any) => {
  areaIds.value = val
  areaNames.value = (cascaderRef.value as any).getCheckedNodes()[0].pathLabels
}

// 获取省市区
const getAreaList = () => {
  getAddressList().then((res) => {
    console.log(res)
    if (res.code == '0000') {
      cityOptions.value = res.data
    } else {
      ElMessage.error(res.Msg)
    }
  })
}
onMounted(() => {
  getAreaList()
})
</script>
<style scoped lang="less">
.w-all {
  width: 100%;
}
</style>
