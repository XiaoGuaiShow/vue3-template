<template>
  <div class="company-list">
    <div class="title-label">公司列表</div>
    <el-input class="mt-24" v-model="filterText" placeholder="搜索公司名称" :prefix-icon="Search" />
    <div class="tree-container">
      <el-tree
        ref="treeRef"
        node-key="accountEnterpriseId"
        :data="TreeData"
        :props="defaultProps"
        default-expand-all
        :highlight-current="true"
        v-loading="loading"
        :current-node-key="currentNodeKey"
        :filter-node-method="filterNode"
        @node-click="handleClickCompany">
        <template #default="{ data }">
          <div class="custom-tree-node" :class="data.title ? 'fontWeight' : 'fontNormal'">
            {{ data.companyName }}
          </div>
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
import { useZimuStore } from '@/store/modules/zimu'
import { useUserStore } from '@/store/modules/user'
const zimuStore = useZimuStore()
const UserStore = useUserStore()
const userInfo = UserStore.userInfo

const currentNodeKey = ref(`${userInfo.enterpriseId}`)
interface Tree {
  companyName: string
  children?: Tree[]
}
// 获取公司列表
const loading = ref(false)
const TreeData = ref<Tree[]>([])
const getDataList = async () => {
  loading.value = true
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
  loading.value = false
  // 高亮当前登录企业
  const findItem = res.data.find((f: any) => f.accountEnterpriseId === currentNodeKey.value)
  if (findItem) {
    currentNodeKey.value = findItem.accountEnterpriseId
    mittBus.emit('mittGetCompanyInfo', findItem.id)
    zimuStore.setEnterpriseInfo(findItem)
  }
}
getDataList()
// 点击tree节点
const handleClickCompany = (data: any) => {
  if (data.id) {
    mittBus.emit('mittGetCompanyInfo', data.id)
    zimuStore.setEnterpriseInfo(data)
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

const filterNode = (value: string, TreeData: any) => {
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
  height: calc(100% - 120px);
  box-sizing: border-box;
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
    // 树结构不要缩进
    :deep(.el-tree-node__content) {
      padding-left: 0 !important;
    }
  }
}
:deep(.el-tree-node__expand-icon.is-leaf) {
  visibility: hidden;
}
</style>
