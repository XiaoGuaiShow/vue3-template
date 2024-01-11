import { ResponseOptions } from '@/api/axiosInstance.ts'

// 统一数据格式
export const formatResponse = (response: ResponseOptions) => {
  const { code, msg, data, result } = lowercaseKeysObject(response.data)
  return {
    code,
    msg,
    data: data || result
  }
}

// 将对象的所有键转换为小写
export const lowercaseKeysObject = (originalObject: any) => {
  return Object.keys(originalObject).reduce((acc: any, key: string) => {
    acc[key.toLowerCase()] = originalObject[key]
    return acc
  }, {})
}
