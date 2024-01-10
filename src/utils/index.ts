export function GetBaseAPIURL() {
  const baseUrl = process.env.VUE_APP_BASE_API
  let temp = ''
  const url = window.location.host
  if (url.indexOf('maiwei') >= 0) {
    temp = baseUrl + 'maiwei/'
  } else if (url.indexOf('mingzhe') >= 0) {
    temp = baseUrl + 'mingzhe/'
  } else if (url.indexOf('ruipai') >= 0) {
    temp = baseUrl + 'ruipai/'
  } else {
    temp = baseUrl + 'tripwise/'
  }
  return temp
}
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
