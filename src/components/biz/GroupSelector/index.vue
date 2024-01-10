<template>
  <div class="GroupSelector">
    <el-dialog
      v-model="props.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="dialogClose"
      width="660px">
      <template #header>{{ title }}</template>
      <div class="checkSonDepartment" v-if="isShowSonDep">
        <el-checkbox v-model="needDepartment">含子部门</el-checkbox>
      </div>
      <div class="popu-main b-flex">
        <div class="popu-main-sec popu-main-lf">
          <div class="popu-main-sec-title">选择：</div>
          <div class="popu-main-sec-box">
            <CustomSelector
              ref="CustomSelector"
              :placeholder="inputPlaceholder"
              :search-list="searchStuffList"
              :items="items"
              @search="searchStuff"
              @searchResultClick="searchSelectStuff"
              @loadNode="loadNode"
              @selectStuff="selectStuff"
              @roleChange="roleChange"
              @travelChange="travelChange"
              @reasonCodeChange="reasonCodeChange"></CustomSelector>
          </div>
        </div>
        <div class="popu-main-sec popu-main-rt">
          <div class="popu-main-sec-title">已选择：</div>
          <div class="popu-main-sec-box">
            <div class="scroll-rt-box">
              <div
                class="selected-list b-flex b-flex-bettwen"
                v-for="(item, index) in selectedList"
                :key="index">
                <div class="ellipsis" style="width: calc(100% - 20px)" :title="item.Name">
                  <span v-if="item.Type">{{ TYPES[item.Type] }}：</span>
                  {{ item.Name }}
                  <span v-if="item.WorkCode">({{ item.WorkCode }})</span>
                  <span
                    v-if="
                      item.IsIncludeChild && isShowSonDep && String(item.Type) === 'department'
                    ">
                    （包含子部门）
                  </span>
                </div>
                <i
                  class="icon ceekeefont LC_icon_close_circle_line"
                  @click="deleteSelected(item)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="footer">
          <el-button type="primary" @click="addOk">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  GetCustomerStuffList,
  SearchStuffAndDepartment,
  GetDepartmentList
} from '@/api/modules/customer.ts'
import { GetRoleList, GetEnterpriseRoleSurvey } from '@/api/modules/common.ts'
import { GetCostTypeList } from '@/api/modules/expensecontrol.ts'
import { ISelectedListOptions, IItemsOptions } from '@/components/biz/GroupSelector/interface.ts'
import { TYPES_MAP, TYPES as ALL_TYPES } from './TYPES_MAP.ts'
import { computed, onBeforeMount, watch } from 'vue'

const props = defineProps({
  /*
  1、选择人员（员工和部门都能选择），右侧只显示人员
  2、只能点击员工
  3、选择人员或部门，右侧显示部门和人员
  4、选择部门
  5、选择人员、部门、角色
  6、部门转移
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
    default: '提示'
  },
  isShowSonDep: {
    type: Boolean,
    default: true
  },
  beforeList: {
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

const emit = defineEmits(['update:visible', 'addOk'])

const CustomSelector = ref(null)
const DepartmentList = ref([])
const AllDepartmentList = ref([])
const StuffList = ref([])
const searchStuffList = ref([])
const FirstDepIdList = ref([])
const selectedList = ref<[ISelectedListOptions]>([])
const isSearch = ref(false)
const needDepartment = ref(true)
const inputPlaceholder = ref<string>('')
const errorMsg = ref('请选择人员或部门！')
const currentDepartment = ref({})
const tabType = ref(0)
const RoleList = ref([])
const checkRoleList = ref([])
const filterRoleList = ref([])
const travelList = ref([])
const checkTravelList = ref([])
const filterTravelList = ref([])
const reasonCodeList = ref([])
const checkReasonCodeList = ref([])
const filterReasonCodeList = ref([])
const TYPES = ref(ALL_TYPES)

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      selectedList.value = []
      if (selectedList.value?.length > 0) {
        selectedList.value = props.beforeList
        currentDepartment.value = props.beforeList[0] || {}
      }
    }
  }
)

const MATCH_DATA = computed(() => {
  return TYPES_MAP[props.popSelectType]
})

const items = computed(() => {
  const { extra } = MATCH_DATA.value
  let data: [IItemsOptions] = props.showDepartment
    ? [
        {
          type: 'tree',
          label: '组织架构',
          data: DepartmentList.value,
          defaultExpandedKeys: FirstDepIdList.value,
          emitLoadNodeEvent: 'loadNode',
          emitCheckChangeEvent: 'selectStuff'
        }
      ]
    : ([] as any)
  if (extra) {
    if (extra.includes('role')) {
      data.push({
        type: 'checkbox',
        label: '角色',
        data: filterRoleList.value,
        checkList: checkRoleList.value,
        emitCheckboxChangeEvent: 'roleChange'
      })
    }
    if (extra.includes('travel')) {
      data.push({
        type: 'checkbox',
        label: '差标',
        data: filterTravelList.value,
        checkList: checkTravelList.value,
        emitCheckboxChangeEvent: 'travelChange'
      })
    }
    if (extra.includes('reasonCode')) {
      data.push({
        type: 'checkbox',
        label: '理由码',
        data: filterReasonCodeList.value,
        checkList: checkReasonCodeList.value,
        emitCheckboxChangeEvent: 'reasonCodeChange',
        props: {
          label: 'Name',
          key: 'Id'
        }
      })
    }
  }
  return data
})

async function getRoleList() {
  const res = await GetRoleList()
  const data = res.data as any
  filterRoleList.value = RoleList.value = data.RoleList || []
}

async function getTravelList() {
  const res = await GetEnterpriseRoleSurvey()
  const data = res.data as any
  filterTravelList.value = travelList.value = data.RoleList || []
}

async function getReasonCodeList() {
  const res = await GetCostTypeList({
    type: '2',
    page: { page: 1, size: 10000 }
  })
  const data = res.data as any
  const list = data.List as any[]
  filterReasonCodeList.value = reasonCodeList.value = list.map((item) => {
    return {
      ...item,
      OriginalName: item.Name,
      Name: `【${item.OuterCode}】${item.Name}`
    }
  })
}

async function getDepartmentList(DMId = 0, SearchByDeptId = true) {
  return await GetDepartmentList({ DMId, SearchByDeptId })
}

onBeforeMount(() => {
  const { inputPlaceholder: placeholder, errorMsg: msg, getInitialData, extra } = MATCH_DATA.value
  inputPlaceholder.value = placeholder
  errorMsg.value = msg
  selectedList.value = []
  checkRoleList.value = []
  checkTravelList.value = []
  checkReasonCodeList.value = []
  if (props.beforeList && props.beforeList.length > 0) {
    selectedList.value = props.beforeList
    if (extra) {
      props.beforeList.forEach((item: any) => {
        if (String(item.Type) === 'role' && extra.includes('role')) {
          checkRoleList.value.push(Number(item.RoleId))
        }
        if (String(item.Type) === 'travel' && extra.includes('travel')) {
          checkTravelList.value.push(Number(item.RoleId))
        }
        if (String(item.Type) === 'reasonCode' && extra.includes('reasonCode')) {
          checkReasonCodeList.value.push(Number(item.Id))
        }
      })
    }
  }
  if (getInitialData && extra) {
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
})

async function loadNode({ node, resolve }: any) {
  const { disableClickDepartment, includePerson } = MATCH_DATA.value
  const ChildDepartmentList = node.data.ChildDepartmentList as any[]
  if (Number(node.level) === 0) {
    let resDep: any[] = []
    const res = await getDepartmentList()
    const data = res.data as any
    resDep = data.DepartmentList || []
    AllDepartmentList.value = AllDepartmentList.value.concat(resDep[0].ChildDepartmentList)
    if (disableClickDepartment) {
      resDep.forEach((item) => {
        item.disabled = true
      })
    }
    if (includePerson) {
      const response = await getDepStuffList(resDep[0].Id)
      const depData = response.data as any
      let stuffList = (depData.StuffList || []) as any[]
      StuffList.value = StuffList.value.concat(stuffList)
      stuffList.forEach((item) => {
        let obj = {
          //确保id 唯一
          Id: item.SIId,
          SIId: item.SIId,
          Name: item.Name,
          type: 'person',
          ChildDepartmentList: [],
          WorkCode: item.WorkCode,
          CustomerId: item.CustomerId,
          ParentDepartmentId: item.DepartmentId
        }
        resDep[0].ChildDepartmentList.unshift(obj)
      })
    }
    resolve(resDep)
    DepartmentList.value = resDep
    FirstDepIdList.value = [resDep[0].Id]
  } else if (ChildDepartmentList.length !== 0) {
    if (disableClickDepartment) {
      ChildDepartmentList.forEach((item) => {
        if (String(item.type) !== 'person') item.disabled = true
      })
    }
    return resolve(node.data.ChildDepartmentList)
  } else {
    if (String(node.data.type) === 'person') {
      return resolve([])
    }
    let resDep = []
    const res = await getDepartmentList(node.data.Id)
    const data = res.data as any
    resDep = (data.DepartmentList || []) as any[]
    AllDepartmentList.value = AllDepartmentList.value.concat(resDep)
    if (disableClickDepartment) {
      resDep.forEach((item) => {
        item.disabled = true
      })
    }
    if (includePerson) {
      await addPerson(resDep, node.data.Id, resolve)
    } else {
      resolve(resDep)
    }
  }
  await nextTick()

  selectedList.value.forEach((item: any) => {
    StuffList.value.forEach((v: any) => {
      if (String(v.CustomerId) === String(item.CustomerId)) {
        let findDep = AllDepartmentList.value.find(
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

async function addPerson(resDep: any, id: string, resolve: any) {
  let resetList: any = []
  let res = await getDepStuffList(id)
  const data = res.data as any
  let stuffList = (data.StuffList || []) as any[]
  StuffList.value = StuffList.value.concat(stuffList)
  stuffList.forEach((item) => {
    let obj = {
      //确保id 唯一
      Id: item.SIId,
      SIId: item.SIId,
      Name: item.Name,
      type: 'person',
      ChildDepartmentList: [],
      WorkCode: item.WorkCode,
      CustomerId: item.CustomerId,
      ParentDepartmentId: item.DepartmentId
    }
    resetList.push(obj)
  })
  resolve(resetList.concat(resDep))
}

async function getDepStuffList(DepartmentId: any) {
  return await GetCustomerStuffList({
    Page: {
      Index: 1,
      Size: 10000
    },
    DepartmentId,
    IsSeachChildCustomer: true
  })
}

function selectStuff({ data, checked }: any) {
  const matchData = MATCH_DATA.value
  const { name } = matchData[name](data, checked)
}

function selectPerson(item: any, state: any): any {
  if (String(item.type) !== 'person') {
    //部门
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
          Id: item.Id,
          SIId: item.SIId,
          Name: item.Name,
          CustomerId: item.CustomerId,
          WorkCode: item.WorkCode,
          Type: 'person',
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
      checkNodeChildIsClean()
    }
    setAllStuffCheckedById(item.CustomerId, state)
  }
}

function selectDepAndStuff(item: any, state: any) {
  if (String(item.type) !== 'person') {
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
          IsIncludeChild: needDepartment.value,
          ParentDepartmentId: item.ParentDepartmentId
        })
      }
    } else {
      let findIndex = selectedList.value.findIndex((a: any) => String(a.Id) === String(item.Id))
      if (findIndex !== -1) {
        selectedList.value.splice(findIndex, 1)
      }
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
      // this.checkNodeChildIsClean();
    }
    setAllStuffCheckedById(item.CustomerId, state)
  }
}

function checkNodeChildIsClean() {
  AllDepartmentList.value.forEach((item: any) => {
    let isHasSelect = false
    let allChildDep = AllDepartmentList.value.filter((v: any) => v.Path.includes(item.Id))
    let tenpSelect = [] as any[]
    StuffList.value.forEach((x: any) => {
      if (selectedList.value.find((y) => String(y.CustomerId) === String(x.CustomerId))) {
        tenpSelect.push({ ...x })
      }
    })
    tenpSelect.forEach((v) => {
      if (allChildDep.find((x: any) => String(x.Id) === String(v.DepartmentId))) {
        isHasSelect = true
      }
    })
    if (!isHasSelect) {
      setTreeChecked(item.Id, false)
    }
  })
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
  if (needDepartment.value) {
    AllDepartmentList.value.forEach((item: any) => {
      if (item.Path.includes(parentId)) {
        StuffList.value.forEach((v: any) => {
          if (String(v.DepartmentId) === String(item.Id)) {
            selectStuff({
              data: {
                Id: v.SIId,
                SIId: v.SIId,
                Name: v.Name,
                type: 'person',
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
            type: 'person',
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
  CustomSelector.value.setTreeChecked(id, checked)
}

function deleteSelected(item: any) {
  const { extra } = MATCH_DATA.value
  if (extra && extra.includes(String(item.Type))) {
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

  let findIndex = selectedList.value.findIndex((x: any) => {
    return String(x.Name) === String(item.Name)
  })
  if (findIndex !== -1) {
    selectedList.value.splice(findIndex, 1)
  }
  if (extra) {
    if (extra.includes('role')) {
      checkRoleList.value = checkRoleList.value.filter(
        (n: any) => String(item.RoleId) !== String(n)
      )
    }
    if (extra.includes('travel')) {
      checkTravelList.value = checkTravelList.value.filter(
        (n: any) => String(item.RoleId) !== String(n)
      )
    }
    if (extra.includes('reasonCode')) {
      checkReasonCodeList.value = checkReasonCodeList.value.filter(
        (n) => String(item.Id) !== String(n)
      )
    }
  }
}

async function searchStuff({ searchKey, tabType }: any) {
  const { searchType, extra } = MATCH_DATA.value as any
  if (String(tabType) === 'checkbox') {
    if (extra.includes('role')) {
      searchRole(searchKey)
    }
    if (extra.includes('travel')) {
      searchTravel(searchKey)
    }
    if (extra.includes('reasonCode')) {
      searchReasonCode(searchKey)
    }
    return
  }
  let param = {
    Key: searchKey,
    RequestType: searchType
  }
  const res = await SearchStuffAndDepartment(param)
  const data = res.data as any
  let searchStuffList
  searchStuffList = data.StuffList.map((item: any) => {
    return {
      ...item,
      Type: 'person'
    }
  })
  let searDepList
  searDepList = data.DepartmentList.map((item: any) => {
    return {
      ...item,
      Type: 'department'
    }
  })
  searchStuffList.value = searchStuffList.concat(searDepList)
}

function searchRole(key: any) {
  if (!key) {
    filterRoleList.value = RoleList.value
  } else {
    filterRoleList.value = RoleList.value.filter((item: any) => {
      return item.RoleName.includes(key)
    })
  }
}

function searchTravel(key: any) {
  if (!key) {
    filterTravelList.value = travelList.value
  } else {
    filterTravelList.value = travelList.value.filter((item: any) => {
      return item.RoleName.includes(key)
    })
  }
}

function searchReasonCode(key: any) {
  if (!key) {
    filterReasonCodeList.value = reasonCodeList.value
  } else {
    filterReasonCodeList.value = reasonCodeList.value.filter((item: any) => {
      return item.Name.includes(key)
    })
  }
}

function searchSelectStuff(data: any) {
  const list = selectedList.value as any[]
  if (props.isSingleChoice && list?.length > 0) {
    list.forEach((sitem: any) => {
      deleteSelected(sitem)
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
    obj.IsIncludeChild = needDepartment.value
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

function addOk() {
  if (selectedList.value.length < 1 && props.isNeed) {
    return ElMessage({
      message: errorMsg.value,
      type: 'warning'
    })
  }
  emit('update:visible', false)
  emit('addOk', {
    list: selectedList.value,
    type: props.popSelectType,
    needSonDepartment: needDepartment.value
  })
}

function dialogClose(done: any) {
  done()
  isSearch.value = false
  searchStuffList.value = []
  needDepartment.value = true
  emit('update:visible', false)
}

function getCustomersById(CustomerId: any) {
  let temSelectList = [] as any[]
  StuffList.value.forEach((v: any) => {
    if (String(v.CustomerId) === String(CustomerId)) {
      temSelectList.push({
        Name: v.Name,
        Type: 2,
        CustomerId: v.CustomerId,
        Id: v.SIId,
        SIId: v.SIId
      })
      if (FirstDepIdList.value.findIndex((a: any) => String(v.DepartmentId) === String(a)) === -1) {
        FirstDepIdList.value.push(v.DepartmentId)
      }
      setTreeChecked(v.SIId, true)
    }
  })
  return temSelectList
}

function delCustomersById(CustomerId: any) {
  let temList = [] as any[]
  selectedList.value.forEach((item: any) => {
    temList.push(item)
  })
  for (let i = 0; i < temList.length; i++) {
    if (String(temList[i].CustomerId) === String(CustomerId)) {
      let siid = temList[i].SIId
      temList.splice(i, 1)
      setTreeChecked(siid, false)
      i--
    }
  }
  selectedList.value = temList
}

function checkTab(type: any) {
  tabType.value = type
}

function roleChange({ event, data, key }: any) {
  if (event) {
    //选中
    selectedList.value.push({
      Id: '',
      RoleId: data.RoleId,
      SIId: '',
      Name: data.RoleName,
      CustomerId: '',
      WorkCode: '',
      Type: 'role'
    })
    checkRoleList.value.push(data[key])
  } else {
    //删除
    selectedList.value = selectedList.value.filter((a: any) => String(a[key]) !== String(data[key]))
    checkRoleList.value = checkRoleList.value.filter((a: any) => String(a) !== String(data[key]))
  }
}

function travelChange({ event, data, key }: any) {
  if (event) {
    //选中
    selectedList.value.push({
      Id: '',
      RoleId: data.RoleId,
      SIId: '',
      Name: data.RoleName,
      CustomerId: '',
      WorkCode: '',
      Type: 'travel'
    })
    checkTravelList.value.push(data[key])
  } else {
    //删除
    selectedList.value = selectedList.value.filter((a: any) => String(a[key]) !== String(data[key]))
    checkTravelList.value = checkTravelList.value.filter(
      (a: any) => String(a) !== String(data[key])
    )
  }
}

function reasonCodeChange({ event, data, key }: any) {
  if (event) {
    //选中
    selectedList.value.push({
      Id: data.Id,
      Name: data.Name,
      OriginalName: data.OriginalName,
      OuterCode: data.OuterCode,
      Type: 'reasonCode'
    })
    checkReasonCodeList.value.push(data[key])
  } else {
    //删除
    selectedList.value = selectedList.value.filter((a: any) => String(a[key]) !== String(data[key]))
    checkReasonCodeList.value = checkReasonCodeList.value.filter(
      (a: any) => String(a) !== String(data[key])
    )
  }
}
</script>

<style lang="less" scoped>
.GroupSelector {
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }

  /deep/ .el-dialog__headerbtn {
    top: 16px;
    right: 20px;
  }

  /deep/ .el-input__prefix {
    left: 0;
    top: 2px;
  }

  /deep/ .el-input__suffix {
    top: 2px;
  }

  /deep/ .el-dialog__header {
    border-bottom: 1px solid #e2e2e2;
    padding: 15px 20px;
  }

  /deep/ .el-dialog__footer {
    padding: 5px 20px 15px;
  }

  .footer {
    display: flex;
    justify-content: center;
  }

  .popu-main-sec {
    flex: 1;
    padding-right: 20px;

    &:last-child {
      padding-right: 0;
    }
  }

  .popu-main-sec-title {
    margin-bottom: 10px;
  }

  .popu-main-sec-box {
    background: #f8f8f8;
    padding: 10px;
    height: 360px;
    width: 300px;

    .scroll-lf-box,
    .scroll-box {
      height: 310px;
      overflow-y: auto;
    }

    .scroll-rt-box {
      height: 340px;
      overflow-y: auto;
    }

    .selected-list {
      font-size: 14px;
      line-height: 30px;
      margin-right: 4px;

      i {
        cursor: pointer;
      }
    }
  }

  .checkSonDepartment {
    width: 100%;
    padding: 0 10px 20px 10px;
  }
}
</style>
