<template>
  <div>
    <el-input
      clearable
      size="small"
      prefix-icon="el-icon-search"
      @input="handleSearch"
      v-model="searchKey"
      :placeholder="placeholder"></el-input>
    <div class="container">
      <div class="tabView b-flex" v-if="items.length > 1">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="tabItem"
          :class="{ current: tabIndex === index }"
          @click="onTabClick(index)">
          {{ item.label }}
        </div>
      </div>
      <div v-show="!showSearchResult">
        <div v-for="(item, index) in items" :key="index">
          <div
            v-show="tabIndex === index"
            class="scroll"
            :style="{ height: items.length > 1 ? `${scrollHeight}px` : `${scrollHeight + 38}px` }">
            <div v-if="item.type === 'tree'">
              <el-tree
                lazy
                show-checkbox
                check-strictly
                :ref="`tree_${index}`"
                :data="item.data"
                :default-expanded-keys="item.defaultExpandedKeys"
                :props="item.props || defaultTreeConfig.props"
                :node-key="item.nodeKey || defaultTreeConfig.nodeKey"
                :load="(node, resolve) => loadTreeNode(node, resolve, item.emitLoadNodeEvent)"
                @check-change="
                  (data, checked, indeterminate) =>
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
          v-for="(item, index) in searchList"
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
<script>
import { treeConfig, checkboxProps } from './config.ts'
export default {
  name: 'CustomSelector',
  props: {
    placeholder: {
      type: String,
      default: '请输入关键字'
    },
    scrollHeight: {
      // 滚动区域高度
      type: Number,
      default: 260
    },
    searchList: {
      type: Array,
      default: []
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
      ]
    }
  },
  data() {
    return {
      defaultTreeConfig: treeConfig, // 默认树配置
      defaultCheckboxProps: checkboxProps, // 默认checkbox配置
      showSearchResult: false, // 显示搜索结果
      searchKey: '', // 搜索关键字
      tabIndex: 0 // tab索引
    }
  },
  methods: {
    onTabClick(index) {
      const tabType = this.items[index].type
      this.tabIndex = index
      this.searchKey = ''
      this.showSearchResult = false
      if (tabType === 'checkbox') {
        this.$emit('search', { searchKey: '', tabType })
      }
    },
    handleSearch() {
      const tabType = this.items[this.tabIndex].type
      if (tabType === 'checkbox') {
        this.$emit('search', { searchKey: this.searchKey, tabType })
      } else {
        if (this.searchKey) {
          this.showSearchResult = true
          this.$emit('search', { searchKey: this.searchKey, tabType })
        } else {
          this.showSearchResult = false
        }
      }
    },
    handleCheckTreeChange(data, checked, indeterminate, emitEvent) {
      if (emitEvent) {
        this.$emit(emitEvent, { data, checked, indeterminate })
      } else {
        console.log('请传入emitEventName')
      }
    },
    loadTreeNode(node, resolve, emitEvent) {
      if (emitEvent) {
        this.$emit(emitEvent, { node, resolve })
      } else {
        console.log('请传入emitEventName')
      }
    },
    handleCheckboxChange(event, data, key, emitEvent) {
      if (emitEvent) {
        this.$emit(emitEvent, { event, data, key })
      } else {
        console.log('请传入emitEventName')
      }
    },
    onSearchResultClick(item) {
      this.$emit('searchResultClick', item)
    },
    setTreeChecked(id, checked) {
      // 当前业务树都在第一个tab项，先写死0，后期再优化
      this.$refs[`tree_${0}`][0].setChecked(id, checked)
    }
  }
}
</script>
<style lang="less" scoped>
@import url('index.less');
</style>
