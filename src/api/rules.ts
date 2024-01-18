import { saveEnterpriseAccount } from './modules/parentCompany'
import { StringMappingType } from 'typescript'
import axiosInstance, { RequestConfig } from './axiosInstance.ts'

export interface ContractListItem {
  id: string
  paperCode: string
  systemCode: StringMappingType
}

export const getContractList = (): Promise<any> => {
  return axiosInstance({
    method: 'get',
    url: 'platform-web/settlement/rule/contract/list'
  })
}

export const getContractDetails = (contractId: string): Promise<any> => {
  return axiosInstance({
    method: 'get',
    url: 'platform-web/settlement/rule/contract/detail',
    params: { contractId }
  })
}

export const saveSettlementUser = (data: any): Promise<any> => {
  return axiosInstance({
    method: 'post',
    url: 'platform-web/settlement/rule/saveSettlement',
    data
  })
}
