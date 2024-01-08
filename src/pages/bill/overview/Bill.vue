<template>
	<div class="inner-section">
		<div class="title fs-18 flex ai-c">
			账期
			<div class="blue-tab ml-12">10/01-10/31</div>
		</div>
		<div class="bill-card">
			<div>
				<div>
					<div>
						<img src="" alt="" />
					</div>
					<div>
						<div>已出账</div>
						<div>
							<div>最晚结算日: 2023/11/15</div>
							<div>
								<img src="@/assets/images/bill/time.png" alt="" />
								<span>距最晚结算日</span>
								<span>12天</span>
							</div>
						</div>
					</div>
				</div>
			</div>
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
</style>
