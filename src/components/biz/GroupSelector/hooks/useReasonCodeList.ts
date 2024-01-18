import { GetCostTypeList } from '@/api/modules/expensecontrol.ts'
import { useDefaultList } from '@/components/biz/GroupSelector/hooks/useDefaultList.ts'

const label = '理由码'
const propsName = {
  name: 'reasonCode',
  idKey: 'Id',
  nameKey: 'Name',
  dataKey: 'List'
}

export function useReasonCodeList(defaultSelected: any[], extra: any[], selectedAll: any[]) {
  const { selectedList, filterList, setData, search, change, deleteByItem } = useDefaultList(
    defaultSelected,
    extra,
    selectedAll,
    propsName
  )

  function fetchData() {
    GetCostTypeList({
      type: '2',
      page: { page: 1, size: 10000 }
    }).then((res: any) => {
      const response = res.data as any
      const data = response[propsName.dataKey]?.map((item: any) => {
        return {
          ...item,
          OriginalName: item.Name,
          Name: `【${item.OuterCode}】${item.Name}`
        }
      }) as any[]
      setData(data)
    })
  }

  return {
    reasonCodeConfig: {
      name: propsName.name,
      type: 'checkbox',
      label,
      data: filterList,
      checkList: selectedList,
      emitCheckboxChangeEvent: 'reasonCodeChange',
      props: {
        label: 'Name',
        key: 'Id'
      }
    },
    getReasonCodeList: fetchData,
    handleReasonCodeSearch: search,
    handleReasonCodeChange: change,
    handleReasonCodeDeleteByItem: deleteByItem
  }
}
