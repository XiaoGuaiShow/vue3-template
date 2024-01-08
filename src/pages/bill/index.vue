<template>
	<div class="container">
		<div class="section">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="账单总览" name="first">
					<DataCard></DataCard>
				</el-tab-pane>
				<el-tab-pane label="消费数据" name="second">Config</el-tab-pane>
				<el-tab-pane label="账单列表" name="third">Role</el-tab-pane>
				<el-tab-pane label="导出记录" name="fourth">Task</el-tab-pane>
				<el-tab-pane label="导出模板" name="fifth">Task</el-tab-pane>
			</el-tabs>
		</div>
		<MonthList></MonthList>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import DataCard from './overview/DataCard.vue'
import MonthList from './overview/MonthList.vue'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}
</script>

<style lang="less" scoped>
.container {
	padding: 12px;
	background-color: rgb(242, 243, 245);
}
.section {
	padding: 24px;
	background-color: #fff;
	border-radius: 8px;
}
</style>
