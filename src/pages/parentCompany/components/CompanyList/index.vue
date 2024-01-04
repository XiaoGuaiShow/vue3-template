<template>
	<div class="company-list">
		<div class="title-label">公司列表</div>
		<el-input class="mt-24" v-model="searchKey" placeholder="Please input" />
		<el-tree class="mt-14" :data="data" :props="defaultProps" default-expand-all />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// tree搜索
const searchKey = ref<string>('')

interface Tree {
	label: string
	children?: Tree[]
}
const data: Tree[] = [
	{
		label: 'Level one 1',
		children: [
			{
				label: 'Level two 1-1'
			}
		]
	},
	{
		label: 'Level one 2',
		children: [
			{
				label: 'Level two 2-1'
			},
			{
				label: 'Level two 2-2'
			}
		]
	}
]

const defaultProps = {
	children: 'children',
	label: 'label'
}
</script>

<style lang="less" scoped>
.company-list {
	background: var(--bg-white);
	padding: 24px 12px;
	border-radius: 8px;
	margin-top: 12px;
	:deep(.el-tree-node__content) {
		.el-tree-node__label {
			color: var(--font-primary);
			font-weight: 600;
		}
	}
	:deep(.el-tree-node__children) {
		.el-tree-node__label {
			font-weight: normal;
		}
	}
	.title-label {
		font-size: 16px;
		font-weight: 600;
		line-height: 16px;
		color: var(--font-primary);
	}
}
</style>
