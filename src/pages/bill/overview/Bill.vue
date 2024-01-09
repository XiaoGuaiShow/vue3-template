<template>
	<div class="inner-section">
		<div class="title fs-18 flex ai-c">
			账期
			<div class="blue-tab ml-12">10/01-10/31</div>
		</div>

		<div class="bill-card">
			<div>
				<div class="flex jc-sb ai-c">
					<div class="flex">
						<div class="circle primary">
							<img src="" alt="" />
						</div>
						<div class="ml-24 flex col jc-c">
							<div class="fs-24 fw-600 c-brand-blue">已出账</div>
							<div class="flex mt-12 ai-c">
								<div class="fs-18 fw-500 c-font-primary">最晚结算日: 2023/11/15</div>
								<div class="flex ai-c elliptic ml-12">
									<img src="@/assets/images/bill/time.png" alt="" />
									<div class="fs-12 h-12 lh-12 c-font-hint">距最晚结算日</div>
									<div class="fs-16 h-16 lh-16 c-brand-blue">12天</div>
								</div>
							</div>
						</div>
					</div>
					<div>
						<el-button type="primary" plain>查看账单明细</el-button>
						<el-button type="primary">确认账单</el-button>
					</div>
				</div>
			</div>

			<div style="height: 142px; background-color: #fff; margin-top: 24px"></div>

			<div class="">123</div>
		</div>
	</div>
</template>

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
.title {
	font-weight: 600;
	color: var(--font-primary);
}
.blue-tab {
	background-color: var(--bg-select);
	height: 36px;
	line-height: 20px;
	border-radius: 4px;
	padding: 8px;
	color: var(--brand-blue);
	font-size: 20px;
	font-weight: 600;
	box-sizing: border-box;
}
.bill-card {
	padding: 24px;
	border: 1px solid var(--line-brand);
	background: var(--bg-brand);
	border-radius: 8px;
	margin-top: 24px;
}
.circle {
	width: 80px;
	height: 80px;
	border-radius: 100%;
	&.primary {
		background: #e1eeff;
	}
}
.elliptic {
	border: 1px solid var(--line-brand);
	background: var(--bg-brand);
	height: 26px;
	border-radius: 15px;
	padding: 0 6px;
}
</style>
