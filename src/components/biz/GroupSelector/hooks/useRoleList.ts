import { GetRoleList } from '@/api/modules/common.ts'
import { useDefaultList } from '@/components/biz/GroupSelector/hooks/useDefaultList.ts'

const label = '角色'
const propsName = {
  name: 'role',
  idKey: 'RoleId',
  nameKey: 'RoleName',
  dataKey: 'RoleList'
}

export function useRoleList(defaultSelected: any[], extra: any[], selectedAll: any[]) {
  const { checkList, filterList, setData, search, change, deleteByItem } = useDefaultList(
    defaultSelected,
    extra,
    selectedAll,
    propsName
  )
  const roleConfig = reactive({
    name: propsName.name,
    type: 'checkbox',
    label,
    emitCheckboxChangeEvent: 'roleChange'
  })

  function fetchData() {
    GetRoleList().then((res: any) => {
      const data = res.data as any
      setData(data)
    })
  }

  return {
    roleConfig,
    roleFilterList: filterList,
    roleCheckList: checkList,
    getRoleList: fetchData,
    handleRoleSearch: search,
    handleRoleChange: change,
    handleRoleDeleteByItem: deleteByItem
  }
}
