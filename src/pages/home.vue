<template>
  <div class="home">
    <Breadcrumbs />

    <div class="msg">{{ msg }}</div>

    <el-button type="primary" @click="addCount">count+1</el-button>
    <div>{{ count }}</div>
    <div>{{ store.getCount }}</div>

    <el-button type="primary" @click="groupSelector = true">打开组织选择</el-button>
    <el-button type="primary" @click="invoiceReminderDialog = true">打开开票弹框</el-button>
    <el-button type="primary" @click="jumpBillPage">jump</el-button>
    <GroupSelector v-model:visible="groupSelector" :popSelectType="7" v-if="groupSelector" />
    <InvoiceReminderDialog v-model:open="invoiceReminderDialog" v-if="invoiceReminderDialog" />
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '@/store'
// import { showGlobalLoading, download } from '@/api/example.ts'
// 当store中的多个参数需要被使用到的时候，为了更简洁的使用这些变量，采用结构的方式一次性获取所有的变量名
// ES传统方式解构(能获取到值，但是不具有响应性)
// Pinia解构方法：storeToRefs
const store = useGlobalStore()
// 解构store中的值
const { msg, count } = storeToRefs(store)
const invoiceReminderDialog = ref(false)
const groupSelector = ref(false)
const router = useRouter()

onMounted(() => {
  // showGlobalLoading()
  // download()
})

const addCount = () => {
  // 通过`store.属性名`来直接修改值
  store.count++
  // 通过store.方法名来调用action中的方法
  store.changeState()
}

function jumpBillPage() {
  // 跳转到开票页面
  router.push('bill')
}
</script>
<style lang="less" scoped>
.msg {
  color: var(--brand-blue);
}
</style>
