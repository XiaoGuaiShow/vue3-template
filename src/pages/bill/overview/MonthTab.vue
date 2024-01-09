<template>
	<div class="custom-tab mt-12">
		<div
			class="tab-item"
			:class="{ active: activeMonth === value }"
			v-for="value in months"
			:key="value"
			@click="handleTabClick(value)">
			{{ value + '月' }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const activeMonth = ref(1)
const handleTabClick = (value: number) => {
  activeMonth.value = value
}
</script>

<style lang="less" scoped>
.custom-tab {
  display: flex;
  .tab-item {
    flex: 1;
    text-align: center;
    height: 54px;
    line-height: 54px;
    font-size: 16px;
    font-weight: 600;
    color: var(--font-secondary);
    border-left: 1px solid var(--line-rest);
    border-top: 1px solid var(--line-rest);
    border-right: 1px solid var(--line-rest);
    border-radius: 6px 6px 0 0;
    background-color: var(--bg-unselect);
    cursor: pointer;
    & + .tab-item {
      margin-left: -1px;
    }
    &.active {
      background-color: var(--bg-white);
      color: var(--brand-blue);
    }
  }
}
.section {
  padding: 24px;
  background-color: var(--bg-white);
}
</style>
