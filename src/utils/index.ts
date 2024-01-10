// 统一数据格式
// export const formatResponse = (response) => {
//   return {
//     code,
//     message,
//     data
//   }
// }

// 将对象的所有键转换为小写
export const lowercaseKeysObject = (originalObject: any) => {
  return Object.keys(originalObject).reduce((acc: any, key: string) => {
    acc[key.toLowerCase()] = originalObject[key]
    return acc
  }, {})
}
