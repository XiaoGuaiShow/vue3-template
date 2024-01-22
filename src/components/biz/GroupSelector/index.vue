<template>
  <TwDialog
    v-model="props.visible"
    @on-ok="onOk"
    @on-cancel="onCancel"
    :name="props.title"
    width="660px">
    <div class="GroupSelector">
      <div class="area-wrapper">
        <div class="area-header">
          <span>选择</span>
          <el-checkbox class="checkbox" v-model="includeChildDepartment" v-if="props.isShowSonDep">
            包含下级部门
          </el-checkbox>
        </div>
        <CustomSelector
          ref="customSelectorRef"
          :placeholder="inputPlaceholder"
          :search-list="searchStuffList"
          :items="items"
          @search="handleSearch"
          @searchResultClick="searchSelectStuff"
          @loadNode="loadNode"
          @selectStuff="selectStuff"
          @roleChange="handleRoleChange"
          @travelChange="handleTravelChange"
          @reasonCodeChange="handleReasonCodeChange"></CustomSelector>
      </div>
      <div class="area-wrapper">
        <div class="area-header">
          <span>已选择</span>
        </div>
        <div class="area-content">
          <el-input
            clearable
            v-model="selectedInput"
            @input="handleSelectedSearch"
            :prefix-icon="Search"
            :placeholder="inputPlaceholder" />
          <div class="selected-list" :class="{ 'only-one': selectedListClassify.length === 1 }">
            <el-collapse v-model="collapseKey">
              <el-collapse-item
                :key="collapse.type"
                :name="collapse.type"
                v-for="collapse in selectedListClassify">
                <template #title>
                  <el-icon class="icon-arrow">
                    <CaretRight />
                  </el-icon>
                  {{ TYPES[collapse.type] }}
                </template>
                <div
                  class="selected-list-item b-flex b-flex-bettwen"
                  v-for="(item, index) in collapse.data"
                  :key="index">
                  <div class="ellipsis" style="width: calc(100% - 20px)" :title="item.Name">
                    {{ item.Name }}
                    <span v-if="item.WorkCode">({{ item.WorkCode }})</span>
                    <span
                      v-if="
                        item.IsIncludeChild &&
                        includeChildDepartment &&
                        String(item.Type) === 'department'
                      ">
                      （包含子部门）
                    </span>
                  </div>
                  <el-icon class="close-icon" @click="deleteSelected(item)">
                    <Close />
                  </el-icon>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
  </TwDialog>
</template>

<script setup lang="ts">
import {
  GetCustomerStuffList,
  SearchStuffAndDepartment,
  GetDepartmentList
} from '@/api/modules/customer.ts'
import { ISelectedListOptions, IItemsOptions } from '@/components/biz/GroupSelector/interface.ts'
import { TYPES_MAP, TYPES as ALL_TYPES } from './TYPES_MAP.ts'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { useRoleList } from './hooks/useRoleList.ts'
import { useTravelList } from './hooks/useTravelList.ts'
import { useReasonCodeList } from './hooks/useReasonCodeList.ts'
import { computed, watch } from 'vue'

const props = defineProps({
  /*
  1、选择人员（员工和部门都能选择），右侧只显示人员
  2、只能点击员工
  3、选择人员或部门，右侧显示部门和人员
  4、选择部门
  5、选择人员、部门、角色
  6、部门转移
  7、选人员、部门、角色、差标
  8、请选择理由码
   */
  popSelectType: {
    type: Number,
    default: 1
  },
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '选择人员'
  },
  isShowSonDep: {
    type: Boolean,
    default: true
  },
  selected: {
    type: Array,
    default: () => {
      return []
    }
  },
  isNeed: {
    type: Boolean,
    default: true
  },
  isSingleChoice: {
    //是否单选
    type: Boolean,
    default: false
  },
  showDepartment: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:visible', 'onOk'])

const collapseKey = ref() // 已选择数据折叠key
const selectedInput = ref<string>('') // 已选择搜索框关键字
const customSelectorRef = ref<any>(null) // 自定义选择器ref
const DepartmentList = ref<any[]>([])
const AllDepartmentList = ref<any[]>([])
const StuffList = ref<any[]>([])
const searchStuffList = ref<any[]>([])
const FirstDepIdList = ref<any[]>([])
const selectedList = ref<ISelectedListOptions[]>([])
const selectedSearchList = ref<any[]>([])
const isSearch = ref(false)
const includeChildDepartment = ref(true)
const inputPlaceholder = ref<string>('')
const errorMsg = ref('请选择人员或部门！')
const currentDepartment = ref<any>({})
const TYPES = ref<any>(ALL_TYPES)

const MATCH_DATA = computed(() => {
  return TYPES_MAP[props.popSelectType]
})
const { extra = [] } = MATCH_DATA.value

const {
  roleConfig,
  roleCheckList,
  roleFilterList,
  getRoleList,
  handleRoleSearch,
  handleRoleChange,
  handleRoleDeleteByItem
} = useRoleList(props.selected, extra, selectedList.value)

const {
  travelConfig,
  travelCheckList,
  travelFilterList,
  getTravelList,
  handleTravelSearch,
  handleTravelChange,
  handleTravelDeleteByItem
} = useTravelList(props.selected, extra, selectedList.value)

const {
  reasonCodeConfig,
  reasonCodeCheckList,
  reasonCodeFilterList,
  getReasonCodeList,
  handleReasonCodeSearch,
  handleReasonCodeChange,
  handleReasonCodeDeleteByItem
} = useReasonCodeList(props.selected, extra, selectedList.value)

const items = computed(() => {
  const { extra } = MATCH_DATA.value
  let data: [IItemsOptions] = [] as any
  if (props.showDepartment) {
    data.push({
      type: 'tree',
      label: '组织架构',
      data: DepartmentList.value,
      defaultExpandedKeys: FirstDepIdList.value,
      emitLoadNodeEvent: 'loadNode',
      emitCheckChangeEvent: 'selectStuff'
    })
  }
  if (extra) {
    if (extra.includes('role')) {
      data.push({
        ...roleConfig,
        data: roleFilterList,
        checkList: roleCheckList
      })
    }
    if (extra.includes('travel')) {
      data.push({
        ...travelConfig,
        data: travelFilterList,
        checkList: travelCheckList
      })
    }
    if (extra.includes('reasonCode')) {
      data.push({
        ...reasonCodeConfig,
        data: reasonCodeFilterList,
        checkList: reasonCodeCheckList
      })
    }
  }
  return data
})
const selectedListClassify = computed(() => {
  const newList = [] as any[]
  selectedSearchList.value.forEach((item) => {
    const type = item.Type
    const findIndex = newList.findIndex((n) => n.type === type)
    if (findIndex > -1) {
      newList[findIndex].data.push(item)
    } else {
      newList.push({
        type: type,
        data: [item]
      })
    }
  })
  return newList
})

watch(selectedListClassify, (val) => {
  if (val.length === 1) {
    collapseKey.value = val[0]?.type
  }
})

watch(
  selectedList,
  (val: any) => {
    selectedSearchList.value = val
  },
  { deep: true }
)

function handleSelectedSearch() {
  if (selectedInput.value) {
    selectedSearchList.value = selectedList.value.filter((item) => {
      return item.Name.includes(selectedInput.value)
    })
  } else {
    selectedSearchList.value = selectedList.value
  }
}

const fetchExtraData = () => {
  if (extra.includes('role')) {
    getRoleList()
  }
  if (extra.includes('travel')) {
    getTravelList()
  }
  if (extra.includes('reasonCode')) {
    getReasonCodeList()
  }
}

const searchExtraData = (searchKey: string, name: string) => {
  const map = {
    role: handleRoleSearch,
    travel: handleTravelSearch,
    reasonCode: handleReasonCodeSearch
  } as any
  map[name](searchKey)
}

const deleteExtraData = (item: any) => {
  const map = {
    role: handleRoleDeleteByItem,
    travel: handleTravelDeleteByItem,
    reasonCode: handleReasonCodeDeleteByItem
  } as any
  map[item.Type](item)
}

async function fetchPersonData(DepartmentId: any) {
  const res = await GetCustomerStuffList({
    Page: {
      Index: 1,
      Size: 10000
    },
    DepartmentId,
    IsSeachChildCustomer: true
  })
  return res.data
}

async function getDepartmentList(DMId = 0, SearchByDeptId = true) {
  const res = await GetDepartmentList({ DMId, SearchByDeptId })
  return (res.data || []) as any
}

async function addPerson(resDep: any, id: string, resolve: any) {
  let resetList: any = []
  const data = await fetchPersonData(id)
  let stuffList = (data.StuffList || []) as any[]
  StuffList.value = StuffList.value.concat(stuffList)
  stuffList.forEach((item) => {
    if (item.Name) {
      resetList.push({
        Id: item.SIId,
        SIId: item.SIId,
        Name: item.Name,
        Type: 'person',
        ChildDepartmentList: [],
        WorkCode: item.WorkCode,
        CustomerId: item.CustomerId,
        ParentDepartmentId: item.DepartmentId
      })
    }
  })
  resolve(resetList.concat(resDep))
}

async function loadNode({ node, resolve }: any) {
  const { disableClickDepartment, includePerson } = MATCH_DATA.value
  const ChildDepartmentList = node.data.ChildDepartmentList as any[]
  if (Number(node.level) === 0) {
    const res = await getDepartmentList()
    const response = res.DepartmentList || []
    AllDepartmentList.value = AllDepartmentList.value.concat(response[0].ChildDepartmentList)
    if (disableClickDepartment) {
      response.forEach((item: any) => {
        item.disabled = true
      })
    }
    if (includePerson) {
      const depData = await fetchPersonData(response[0].Id)
      const stuffList = (depData.StuffList || []) as any[]
      StuffList.value = StuffList.value.concat(stuffList)
      stuffList.forEach((item: any) => {
        if (item.Name) {
          response[0].ChildDepartmentList.unshift({
            Type: 'person',
            Id: item.SIId,
            SIId: item.SIId,
            Name: item.Name,
            ChildDepartmentList: [],
            WorkCode: item.WorkCode,
            CustomerId: item.CustomerId,
            ParentDepartmentId: item.DepartmentId
          })
        }
      })
    }
    DepartmentList.value = response
    FirstDepIdList.value = [response[0].Id]
    resolve(response)
  } else if (ChildDepartmentList.length !== 0) {
    if (disableClickDepartment) {
      ChildDepartmentList.forEach((item) => {
        if (String(item.Type) !== 'person') item.disabled = true
      })
    }
    return resolve(node.data.ChildDepartmentList)
  } else {
    if (String(node.data.Type) === 'person') {
      return resolve([])
    }
    const res = await getDepartmentList(node.data.Id)
    const response = res.DepartmentList || []
    AllDepartmentList.value = AllDepartmentList.value.concat(response)
    if (disableClickDepartment) {
      response.forEach((item: any) => {
        item.disabled = true
      })
    }
    if (includePerson) {
      await addPerson(response, node.data.Id, resolve)
    } else {
      resolve(response)
    }
  }
  await nextTick()

  selectedList.value.forEach((item: any) => {
    StuffList.value.forEach((v: any) => {
      if (String(v.CustomerId) === String(item.CustomerId)) {
        const findDep = AllDepartmentList.value.find(
          (x: any) => String(x.Id) === String(v.DepartmentId)
        )
        if (findDep) {
          FirstDepIdList.value = findDep.Path.split(',')
        }
        setTreeChecked(v.SIId, true)
      }
    })
    if (!item.CustomerId) {
      setTreeChecked(item.Id, true)
    }
  })
}

// function checkNodeChildIsClean() {
//   AllDepartmentList.value.forEach((item: any) => {
//     let isHasSelect = false
//     let allChildDep = AllDepartmentList.value.filter((v: any) => v.Path.includes(item.Id))
//     let tenpSelect = [] as any[]
//     StuffList.value.forEach((x: any) => {
//       if (selectedList.value.find((y) => String(y.CustomerId) === String(x.CustomerId))) {
//         tenpSelect.push({ ...x })
//       }
//     })
//     tenpSelect.forEach((v) => {
//       if (allChildDep.find((x: any) => String(x.Id) === String(v.DepartmentId))) {
//         isHasSelect = true
//       }
//     })
//     if (!isHasSelect) {
//       setTreeChecked(item.Id, false)
//     }
//   })
// }

function selectPerson(item: any, state: any): any {
  if (String(item.Type) !== 'person') {
    setChildrenChecked(item.Id, state)
  } else {
    if (state) {
      if (props.isSingleChoice && selectedList.value && selectedList.value.length > 0) {
        selectedList.value.forEach((sitem: any) => {
          deleteSelected(sitem)
        })
      }
      if (!selectedList.value.find((a: any) => String(a.CustomerId) === String(item.CustomerId))) {
        selectedList.value.push({
          Type: 'person',
          Id: item.Id,
          SIId: item.SIId,
          Name: item.Name,
          CustomerId: item.CustomerId,
          WorkCode: item.WorkCode,
          ParentDepartmentId: item.ParentDepartmentId
        })
      }
    } else {
      if (
        selectedList.value.findIndex(
          (a: any) => String(a.CustomerId) === String(item.CustomerId)
        ) !== -1
      ) {
        selectedList.value.splice(
          selectedList.value.findIndex(
            (a: any) => String(a.CustomerId) === String(item.CustomerId)
          ),
          1
        )
      }
    }
    setAllStuffCheckedById(item.CustomerId, state)
  }
}

function selectDepAndStuff(item: any, state: any) {
  if (String(item.Type) !== 'person') {
    //部门
    if (state) {
      //选中
      if (!selectedList.value.find((a: any) => String(a.Id) === String(item.Id))) {
        selectedList.value.push({
          Id: item.Id,
          SIId: '', //部门不存在该字段
          Name: item.Name,
          CustomerId: item.CustomerId,
          WorkCode: '', //部门不存在该字段
          Type: 'department',
          IsIncludeChild: includeChildDepartment.value,
          ParentDepartmentId: item.ParentDepartmentId
        })
      }
    } else {
      selectedList.value = selectedList.value.filter((a: any) => String(a.Id) !== String(item.Id))
    }
  } else {
    if (state) {
      if (!selectedList.value.find((a: any) => String(a.CustomerId) === String(item.CustomerId))) {
        let siidIndex = selectedList.value.findIndex(
          (a: any) => String(a.SIId) === String(item.SIId)
        )
        let temp = {
          Id: item.Id,
          SIId: item.SIId,
          Name: item.Name,
          CustomerId: item.CustomerId,
          WorkCode: item.WorkCode,
          Type: 'person',
          ParentDepartmentId: item.ParentDepartmentId
        }
        if (siidIndex > -1) {
          selectedList.value[siidIndex] = temp
        } else {
          selectedList.value.push(temp)
        }
      }
    } else {
      selectedList.value = selectedList.value.filter(
        (a: any) => String(a.CustomerId) !== String(item.CustomerId)
      )
    }
    setAllStuffCheckedById(item.CustomerId, state)
  }
}

function selectDepartment(data: any, state: any) {
  if (state) {
    //选中
    if (!selectedList.value.find((a: any) => String(a.Id) === String(data.Id))) {
      selectedList.value.push({
        Id: data.Id,
        SIId: '', //部门不存在该字段
        Name: data.Name,
        CustomerId: data.CustomerId,
        WorkCode: '', //部门不存在该字段
        Type: 'department',
        ParentDepartmentId: data.ParentDepartmentId
      })
    }
  } else {
    let findIndex = selectedList.value.findIndex((a: any) => String(a.Id) === String(data.Id))
    if (findIndex !== -1) {
      selectedList.value.splice(findIndex, 1)
    }
  }
}

function moveDepartment(data: any, state: any) {
  if (state) {
    //选中
    //验证转移部门是否符合要求
    if (data.Path.includes(currentDepartment.value.DepartmentId)) {
      setTreeChecked(data.Id, false)
      return ElMessage({
        message: `不允许转移至${currentDepartment.value.DepartmentName}及其子部门！`,
        type: 'warning'
      })
    }
    if (!selectedList.value.find((a: any) => String(a.Id) === String(data.Id))) {
      selectedList.value.forEach((v: any) => {
        deleteSelected(v)
      })
      selectedList.value = [
        {
          Id: data.Id,
          SIId: '', //部门不存在该字段
          Name: data.Name,
          CustomerId: data.CustomerId,
          WorkCode: '', //部门不存在该字段
          Type: 'department',
          ParentDepartmentId: data.ParentDepartmentId
        }
      ]
    }
  } else {
    let findIndex = selectedList.value.findIndex((a: any) => String(a.Id) === String(data.Id))
    if (findIndex !== -1) {
      selectedList.value.splice(findIndex, 1)
    }
  }
}

const functions: any = {
  selectPerson,
  selectDepAndStuff,
  selectDepartment,
  moveDepartment
}

function selectStuff({ data, checked }: any) {
  const matchData: any = MATCH_DATA.value
  const { name } = matchData
  functions[name](data, checked)
}

onBeforeMount(() => {
  const {
    inputPlaceholder: placeholder,
    errorMsg: msg,
    getInitialData,
    extra = []
  } = MATCH_DATA.value
  inputPlaceholder.value = placeholder
  errorMsg.value = msg
  if (getInitialData && extra) {
    fetchExtraData()
  }
})

function setAllStuffCheckedById(CustomerId: any, flag: any) {
  StuffList.value.forEach((v: any) => {
    if (String(v.CustomerId) === String(CustomerId)) {
      let findDep = AllDepartmentList.value.find(
        (x: any) => String(x.Id) === String(v.DepartmentId)
      )
      if (findDep && flag) {
        FirstDepIdList.value = findDep.Path.split(',')
      }
      setTreeChecked(v.SIId, flag)
    }
  })
}

function setChildrenChecked(parentId: any, flag: any) {
  if (includeChildDepartment.value) {
    AllDepartmentList.value.forEach((item: any) => {
      if (item.Path.includes(parentId)) {
        StuffList.value.forEach((v: any) => {
          if (String(v.DepartmentId) === String(item.Id)) {
            selectStuff({
              data: {
                Id: v.SIId,
                SIId: v.SIId,
                Name: v.Name,
                Type: 'person',
                WorkCode: v.WorkCode,
                CustomerId: v.CustomerId,
                ParentDepartmentId: v.DepartmentId
              },
              checked: flag
            })
          }
        })
        setTreeChecked(item.Id, flag)
      }
    })
  } else {
    StuffList.value.forEach((item: any) => {
      if (String(item.DepartmentId) === String(parentId)) {
        selectStuff({
          data: {
            Id: item.SIId,
            SIId: item.SIId,
            Name: item.Name,
            Type: 'person',
            WorkCode: item.WorkCode,
            CustomerId: item.CustomerId,
            ParentDepartmentId: item.DepartmentId
          },
          checked: flag
        })
      }
    })
  }
}

function setTreeChecked(id: any, checked: any) {
  customSelectorRef.value.setTreeChecked(id, checked)
}

function deleteSelected(item: any) {
  const { extra } = MATCH_DATA.value
  if (extra && extra.includes(String(item.Type))) {
    deleteExtraData(item)
  } else {
    let id = item.Id
    if (String(item.Type) === 'person' && String(item.Id) === '') {
      let find = StuffList.value.find((x: any) => {
        return String(x.CustomerId) === String(item.CustomerId)
      })
      if (find) {
        id = find.SIId
      }
    }
    setTreeChecked(id, false)
  }
  let findIndex = selectedList.value.findIndex((x) => {
    return String(x.Name) === String(item.Name)
  })
  if (findIndex !== -1) {
    selectedList.value.splice(findIndex, 1)
  }
}

async function handleSearch({ searchKey, tabType, name }: any) {
  if (String(tabType) === 'checkbox') {
    searchExtraData(searchKey, name)
  } else {
    const { searchType } = MATCH_DATA.value as any
    const res = await SearchStuffAndDepartment({
      Key: searchKey,
      RequestType: searchType
    })
    const data = res.data as any
    const personList = data.StuffList.map((item: any) => {
      return {
        ...item,
        Type: 'person'
      }
    })
    const departmentList = data.DepartmentList.map((item: any) => {
      return {
        ...item,
        Type: 'department'
      }
    })
    searchStuffList.value = personList.concat(departmentList)
  }
}

function searchSelectStuff(data: any) {
  const list = selectedList.value as any[]
  if (props.isSingleChoice && list?.length > 0) {
    list.forEach((sItem: any) => {
      deleteSelected(sItem)
    })
  }
  let isRepeat = false
  let obj = {
    Id: data.SIId || data.Id,
    SIId: data.SIId,
    Name: data.Name,
    WorkCode: data.WorkCode,
    CustomerId: data.Id,
    ParentDepartmentId: data.DepartmentId,
    Type: data.Type
  } as any
  for (let item of list) {
    if (
      (item.CustomerId && String(item.CustomerId) === String(data.Id)) ||
      String(item.Id) === String(data.Id)
    ) {
      isRepeat = true
      break
    }
  }

  if (Number(props.popSelectType) === 3) {
    obj.IsIncludeChild = includeChildDepartment.value
  }

  if (!isRepeat) {
    if (Number(props.popSelectType) === 6) {
      list.forEach((v: any) => {
        deleteSelected(v)
      })
      selectedList.value = [{ ...obj }]
    } else {
      selectedList.value.push(obj)
    }
  }
  isSearch.value = false
  data.PathList &&
    data.PathList.forEach((item: any) => {
      if (!FirstDepIdList.value.find((v: any) => String(v) === String(item.Id))) {
        FirstDepIdList.value.push(item.Id)
      }
    })
  // let tempItem = FirstDepIdList.value.shift();
  // FirstDepIdList.value = [tempItem];
  selectedList.value.forEach((item: any) => {
    setTreeChecked(item.Id, true)
  })
}

function onCancel() {
  emit('update:visible', false)
}

function onOk(done: any) {
  if (selectedList.value.length < 1 && props.isNeed) {
    return ElMessage({
      message: errorMsg.value,
      type: 'warning'
    })
  }
  done()
  emit('onOk', {
    list: selectedList.value,
    type: props.popSelectType,
    needSonDepartment: includeChildDepartment.value
  })
}
</script>

<style lang="less" scoped>
.GroupSelector {
  display: flex;

  :deep(.el-collapse) {
    border: none;
  }

  :deep(.el-collapse-item__header) {
    height: 32px;
    line-height: 32px;
    font-weight: 500;
    font-size: 12px;
    color: var(--font-hint);
    border-bottom: none;

    .el-collapse-item__arrow {
      display: none;
    }

    .icon-arrow {
      margin-right: 12px;
      color: var(--font-hint);
      transition: transform 0.3s;
    }

    &.is-active {
      .icon-arrow {
        transform: rotate(90deg);
      }
    }
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 0;
  }

  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }

  .area-wrapper {
    width: calc(50% - 10px);
    height: 500px;
    border: 1px solid var(--line-border);
    border-radius: 4px;
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }

  .area-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 34px;
    line-height: 34px;
    color: var(--font-primary);
    font-size: 14px;
    padding: 0 12px;
    border-bottom: 1px solid var(--line-border);
    font-weight: 500;

    .checkbox {
      font-weight: normal;
    }
  }

  .area-content {
    padding: 12px;
  }

  .selected-list {
    padding: 10px 0;
    height: 400px;
    overflow: auto;

    &.only-one {
      :deep(.el-collapse-item__header) {
        display: none;
      }

      .selected-list-item {
        padding-left: 6px;
      }
    }

    .selected-list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 6px 4px 24px;
      color: var(--font-primary);
      font-size: 14px;
      font-weight: 500;
      border-radius: 3px;

      &:hover {
        background: var(--bg-rest);
      }

      .close-icon {
        font-size: 14px;
        color: var(--font-hint);
        cursor: pointer;
      }
    }
  }
}
</style>