export function useDefaultList(
  defaultSelected: any[],
  extra: any[],
  selectedAll: any[],
  propsName: any
) {
  const list = reactive<any[]>([])
  const selectedList = reactive<any[]>([])
  const filterList = reactive<any[]>([])

  // 默认值
  if (defaultSelected?.length > 0 && extra?.length > 0) {
    defaultSelected.forEach((item: any) => {
      if (String(item.Type) === propsName.name && extra.includes(propsName.name)) {
        selectedList.splice(selectedList.length, 0, item[propsName.idKey])
      }
    })
  }

  function search(key: any) {
    if (!key) {
      filterList.splice(0, filterList.length, ...list)
    } else {
      filterList.splice(
        0,
        filterList.length,
        ...list.filter((item: any) => item[propsName.nameKey].includes(key))
      )
    }
  }

  function deleteByItem(item: any) {
    const idKey = String(item[propsName.idKey])

    const indexAll = selectedAll.findIndex((a: any) => String(a[propsName.idKey]) === idKey)
    if (indexAll !== -1) {
      selectedAll.splice(indexAll, 1)
    }

    const indexToRemove = selectedList.findIndex((a: any) => String(a[propsName.idKey]) === idKey)
    if (indexToRemove !== -1) {
      selectedList.splice(indexToRemove, 1)
    }
  }
  function change({ event, data }: any) {
    if (event) {
      selectedAll.push({
        Id: '',
        SIId: '',
        RoleId: data[propsName.idKey],
        Name: data[propsName.nameKey],
        CustomerId: '',
        WorkCode: '',
        Type: propsName.name
      })
      selectedList.splice(selectedList.length, 0, data[propsName.idKey])
    } else {
      deleteByItem(data)
    }
  }

  function setData(data: any) {
    list.splice(0, list.length, ...(data[propsName.dataKey] || []))
    filterList.splice(0, filterList.length, ...list)
  }

  return {
    selectedList,
    filterList,
    setData,
    search,
    change,
    deleteByItem
  }
}
