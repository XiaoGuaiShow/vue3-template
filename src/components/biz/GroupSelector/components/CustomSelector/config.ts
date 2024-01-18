export const treeConfig = {
  nodeKey: 'Id',
  props: {
    label: 'Name',
    children: 'ChildDepartmentList',
    isLeaf: (data: any) => {
      return data.Type === 'person'
    }
  }
}

export const checkboxProps = {
  label: 'RoleName',
  key: 'RoleId'
}
