<template>
	<div class="company-info">
		<div class="flex jc-sb ai-c">
			<div class="title-label">苏州比邻</div>
			<el-switch v-model="companyStatus" inline-prompt active-text="启用" inactive-text="关闭" />
		</div>
		<!-- 合作信息 -->
		<div class="box-info">
			<div class="flex jc-sb ai-c">
				<span class="info-title">合作信息</span>
			</div>
			<div class="info-content flex wrap">
				<div class="info-item">
					<span>合作模式</span>
					<span>账户充值</span>
				</div>
			</div>
		</div>
		<!-- 财务信息 -->
		<div class="box-info">
			<div class="flex jc-sb ai-c">
				<span class="info-title">财务信息</span>
				<div class="info-title-right flex ai-c">
					<span @click="handleBalanceRemind">设置余额提醒</span>
					<span @click="goToRechargeRecords">充值</span>
				</div>
			</div>
			<div class="info-content flex wrap">
				<div class="info-item">
					<span>余额</span>
					<span>1000000000</span>
				</div>
				<div class="info-item"></div>
				<div class="info-item">
					<span>日均消费</span>
					<span>999元</span>
				</div>
				<div class="info-item">
					<span>可用天数</span>
					<span>3天</span>
				</div>
			</div>
		</div>
		<!-- 结算员信息 -->
		<div class="box-info">
			<div class="flex jc-sb ai-c">
				<span class="info-title">结算员信息</span>
				<div class="info-title-right flex ai-c">
					<span @click="handleSettlementEdit">编辑</span>
				</div>
			</div>
			<div class="info-content flex wrap">
				<div class="info-item">
					<span>结算员</span>
					<span>李四</span>
				</div>
			</div>
		</div>
		<!-- 开票单位信息 -->
		<div class="box-info">
			<div class="flex jc-sb ai-c">
				<span class="info-title">开票单位信息</span>
				<div class="info-title-right flex ai-c">
					<span>编辑</span>
				</div>
			</div>
			<div class="info-content flex wrap">
				<div class="info-item info-item-100">
					<span>开票单位</span>
					<span>苏州比邻信息技术有限公司、苏州比邻信息科技有限公司</span>
				</div>
			</div>
		</div>
	</div>
	<!-- 编辑公司 -->
	<CompanyDialog
		:visible="commonVisible"
		:enterpriseId="companyInfo.enterpriseId"
		@on-close="commonVisible = false"></CompanyDialog>
	<!-- 设置余额提醒 -->
	<BalanceRemind
		:visible="balanceVisible"
		:enterpriseId="companyInfo.enterpriseId"
		:enterpriseName="companyInfo.enterpriseName"
		:settlementOfficerInfos="settlementOfficerInfos"
		@on-close="balanceVisible = false"
		@on-confirm="handleBalanceRemindSuccess"></BalanceRemind>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 公司状态
const companyStatus = ref<boolean>(true)
let companyInfo = reactive({
	enterpriseId: '8888',
	enterpriseName: '思客集团'
})

// 公司编辑
let commonVisible = ref<boolean>(false)
const handleSettlementEdit = () => {
	commonVisible.value = true
}

// 设置余额提醒
const balanceVisible = ref<boolean>(false)
const settlementOfficerInfos = ref<Array<any>>([])

const handleBalanceRemind = () => {
	settlementOfficerInfos.value = (settlementOfficerInfos.value || []).map((m) => {
		return {
			...m,
			Name: m.name,
			Phone: m.phone,
			CustomerId: m.customerId
		}
	})
	balanceVisible.value = true
}
// 设置提醒成功
const handleBalanceRemindSuccess = () => {}

// 跳转充值记录页面
const goToRechargeRecords = () => {}
</script>

<style lang="less" scoped>
.company-info {
	background: var(--bg-white);
	border-radius: 8px;
	padding: 24px;
	.title-label {
		font-size: 16px;
		font-weight: 600;
		line-height: 16px;
		color: var(--font-primary);
	}
	:deep(.el-switch) {
		height: 20px;
	}
	.box-info {
		margin-top: 24px;
		.info-title {
			font-size: 14px;
			line-height: 14px;
			color: var(--font-primary);
		}
		.info-title-right {
			color: var(--brand-blue);
			display: flex;
			align-items: center;
			span {
				font-size: 14px;
				line-height: 14px;
				margin-left: 12px;
				cursor: pointer;
			}
		}
		.info-content {
			background: var(--bg-brand);
			padding: 12px;
			border-radius: 8px;
			margin-top: 12px;
			.info-item {
				width: 50%;
				line-height: 28px;
				display: flex;
				span:nth-child(1) {
					color: var(--font-hint);
					font-size: 13px;
					width: 65px;
					margin-right: 12px;
					align-self: flex-start;
				}
				span:nth-child(2) {
					color: var(--font-primary);
					font-size: 13px;
					flex: 1;
				}
			}
			.info-item-100 {
				width: 100%;
			}
		}
	}
}
</style>
