export interface FeeTypeItem {
  feeType: number
  totalPrice: string
}

export interface ProductTypeItem {
  productType: number
  productTotalPrice: string
  feeDetailDTOList: FeeTypeItem[]
}

export interface FeeClassItem {
  feeClass: number
  productDTOList: ProductTypeItem[]
}
