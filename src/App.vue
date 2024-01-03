<template>
	<router-view v-slot="{ Component, route }">
		<transition name="animation" mode="out-in">
			<component :is="Component" :key="route.path" />
		</transition>
	</router-view>
</template>

<style lang="less">
html,
body,
#app {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;

	/* 过度动画配置代码 */
	.animation-enter-from,
	.animation-leave-to {
		transform: translateX(20px);
		opacity: 0;
	}
	.animation-enter-to,
	.animation-leave-from {
		opacity: 1;
	}
	.animation-enter-active {
		transition: all 0.7s ease;
	}
	.animation-leave-active {
		transition: all 0.3s cubic-bezier(1, 0.6, 0.6, 1);
	}

	// 滚动条整体部分
	&::-webkit-scrollbar {
		width: 6px;
		height: 8px;
	}
	// 滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
	&::-webkit-scrollbar-button {
		display: none;
	}
	// 滚动条里面的小方块，能向上向下移动（或往左往右移动，取决于是垂直滚动条还是水平滚动条）
	&::-webkit-scrollbar-thumb {
		background: rgba(144, 147, 153, 0.3);
		cursor: pointer;
		border-radius: 4px;
	}
	// 边角，即两个滚动条的交汇处
	&::-webkit-scrollbar-corner {
		display: none;
	}
	// 两个滚动条的交汇处上用于通过拖动调整元素大小的小控件
	&::-webkit-resizer {
		display: none;
	}
}
</style>
