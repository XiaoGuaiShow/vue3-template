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
  const { selectedList, filterList, setData, search, change, deleteByItem } = useDefaultList(
    defaultSelected,
    extra,
    selectedAll,
    propsName
  )

  function fetchData() {
    GetRoleList().then((res: any) => {
      const data = res.data as any
      setData(data)
    })
  }

  return {
    roleConfig: {
      type: 'checkbox',
      label,
      data: filterList,
      checkList: selectedList,
      emitCheckboxChangeEvent: 'roleChange'
    },
    getRoleList: fetchData,
    handleRoleSearch: search,
    handleRoleChange: change,
    handleRoleDeleteByItem: deleteByItem
  }
}
