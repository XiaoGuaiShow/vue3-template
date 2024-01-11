<template>
  <div>
    <el-input
      clearable
      :prefix-icon="Search"
      @input="handleSearch"
      v-model="searchKey"
      :placeholder="placeholder"></el-input>
    <div class="container">
      <div class="tabView b-flex" v-if="items.length > 1">
        <div
          v-for="(item, index) in props.items as any"
          :key="index"
          class="tabItem"
          :class="{ current: tabIndex === index }"
          @click="onTabClick(index)">
          {{ item.label }}
        </div>
      </div>
      <div v-show="!showSearchResult">
        <div v-for="(item, index) in props.items as any" :key="index">
          <div
            v-show="tabIndex === index"
            class="scroll"
            :style="{ height: items.length > 1 ? `${scrollHeight}px` : `${scrollHeight + 38}px` }">
            <div v-if="item.type === 'tree'">
              <el-tree
                lazy
                show-checkbox
                check-strictly
                :ref="treeRef"
                :data="item.data"
                :default-expanded-keys="item.defaultExpandedKeys"
                :props="item.props || defaultTreeConfig.props"
                :node-key="item.nodeKey || defaultTreeConfig.nodeKey"
                :load="(node, resolve) => loadTreeNode(node, resolve, item.emitLoadNodeEvent)"
                @check-change="
                  (data: any, checked: any, indeterminate: any) =>
                    handleCheckTreeChange(data, checked, indeterminate, item.emitCheckChangeEvent)
                ">
                <template #default="{ data }">
                  <span class="custom-tree-node">
                    <i class="icon ceekeefont wenjianjia" v-if="data.type !== 'person'"></i>
                    {{ data[(item.props && item.props.label) || defaultTreeConfig.props.label] }}
                    <span v-if="data.WorkCode">({{ data.WorkCode }})</span>
                  </span>
                </template>
              </el-tree>
            </div>
            <div v-if="item.type === 'checkbox'" class="content">
              <el-checkbox-group v-model="item.checkList" class="b-flex b-flex-column">
                <el-checkbox
                  @change="
                    (e) =>
                      handleCheckboxChange(
                        e,
                        n,
                        (item.props && item.props.key) || defaultCheckboxProps.key,
                        item.emitCheckboxChangeEvent
                      )
                  "
                  v-for="n in item.data"
                  :label="n[(item.props && item.props.key) || defaultCheckboxProps.key]"
                  :key="n[(item.props && item.props.key) || defaultCheckboxProps.key]">
                  {{ n[(item.props && item.props.label) || defaultCheckboxProps.label] }}
                </el-checkbox>
              </el-checkbox-group>
              <div v-if="item.data.length === 0" class="noData">暂无数据</div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-show="showSearchResult"
        class="scroll"
        :style="{ height: items.length > 1 ? `${scrollHeight}px` : `${scrollHeight + 38}px` }">
        <div
          class="search-list b-flex b-flex-bettwen"
          @click="onSearchResultClick(item)"
          v-for="(item, index) in props.searchList as any"
          :key="index">
          <div v-if="item.Type === 'department'" class="ellipsis">
            <el-tooltip placement="bottom" effect="light">
              <template #content>{{ item.Name }}</template>
              <span>
                <i class="icon ceekeefont wenjianjia"></i>
                {{ item.Name }}
              </span>
            </el-tooltip>
          </div>
          <div v-else>
            <span>
              {{ item.Name }}
              <span v-if="item.WorkCode">({{ item.WorkCode }})</span>
            </span>
            <span>{{ item.DepartmentName }}</span>
          </div>
        </div>
        <div v-if="searchList.length === 0" class="noData">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { treeConfig, checkboxProps } from './config.ts'
import { Search } from '@element-plus/icons-vue'
import { ITabDataOptions } from '@/components/biz/GroupSelector/interface.ts'

const props = defineProps({
  placeholder: {
    type: String,
    default: '请输入关键字'
  },
  scrollHeight: {
    // 滚动区域高度
    type: Number,
    default: 362
  },
  searchList: {
    type: Array,
    default: [] as any[]
  }, // 搜索结果
  items: {
    type: Array,
    default: [
      {
        type: 'tree',
        label: '组织架构',
        data: [],
        defaultExpandedKeys: [],
        emitLoadNodeEvent: '', // 加载节点事件
        emitCheckChangeEvent: '', // 选中节点事件
        nodeKey: '',
        props: {
          label: '',
          children: ''
        }
      },
      {
        type: 'checkbox',
        label: '角色',
        data: [],
        checkList: [],
        emitCheckboxChangeEvent: '', // 选中节点事件
        props: {
          label: '',
          key: ''
        }
      }
    ] as ITabDataOptions[]
  }
})

const emit = defineEmits([
  'search',
  'searchResultClick',
  'setTreeChecked',
  'selectStuff',
  'loadNode'
])

const treeRef = ref<any>()
const defaultTreeConfig = ref(treeConfig) // 默认树配置
const defaultCheckboxProps = ref(checkboxProps) // 默认checkbox配置
const showSearchResult = ref(false) // 显示搜索结果
const searchKey = ref('') // 搜索关键字
const tabIndex = ref(0) // tab索引

function onTabClick(index: number) {
  const items = props.items as any
  const tabType = items[index].type
  tabIndex.value = index
  searchKey.value = ''
  showSearchResult.value = false
  if (tabType === 'checkbox') {
    emit('search', { searchKey: '', tabType })
  }
}

function handleSearch() {
  const items = props.items as any
  const tabType = items[tabIndex.value].type
  if (tabType === 'checkbox') {
    emit('search', { searchKey: searchKey.value, tabType })
  } else {
    if (searchKey.value) {
      showSearchResult.value = true
      emit('search', { searchKey: searchKey.value, tabType })
    } else {
      showSearchResult.value = false
    }
  }
}

function handleCheckTreeChange(data: any, checked: boolean, indeterminate: any, emitEvent: any) {
  if (emitEvent) {
    emit(emitEvent, { data, checked, indeterminate })
  } else {
    console.log('请传入emitEventName')
  }
}

function loadTreeNode(node: any, resolve: any, emitEvent: any) {
  if (emitEvent) {
    emit(emitEvent, { node, resolve })
  } else {
    console.log('请传入emitEventName')
  }
}

function handleCheckboxChange(event: any, data: any, key: any, emitEvent: any) {
  if (emitEvent) {
    emit(emitEvent, { event, data, key })
  } else {
    console.log('请传入emitEventName')
  }
}

function onSearchResultClick(item: any) {
  emit('searchResultClick', item)
}

function setTreeChecked(id: any, checked: any) {
  treeRef.value?.setChecked(id, checked)
}

defineExpose({
  setTreeChecked
})
</script>

<style lang="less" scoped>
@import url('index.less');
</style>
