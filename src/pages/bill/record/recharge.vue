<template>
  <div class="container">
    <!-- 返回 -->
    <el-link
      class="mb-24 c-brand-blue fs-14 flex ai-c"
      :underline="false"
      type="primary"
      @click="goLink">
      <ArrowLeft style="width: 1em; height: 1em; margin-right: 4px" />
      返回
    </el-link>
    <!-- 标题 -->
    <div class="title">
      <span class="title-text">{{ title }}</span>
    </div>
    <!--查询条件-->
    <div class="search">
      <div class="search-item">
        <span class="search-item-label">创建时间</span>
        <el-date-picker
          v-model="time"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="YYYY-MM-DD"
          @change="changeTime"></el-date-picker>
      </div>
      <div class="search-item">
        <span class="search-item-label">状态</span>
        <el-select v-model="searchParams.Status" placeholder="请选择" clearable>
          <el-option label="未支付Or待审核" :value="0"></el-option>
          <el-option label="已付款Or已审核" :value="1"></el-option>
          <el-option label="已驳回" :value="3"></el-option>
        </el-select>
      </div>
      <!--checkbox-->
      <div class="search-item" v-if="hasChild">
        <el-checkbox v-model="searchParams.IsIncludingSubsidiary">不包含子公司</el-checkbox>
      </div>
      <!--查询按钮-->
      <div class="search-item">
        <div class="btn btn-primary" @click="onSearch">查询</div>
        <div class="btn btn-primary" @click="onExport">导出</div>
      </div>
    </div>
    <!--充值总额展示-->
    <div class="total">
      <i class="tripwise-manage icon-data_fill"></i>
      <span class="total-text">充值总额：</span>
      <span class="total-num">{{ total.toFixed(2) }}</span>
    </div>
    <!--表格-->
    <div class="table">
      <el-table :data="tableData" border stripe v-loading.lock="loading">
        <el-table-column prop="EnterpriseName" label="企业名称"></el-table-column>
        <el-table-column prop="CustomerName" label="用户" width="180"></el-table-column>
        <el-table-column prop="PayPrice" label="充值金额" width="180"></el-table-column>
        <el-table-column prop="RechargeType" label="充值类型" width="180"></el-table-column>
        <el-table-column prop="Remark" label="备注" width="180">
          <template #default="scope">
            <div class="over-ellipsis" :title="scope.row.Remark">
              {{ scope.row.Remark || '--' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="Status" label="状态" width="180"></el-table-column>
        <el-table-column prop="PayTime" label="创建时间" width="180"></el-table-column>
      </el-table>
      <!--分页-->
      <div class="flex jc-sb ai-c mt-16">
        <div class="fs-12 fw-600 c-font-primary"></div>
        <el-pagination
          v-model:current-page="searchParams.Page.Index"
          v-model:page-size="searchParams.Page.Size"
          small
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRechargeList } from '@/api/bill'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getApiUrl } from '@/utils/auth'
import dayjs from 'dayjs'
import type { RechargeRequestParams } from '@/pages/bill/types'

const router = useRouter()

const hasChild = ref(Boolean(router.currentRoute.value.query?.hasChild))
const title = ref('充值记录')
const total = ref(0)
const tableData = ref([])
const time = ref<[string, string]>()
const loading = ref(false)
const searchParams = ref<RechargeRequestParams>({
  StartTime: '',
  EndTime: '',
  Status: undefined,
  IsIncludingSubsidiary: false,
  Page: {
    Index: 1,
    Size: 10
  }
})
const pageInfo = ref({})

onMounted(() => {
  // 使用dayjs默认当前月
  time.value = [
    dayjs().startOf('month').format('YYYY-MM-DD'),
    dayjs().endOf('month').format('YYYY-MM-DD')
  ]
  searchParams.value.StartTime = time.value[0]
  searchParams.value.EndTime = time.value[1]
  onSearch()
})

const onSearch = () => {
  searchParams.value.Page.Index = 1
  fetchData()
}

const onExport = () => {
  const data = { ...searchParams.value }
  let userInfo = JSON.parse(localStorage.getItem('_User_Info_') || '{}')
  let apiUrl = getApiUrl()
  data.Status = data.Status === undefined ? -1 : data.Status
  window.open(
    apiUrl +
      'b2b/Export/ExportEnterpriseRechargeExl.aspx?MemberId=' +
      encodeURIComponent(userInfo?.data?.MemberId ?? '') +
      '&Status=' +
      data.Status +
      '&StartTime=' +
      data.StartTime +
      '&EndTime=' +
      data.EndTime +
      (hasChild.value ? '&IsIncludingSubsidiary=' + !data.IsIncludingSubsidiary : '')
  )
}

const fetchData = () => {
  const data = { ...searchParams.value }
  if (hasChild.value) {
    data.IsIncludingSubsidiary = !data.IsIncludingSubsidiary
  } else {
    delete data.IsIncludingSubsidiary
  }
  data.Status = data.Status === undefined ? -1 : data.Status
  loading.value = true
  getRechargeList(data)
    .then((res: any) => {
      console.log(res)
      if (res.code === '0000') {
        total.value = res.data.TotalRecharge
        tableData.value = res.data.RechargeList
        pageInfo.value = res.data.PageInfo
      } else {
        ElMessage.error(res.msg)
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const changeTime = (val: [string, string]) => {
  time.value = val
  if (val?.length) {
    searchParams.value.StartTime = val[0]
    searchParams.value.EndTime = val[1]
  } else {
    searchParams.value.StartTime = ''
    searchParams.value.EndTime = ''
  }
}

const handleCurrentChange = (val: number) => {
  searchParams.value.Page.Index = val
  fetchData()
}
const handleSizeChange = (val: number) => {
  searchParams.value.Page.Index = 1
  searchParams.value.Page.Size = val
  fetchData()
}
const goLink = () => {
  router.go(-1)
}
</script>

<style lang="less" scoped>
.container {
  padding: 24px;
  margin: 0 12px;
  background-color: #fff;
}
.title {
  font-size: 16px;
  color: #141414;
  font-weight: 500;
  margin-bottom: 24px;
}
.search {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 4px;
  .search-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    margin-bottom: 20px;
    .search-item-label {
      margin-right: 12px;
      color: #141414;
      font-size: 14px;
    }
  }
}
.total {
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px;
  flex-grow: 1;
  background: #fff8ed;
  border-radius: 6px;
  font-size: 12px;
  .icon-data_fill {
    color: #fa8c16;
    margin-right: 12px;
  }
}
.total-text {
  margin-right: 6px;
  color: #8c8c8c;
}
.total-num {
  color: #3d3d3d;
  font-weight: 600;
}
</style>
