<template>
	<div class="invoice-title">
		<el-dialog
			v-model="props.visible"
			destroy-on-close
			:close-on-click-modal="false"
			:before-close="beforeClose"
			width="1000px"
			title="选择开票单位">
			<div class="search-action">
				<span class="search-title">开票单位</span>
				<el-input placeholder="请输入开票单位名称"></el-input>
				<div class="add-invoice-title">
					<el-icon><Plus /></el-icon>
					<span>新增开票单位</span>
				</div>
			</div>
			<el-table
				ref="multipleTableRef"
				:data="tableData"
				:border="true"
				style="width: 100%"
				@selection-change="handleSelectionChange"
				:header-cell-style="{
					'background-color': '#E7EDF2',
					'font-weight': 600,
					color: '#141414'
				}">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="date" label="开票单位" show-overflow-tooltip />
				<el-table-column prop="name" label="发票税号" show-overflow-tooltip />
				<el-table-column prop="address" label="公司地址" show-overflow-tooltip />
				<el-table-column prop="address" label="公司电话" show-overflow-tooltip />
				<el-table-column prop="address" label="开户银行" show-overflow-tooltip />
				<el-table-column prop="address" label="银行账号" show-overflow-tooltip />
				<el-table-column prop="address" label="操作" align="center" width="100">
					<template #default="scope">
						<div class="table-action">
							<span>编辑</span>
							<span>删除</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<div class="table-page">
				<el-pagination
					v-model:current-page="searchData.currentIndex"
					v-model:page-size="searchData.pageSize"
					layout="total,prev, pager, next, jumper"
					:total="searchData.total"
					@current-change="handleCurrentChange" />
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="handleConfirm">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElTable } from 'element-plus'

const props = defineProps({
	visible: { type: Boolean }
})
const emit = defineEmits(['on-close', 'on-confirm'])

watch(
	() => props.visible,
	(val) => {
		if (val) {
			console.log('visible', val)
		}
	}
)
const tableData = [
	{
		date: '2016-05-03',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles'
	},
	{
		date: '2016-05-02',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles'
	},
	{
		date: '2016-05-04',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles'
	},
	{
		date: '2016-05-01',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles'
	}
]

// 多选
const multipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
	multipleSelection.value = val
	console.log('79========多选', multipleSelection.value)
}

// 自动勾选
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const toggleSelection = (rows?: any[]) => {
	if (rows) {
		rows.forEach((row) => {
			// TODO: improvement typing when refactor table
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			multipleTableRef.value!.toggleRowSelection(row, undefined)
		})
	} else {
		multipleTableRef.value!.clearSelection()
	}
}

// 分页
const searchData = reactive({
	invoiceTitle: '',
	keyword: '',
	types: [1],
	pageSize: 10,
	currentIndex: 1,
	total: 100
})

// 页码
const handleCurrentChange = (val: number) => {
	searchData.currentIndex = val
	console.log('122========页', val)
	if (val === 2) {
		toggleSelection([tableData[0], tableData[1]])
	} else if (val === 3) {
		toggleSelection([tableData[2], tableData[3]])
	} else if (val === 4) {
		toggleSelection([tableData[0]])
	} else {
		toggleSelection()
	}
}

// 确定
const handleConfirm = () => {
	emit('on-confirm')
}

// 关闭
const beforeClose = () => {
	emit('on-close')
}
</script>

<style lang="less" scoped>
.invoice-title {
	:deep(.el-dialog__header) {
		margin-right: 0;
		background: var(--bg-rest);
	}
	.search-action {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
		.search-title {
			font-size: 14px;
			line-height: 14px;
			color: var(--font-primary);
		}
		.el-input {
			width: 160px;
			margin: 0 24px 0 10px;
		}
		.add-invoice-title {
			color: var(--brand-blue);
			display: flex;
			align-items: center;
			border-radius: 2px;
			height: 32px;
			line-height: 14px;
			padding: 0 16px;
			border: 1px solid var(--brand-blue);
			box-sizing: border-box;
			cursor: pointer;
			span {
				margin-left: 6px;
			}
		}
	}
	.table-action {
		display: flex;
		align-items: center;
		color: var(--brand-blue);
		font-size: 12px;
		span {
			margin-right: 4px;
			padding: 6px 4px;
			cursor: pointer;
			&:last-child {
				margin-right: 0;
			}
		}
	}
	.table-page {
		margin-top: 16px;
		display: flex;
		flex-direction: row-reverse;
	}
	//表格内容颜色
	/deep/ .el-table__body tbody tr:nth-child(odd) {
		background-color: var(--bg-white);
	}
	/deep/ .el-table__body tbody tr:nth-child(even) td {
		background-color: var(--bg_tbbody);
	}
	/deeep/ .el-table__header-wrapper {
		thead {
			th {
				div {
					font-weight: 600;
					font-size: 14px;
					color: var(--font-primary);
				}
			}
		}
	}
}
</style>
