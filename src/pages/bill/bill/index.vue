<template>
	<div class="inner-section">
		<el-form :inline="true" :model="formInline">
			<el-form-item label="结算周期">
				<el-date-picker
					v-model="formInline.dateRange"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期" />
			</el-form-item>
			<el-form-item label="结算状态">
				<el-select v-model="formInline.status" placeholder="请选择" clearable>
					<el-option label="Zone one" value="shanghai" />
					<el-option label="Zone two" value="beijing" />
				</el-select>
			</el-form-item>
			<el-form-item label="结算单名称">
				<el-input v-model="formInline.name" placeholder="请输入名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">查询</el-button>
			</el-form-item>
		</el-form>

		<el-table class="mt-6" :data="tableData" stripe border max-height="280">
			<el-table-column prop="name" label="结算单名称" show-overflow-tooltip>
				<template #default="{ row }">
					<span class="link">{{ row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="range" label="结算周期" width="215" align="center" />
			<el-table-column prop="needInvoiced" label="应结(元)" width="148" align="center" />
			<el-table-column prop="invoiced" label="已结算(元)" width="138" align="center">
				<template #default="{ row }">
					<span class="link">{{ row.invoiced }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="uninvoiced" label="未结算(元)" width="138" align="center" />
			<el-table-column prop="invoiced" label="发票信息" width="138" align="center">
				<template #default="{ row }">
					<span class="link">发票构成</span>
				</template>
			</el-table-column>
			<el-table-column prop="lastDay" label="快递单号" width="138" align="center" />
			<el-table-column prop="status" label="结算单状态" width="138" align="center" />
			<el-table-column prop="lastDay" label="最晚结算日" width="138" align="center" />
		</el-table>

		<div class="flex jc-sb ai-c mt-16">
			<div class="fs-12 fw-600 c-font-primary">
				<span class="mr-16">应结 ¥100000.00</span>
				<span class="mr-16">已结算 ¥100000.00</span>
				<span>未结算 ¥9000.00</span>
			</div>
			<el-pagination
				v-model:current-page="currentPage4"
				v-model:page-size="pageSize4"
				small
				:page-sizes="[5, 10, 20, 50, 100]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="400"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { TableItem } from '../types'
const formInline = reactive({
	status: '',
	name: ''
})
const onSubmit = () => {
	console.log('submit!')
}
const tableData = ref([
	{
		id: 1,
		name: '苏州A有限公司2023-09-16至2023-09-30结算单',
		invoiced: '100000.00',
		uninvoiced: '90',
		status: '已结算',
		lastDay: '2022-01-01',
		needInvoiced: '100000.00',
		range: '2023/12/01至2023/12/31'
	},
	{
		id: 2,
		name: '苏州A有限公司2023-09-16至2023-09-30结算单',
		invoiced: '100000.00',
		uninvoiced: '90',
		status: '已结算',
		lastDay: '2022-01-01',
		needInvoiced: '100000.00',
		range: '2023/12/01至2023/12/31'
	}
])
const handleExport = (row: TableItem) => {
	console.log(row)
}

const currentPage4 = ref(4)
const pageSize4 = ref(10)
const handleSizeChange = (val: number) => {
	console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
	console.log(`current page: ${val}`)
}
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
</style>
