/*
 * 1、选择人员（员工和部门都能选择），右侧只显示人员
 * 2、只能点击员工
 * 3、选择人员或部门，右侧显示部门和人员
 * 4、选择部门
 * 5、选择人员、部门、角色
 * 6、部门转移
 * */
import { ITypeMap } from '@/components/biz/GroupSelector/interface.ts'

export const TYPES_MAP: ITypeMap = {
  1: {
    type: 1,
    name: 'selectPerson',
    inputPlaceholder: '请输入员工姓名',
    errorMsg: '请选择员工！',
    searchType: 2, // 搜索类型
    includePerson: true // 是否包含人员
  },
  2: {
    type: 2,
    name: 'selectPerson',
    inputPlaceholder: '请输入员工姓名',
    errorMsg: '请选择员工！',
    searchType: 2, // 搜索类型
    includePerson: true, // 是否包含人员
    disableClickDepartment: true // 是否禁止点击部门
  },
  3: {
    type: 3,
    name: 'selectDepAndStuff',
    inputPlaceholder: '请输入关键字',
    errorMsg: '请选择人员或部门！',
    searchType: 0, // 搜索类型
    includePerson: true // 是否包含人员
  },
  4: {
    type: 4,
    name: 'selectDepartment',
    inputPlaceholder: '请输入部门名称',
    errorMsg: '请选择部门！',
    searchType: 1 // 搜索类型
  },
  5: {
    type: 5,
    name: 'selectDepAndStuff',
    inputPlaceholder: '请输入关键字',
    errorMsg: '请选人员、部门、角色！',
    searchType: 0, // 搜索类型
    getInitialData: true, // 是否获取初始数据
    includePerson: true, // 是否包含人员
    extra: ['role'] // 额外的数据
  },
  6: {
    type: 6,
    name: 'moveDepartment',
    inputPlaceholder: '请输入部门名称',
    errorMsg: '请选择部门！',
    searchType: 1 // 搜索类型
  },
  7: {
    type: 7,
    name: 'selectDepAndStuff',
    inputPlaceholder: '请输入关键字',
    errorMsg: '请选人员、部门、角色、差标！',
    searchType: 0, // 搜索类型
    getInitialData: true, // 是否获取初始数据
    includePerson: true, // 是否包含人员
    extra: ['role', 'travel'] // 额外的数据
  },
  8: {
    type: 8,
    name: 'reasonCode',
    inputPlaceholder: '请输入理由码名称',
    errorMsg: '请选择理由码！',
    searchType: 2, // 搜索类型
    getInitialData: true,
    extra: ['reasonCode'] // 额外的数据
  }
}

export const TYPES = {
  department: '部门',
  person: '人员',
  role: '角色',
  travel: '差标',
  reasonCode: '理由码'
}
