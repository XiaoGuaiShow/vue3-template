<template>
	<div class="company-list">
		<div class="title-label">公司列表</div>
		<el-input class="mt-24" v-model="filterText" placeholder="搜索公司名称" :prefix-icon="Search" />
		<el-tree
			class="mt-14"
			ref="treeRef"
			:data="data"
			:props="defaultProps"
			default-expand-all
			:filter-node-method="filterNode"
			@node-click="handleNodeClick" />
	</div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ElTree } from 'element-plus'
import { ref, watch } from 'vue'
// 点击tree节点
const handleNodeClick = (data: Tree, node: Tree) => {
	console.log(data, node)
}

interface Tree {
	[key: string]: any
}

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

watch(filterText, (val: string) => {
	if (treeRef.value) {
		treeRef.value.filter(val)
	}
})

const filterNode = (value: string, data: Tree) => {
	if (!value) return true
	return data.label.includes(value)
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
		.el-tree-node.is-current > .el-tree-node__content {
			background-color: var(--bg-select) !important;
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
