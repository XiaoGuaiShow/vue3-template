<template>
  <div class="company-list">
    <div class="title-label">公司列表</div>
    <el-input class="mt-24" v-model="filterText" placeholder="搜索公司名称" :prefix-icon="Search" />
    <div class="tree-container">
      <el-tree
        ref="treeRef"
        node-key="id"
        :data="TreeData"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode">
        <template #default="{ data }">
          <span
            class="custom-tree-node"
            :class="data.title ? 'fontWeight' : 'fontNormal'"
            @click="handleClickCompany(data)">
            {{ data.companyName }}
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { accountAllList } from '@/api/modules/parentCompany.ts'
import { Search } from '@element-plus/icons-vue'
import { ElTree } from 'element-plus'
import mittBus from '@/utils/mitt.ts'

// 获取公司列表
interface Tree {
  [key: string]: any
}

const TreeData = ref<Tree[]>([])
const getDataList = async () => {
  try {
    const res: any = await accountAllList({})
    const parentList = (res.data || []).filter((f: any) => f.companyType === 1)
    const childList = (res.data || []).filter((f: any) => f.companyType === 2)
    const parentObj = {
      companyName: '母公司',
      children: parentList,
      title: true
    }
    const childObj = {
      companyName: '子公司',
      children: childList,
      title: true
    }
    TreeData.value = [parentObj, childObj]
    console.log('37========母公司', TreeData.value)
  } catch (error) {}
}
getDataList()
// 点击tree节点
const handleClickCompany = (data: Tree) => {
  console.log('62========node,data', data.id)
  if (data.id) {
    mittBus.emit('mittGetCompanyInfo', data.id)
  }
}

// 公司列表搜索
const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

watch(filterText, (val: string) => {
  if (treeRef.value) {
    treeRef.value.filter(val)
  }
})

const filterNode = (value: string, TreeData: Tree) => {
  if (!value) return true
  return TreeData.companyName.includes(value)
}

const defaultProps = {
  children: 'children',
  label: 'companyName'
}

onMounted(() => {
  // 监听新增编辑公司信息，刷新列表
  mittBus.on('mittGetCompanyList', () => {
    getDataList()
  })
})

onUnmounted(() => {
  mittBus.off('mittGetCompanyList')
})
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
  .tree-container {
    height: 370px;
    overflow-y: auto;
    margin-top: 14px;
    .custom-tree-node {
      color: var(--font-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .fontWeight {
      font-weight: 600;
    }
    .fontNormal {
      font-weight: normal;
    }
  }
}
</style>
