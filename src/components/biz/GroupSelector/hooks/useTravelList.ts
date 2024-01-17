import { GetEnterpriseRoleSurvey } from '@/api/modules/common.ts'
import { useDefaultList } from '@/components/biz/GroupSelector/hooks/useDefaultList.ts'

const label = '差标'
const propsName = {
  name: 'travel',
  idKey: 'RoleId',
  nameKey: 'RoleName',
  dataKey: 'RoleList'
}

export function useTravelList(defaultSelected: any[], extra: any[], selectedAll: any[]) {
  const { selectedList, filterList, setData, search, change, deleteByItem } = useDefaultList(
    defaultSelected,
    extra,
    selectedAll,
    propsName
  )

  function fetchData() {
    GetEnterpriseRoleSurvey().then((res: any) => {
      const data = {
        [propsName.dataKey]: res.data as any
      }
      setData(data)
    })
  }

  return {
    travelConfig: {
      type: 'checkbox',
      label,
      data: filterList,
      checkList: selectedList,
      emitCheckboxChangeEvent: 'travelChange'
    },
    getTravelList: fetchData,
    handleTravelSearch: search,
    handleTravelChange: change,
    handleTravelDeleteByItem: deleteByItem
  }
}
