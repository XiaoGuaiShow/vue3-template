<template>
	<div class="parent-company flex">
		<div class="left-container">
			<div class="left-top-section">
				<div class="title-label">新增操作</div>
				<div class="title-btn mt-12">新增子公司</div>
			</div>
			<!-- 公司列表 -->
			<CompanyList class="mt-12"></CompanyList>
		</div>
		<div class="right-container">
			<!-- 规则设置 -->
			<RuleSetting></RuleSetting>
			<!-- 公司信息 -->
			<CompanyInfo class="mt-12"></CompanyInfo>
		</div>
	</div>
</template>

<script setup lang="ts">
import CompanyList from './components/CompanyList.vue'
import CompanyInfo from './components/CompanyInfo.vue'
import RuleSetting from './components/RuleSetting.vue'
</script>

<style lang="less" scoped>
.parent-company {
	padding: 12px;
	background: var(--bg_gary);
	height: 100vh;
	.title-label {
		font-size: 16px;
		font-weight: 600;
		line-height: 16px;
		color: var(--font-primary);
	}
	.left-container {
		width: 25%;
		margin-right: 12px;
		.left-top-section {
			background: var(--bg-white);
			padding: 24px 12px;
			border-radius: 8px;
			.title-btn {
				background: var(--brand-blue);
				color: var(--font-anti);
				font-size: 14px;
				line-height: 14px;
				width: 100%;
				text-align: center;
				padding: 9px 0;
				cursor: pointer;
			}
		}
	}
	.right-container {
		flex: 1;
	}
}
</style>
