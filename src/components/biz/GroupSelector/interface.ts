export interface IProps {
  label: string
  key: string
}

export interface ISelectedListOptions {
  Id: string
  SIId?: string
  Name: string
  CustomerId?: string
  WorkCode?: string
  Type: string
  ParentDepartmentId?: string
  IsIncludeChild?: boolean
  RoleId?: string
  OriginalName?: string
  OuterCode?: string
}

export type ITypeMap = Record<
  number,
  {
    type: number
    name: string
    inputPlaceholder: string
    errorMsg: string
    searchType: number
    includePerson?: boolean
    disableClickDepartment?: boolean
    getInitialData?: boolean
    extra?: string[]
  }
>

export interface IItemsOptions {
  type: string
  label: string
  data: any[]
  defaultExpandedKeys?: any[]
  emitLoadNodeEvent?: string
  emitCheckChangeEvent?: string
  checkList?: any[]
  emitCheckboxChangeEvent?: string
  props?: IProps
  nodeKey?: any
}

export interface ITabDataOptions {
  type?: string
  label?: string
  data?: any[]
  defaultExpandedKeys?: any[]
  emitLoadNodeEvent?: string
  emitCheckChangeEvent?: string
  nodeKey?: string
  props?: {
    label?: string
    children?: string
  }
}
