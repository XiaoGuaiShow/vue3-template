export interface CompanyInfo {
  availableDays: number,
  balance: number,
  companyName: string,
  dailyConsumption: number,
  debitType: number,
  id: string,
  invoiceTitles: string| null,
  isValid: number,
  needRecharge: number,
  settlementOfficer: string|null,
  settlements: any[] | null,
  [propName: string]: any
}