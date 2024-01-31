<template>
  <div>
    <div class="tips-action b-flex b-align-center">
      <el-icon><WarningFilled /></el-icon>
      <span>当前开票维度：{{ dimensionName }}</span>
      <span class="update-btn" @click="handleSetDimension">修改开票维度</span>
    </div>
    <div class="parent-company">
      <div class="left-container">
        <!-- 新增开票单位 -->
        <div class="add-edit-company">
          <div class="title-label">新增操作</div>
          <div class="flex">
            <div class="btn-primary mt-12 w-full" @click="handleAdd">+ 新增开票单位</div>
          </div>
        </div>
        <!-- 开票单位列表 -->
        <div class="company-list">
          <div class="title-label">开票单位列表</div>
          <el-input
            class="mt-24"
            v-model="filterText"
            placeholder="搜索开票单位名称"
            :prefix-icon="Search" />
          <div class="tree-container">
            <el-tree
              ref="treeRef"
              node-key="id"
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
                  {{ data.invoiceTitle }}
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="right-container">
        <!-- 公司信息 -->
        <div class="company-info" v-loading="rightLoading">
          <div class="flex jc-sb ai-c">
            <div class="title-label">{{ info.invoiceTitle || '-' }}</div>
            <el-switch
              v-model="isValid"
              inline-prompt
              active-text="启用"
              inactive-text="关闭"
              :active-value="1"
              :inactive-value="0"
              :before-change="beforeChange" />
          </div>
          <!-- 开票信息 -->
          <div class="box-info">
            <div class="flex jc-sb ai-c">
              <span class="info-title">开票信息</span>
              <div class="info-title-right flex ai-c">
                <span @click="handleEdit">编辑</span>
              </div>
            </div>
            <div class="info-content flex wrap">
              <div class="info-item">
                <span>开票单位</span>
                <span>{{ info.invoiceTitle || '-' }}</span>
              </div>
              <div class="info-item">
                <span>税号</span>
                <span>{{ info.invoiceTax || '-' }}</span>
              </div>
              <div class="info-item">
                <span>开户银行</span>
                <span>{{ info.bankName || '-' }}</span>
              </div>
              <div class="info-item">
                <span>银行账户</span>
                <span>{{ info.bankNo || '-' }}</span>
              </div>
              <div class="info-item">
                <span>公司地址</span>
                <span>{{ info.companyAddress || '-' }}</span>
              </div>
              <div class="info-item">
                <span>公司电话</span>
                <span>{{ info.companyPhone || '-' }}</span>
              </div>
            </div>
          </div>
          <!-- 邮寄信息 -->
          <div class="box-info">
            <div class="flex jc-sb ai-c">
              <span class="info-title">邮寄信息</span>
              <div class="info-title-right flex ai-c">
                <span @click="handleEdit">编辑</span>
              </div>
            </div>
            <div class="info-content flex wrap">
              <div class="info-item">
                <span>收件省市区</span>
                <span>{{ info.cityInfo || '-' }}</span>
              </div>
              <div class="info-item">
                <span>详细地址</span>
                <span>{{ info.address || '-' }}</span>
              </div>
              <div class="info-item">
                <span>收件人</span>
                <span>{{ info.receiver || '-' }}</span>
              </div>
              <div class="info-item">
                <span>联系电话</span>
                <span>{{ info.receiverPhone || '-' }}</span>
              </div>
              <div class="info-item">
                <span>电子邮箱</span>
                <span>{{ info.receiverEmail || '-' }}</span>
              </div>
            </div>
          </div>
          <!-- 使用范围 -->
          <div class="box-info">
            <div class="flex jc-sb ai-c">
              <span class="info-title">
                适用范围
                <span class="fs-12 c-font-hint">维护开具当前发票单位的部门或人员</span>
              </span>
              <div class="info-title-right flex ai-c">
                <span v-if="dimensionType === 1" @click="handleImport">导入</span>
                <span @click="handleExport">导出</span>
                <span @click="handleEdit">编辑</span>
              </div>
            </div>
            <div class="info-content flex wrap">
              <div class="info-item info-item-100">
                <span>适用</span>
                <span class="flex">
                  {{ dimensionName }}
                  <div
                    class="c-font-primary ml-12 ellipsis-1"
                    v-if="dimensionType === 2 && info.departments?.length">
                    ({{ info.departments.map((item: any) => item.deptName).join('、') || '-' }})
                  </div>
                  <div
                    class="c-font-primary ml-12 ellipsis-1"
                    v-if="dimensionType === 1 && info.users?.length">
                    ({{ info.users.map((item: any) => item.memberName).join('、') || '-' }})
                  </div>
                </span>
              </div>
            </div>
          </div>
          <!-- 所属公司 -->
          <div class="box-info">
            <div class="flex jc-sb ai-c">
              <span class="info-title">所属公司</span>
              <div class="info-title-right flex ai-c">
                <span @click="handleEdit">编辑</span>
              </div>
            </div>
            <div class="info-content flex wrap">
              <div class="info-item info-item-100">
                <span>所属</span>
                <span>{{ info.accountIdName || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditInvoiceTitle
        v-if="visible"
        :visible="visible"
        :invoiceId="invoiceId"
        @on-close="visible = false"
        @on-confirm="saveConfirm" />

      <!-- 下载上传模版 -->
      <DownloadUpload
        :visible="uploadVisible"
        :downloadUrl="downloadUrl"
        :uploadUrl="importInvoice"
        @on-close="uploadVisible = false"
        @on-confirm="handleUploadSuccess"></DownloadUpload>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import {
  getAllInvoiceList,
  getInvoiceDetail,
  validInvoice,
  getEnterpriseDimension,
  exportInvoice,
  importInvoice
} from '@/api/invoice'
import { ElMessage, ElTree } from 'element-plus'
import AddEditInvoiceTitle from '@/pages/parentCompany/components/CompanyInfo/AddEditInvoiceTitle.vue'
import DownloadUpload from '@/components/DownloadUpload/index.vue'

const visible = ref(false)
const handleAdd = () => {
  invoiceId.value = ''
  visible.value = true
}
const handleEdit = () => {
  invoiceId.value = currentNodeKey.value
  visible.value = true
}
const defaultProps = {
  children: 'children',
  label: 'invoiceTitle'
}

const dimensionType = ref(1) // 1人员 2部门
const dimensionSubType = ref('') // 1个人 2部门
const dimensionName = ref('')
getEnterpriseDimension().then((res) => {
  if (res.code === '0000') {
    dimensionType.value = res.data.dimensionType
    dimensionSubType.value = res.data.dimensionSubType
    dimensionName.value = res.data.dimensionName
  }
})

// 获取公司列表
const loading = ref(false)
const TreeData = ref<any[]>([
  {
    invoiceTitle: '已启用',
    children: [],
    title: true
  },
  {
    invoiceTitle: '未启用',
    children: [],
    title: true
  }
])
const invoiceId = ref('')
const currentNodeKey = ref('')
const getDataList = (needReset = true) => {
  loading.value = true
  getAllInvoiceList({
    currentIndex: 1,
    pageSize: 10000
  })
    .then((res) => {
      if (res.code === '0000') {
        if (res.data) {
          if (res.data.unValidList && res.data.unValidList.length > 0) {
            TreeData.value[1].children = res.data.unValidList.map((item: any) => {
              return {
                ...item,
                isValid: 0
              }
            })
          }
          if (res.data.validList && res.data.validList.length > 0) {
            TreeData.value[0].children = res.data.validList.map((item: any) => {
              return {
                ...item,
                isValid: 1
              }
            })
          }
          if (needReset) {
            const validTree = TreeData.value[0].children
            const unValidTree = TreeData.value[1].children
            isValid.value = validTree.length ? 1 : 0
            currentNodeKey.value = validTree.length
              ? validTree[0].id
              : unValidTree.length
                ? unValidTree[0].id
                : ''
          }
          getInvoiceDetails()
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}
getDataList()

// 点击tree节点
const isValid = ref(0)
const handleClickCompany = (data: any) => {
  if (data.id) {
    currentNodeKey.value = data.id
    isValid.value = data.isValid
    getInvoiceDetails()
  }
}
const filterNode = (value: string, TreeData: any) => {
  if (!value) return true
  return TreeData.invoiceTitle.includes(value)
}
// 公司列表搜索
const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()
watch(filterText, (val: string) => {
  if (treeRef.value) {
    treeRef.value.filter(val)
  }
})

const rightLoading = ref(true)
const info: Ref<any> = ref({
  invoiceTitle: ''
})
function getInvoiceDetails() {
  rightLoading.value = true
  getInvoiceDetail(currentNodeKey.value)
    .then((res) => {
      if (res.code === '0000') {
        if (res.data) {
          info.value = res.data
        }
      }
    })
    .finally(() => {
      rightLoading.value = false
    })
}

// 开票状态
const beforeChange = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    validInvoice({ id: currentNodeKey.value }).then((res: any) => {
      if (res.code === '0000') {
        ElMessage.success('操作成功')
        getDataList(false)
        resolve(true)
      } else {
        ElMessage.error(res.msg)
        reject(false)
      }
    })
  })
}
const saveConfirm = () => {
  // 编辑确认
  // if (invoiceId.value) {
  //   getInvoiceDetails()
  // } else {
  //   getDataList(false)
  // }
  getDataList(false)
}

// 设置开票维度
const handleSetDimension = () => {
  window.microApp
    .getData()
    .pushState(
      '/setInvoiceDimension?dimensionType=' +
        dimensionType.value +
        '&dimensionSubType=' +
        dimensionSubType.value
    )
}

// 导出
const handleExport = () => {
  exportInvoice()
}

// 导入模版
let uploadVisible = ref(false)
const handleImport = () => {
  uploadVisible.value = true
}
// 模版下载地址
let downloadUrl =
  'https://saas.ceekee.com/saas/%E5%AF%BC%E5%85%A5%E5%BC%80%E7%A5%A8%E8%A7%84%E5%88%99%E6%A8%A1%E7%89%88.xlsx'

// 模版上传成功
const handleUploadSuccess = () => {
  getDataList()
}
</script>

<style lang="less" scoped>
.parent-company {
  display: flex;
  padding: 0 12px 12px;
  align-items: stretch;
  min-height: 650px;
  height: auto;
  box-sizing: border-box;
  .left-container {
    width: 240px;
    margin-right: 12px;
  }
  .right-container {
    flex: 1;
  }
}
.add-edit-company {
  background: var(--bg-white);
  padding: 24px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  .title-label {
    font-size: 16px;
    font-weight: 600;
    line-height: 16px;
    color: var(--font-primary);
  }
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
  }
}
.company-info {
  background: var(--bg-white);
  border-radius: 8px;
  padding: 24px;
  box-sizing: border-box;
  height: 100%;
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
.tips-action {
  height: 48px;
  border-radius: 4px;
  background: #f6faff;
  color: #057bff;
  font-size: 14px;
  margin: 12px;
  padding-left: 21px;
  span {
    margin-left: 13px;
  }
  .update-btn {
    border: 1px solid #057bff;
    padding: 0px 8px;
    border-radius: 2px;
    cursor: pointer;
  }
}
:deep(.el-tree-node__expand-icon.is-leaf) {
  visibility: hidden;
}
</style>
