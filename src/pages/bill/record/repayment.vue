<template>
	<div class="container">
		<!--    标题-->
		<div class="title">
			<span class="title-text">{{ title }}</span>
		</div>
		<!--    查询条件-->
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
			<!--      checkbox-->
			<div class="search-item" v-if="hasChild">
				<el-checkbox v-model="searchParams.IsIncludingSubsidiary">不包含子公司</el-checkbox>
			</div>
			<!--      查询按钮-->
			<div class="search-item">
				<el-button type="primary" @click="onSearch">查询</el-button>
				<el-button type="primary" @click="onExport">导出</el-button>
			</div>
		</div>
		<!--    充值总额展示-->
		<div class="total">
			<i class="tripwise-manage icon-data_fill"></i>
			<span class="total-text">充值总额：</span>
			<span class="total-num">{{ total.toFixed(2) }}</span>
		</div>
		<!--    表格-->
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
			<!--      分页-->
			<div class="pagination">
				<el-pagination
					small
					@current-change="handleCurrentChange"
					:current-page.sync="searchParams.Page.Index"
					:page-size="searchParams.Page.Size"
					layout="total, prev, pager, next, jumper"
					:total="Number(pageInfo.RowNums)"></el-pagination>
			</div>
		</div>
	</div>
</template>
<script setup>
import { platformApi } from '@/request/api/platform'
import request from '@/request/request.js'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { GetBaseAPIURL } from '@/request/auth'
import dayjs from 'dayjs'

const router = useRouter()

const hasChild = ref(Boolean(router.currentRoute.value.query?.hasChild))
const title = ref('充值记录')
const total = ref(0)
const tableData = ref([])
const time = ref([])
const loading = ref(false)
const searchParams = ref({
	StartTime: '',
	EndTime: '',
	Status: '',
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
	let userInfo = JSON.parse(localStorage.getItem('_User_Info_'))
	let apiUrl = GetBaseAPIURL()
	data.Status = data.Status === '' ? -1 : data.Status
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
	data.Status = data.Status === '' ? -1 : data.Status
	loading.value = true
	request({
		apiModule: platformApi.GetRechargeListV2,
		data
	})
		.then((res) => {
			if (res.Code === '0000') {
				total.value = res.Data.TotalRecharge
				tableData.value = res.Data.RechargeList
				pageInfo.value = res.Data.PageInfo
			} else {
				ElMessage.error(res.Msg)
			}
		})
		.finally(() => {
			loading.value = false
		})
}

const changeTime = (val) => {
	time.value = val
	if (val?.length) {
		searchParams.value.StartTime = val[0]
		searchParams.value.EndTime = val[1]
	} else {
		searchParams.value.StartTime = ''
		searchParams.value.EndTime = ''
	}
}

const handleCurrentChange = (val) => {
	searchParams.value.Page.Index = val
	fetchData()
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
	margin-bottom: 24px;
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
	margin-bottom: 20px;
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
.pagination {
	margin-top: 40px;
	text-align: right;
	/deep/ .el-pagination {
		display: inline-flex;
	}
}
</style>
