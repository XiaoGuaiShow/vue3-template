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
  const { checkList, filterList, setData, search, change, deleteByItem } = useDefaultList(
    defaultSelected,
    extra,
    selectedAll,
    propsName
  )
  const travelConfig = reactive({
    name: propsName.name,
    type: 'checkbox',
    label,
    emitCheckboxChangeEvent: 'travelChange'
  })

  function fetchData() {
    GetEnterpriseRoleSurvey().then((res: any) => {
      const data = {
        [propsName.dataKey]: res.data as any
      }
      setData(data)
    })
  }

  return {
    travelConfig,
    travelFilterList: filterList,
    travelCheckList: checkList,
    getTravelList: fetchData,
    handleTravelSearch: search,
    handleTravelChange: change,
    handleTravelDeleteByItem: deleteByItem
  }
}
