/**
 * 理财项目管理 API
 */
import request from '@/utils/http'

export interface FinancialProductItem {
  id: string
  name: string
  description: string
  rateType: number
  rateTypeName: string
  displayRate: string
  rateValue: string
  annualRate: string
  cycle: number
  cycleUnit: string
  minAmount: string
  maxAmount: string
  earlyRedeemFee: string
  totalInvested: string
  investedCount: number
  riskLevel: number
  riskName: string
  status: number
  statusName: string
  createdAt: string
}

export interface FinancialProductParams {
  name: string
  description?: string
  rateType: number
  rateValue: string
  cycle: number
  minAmount: string
  maxAmount: string
  earlyRedeemFee?: string
  riskLevel: number
  status?: number
}

export function fetchFinancialProductList() {
  return request.get<FinancialProductItem[]>({ url: '/api/v1/admin/financial/products' })
}

export function fetchCreateFinancialProduct(data: FinancialProductParams) {
  return request.post({ url: '/api/v1/admin/financial/products', data })
}

export function fetchUpdateFinancialProduct(id: string, data: FinancialProductParams) {
  return request.put({ url: `/api/v1/admin/financial/products/${id}`, data })
}

export function fetchDeleteFinancialProduct(id: string) {
  return request.del({ url: `/api/v1/admin/financial/products/${id}` })
}

// 持仓管理
export interface HoldingItem {
  holdingId: string
  userId: string
  userPhone: string
  productId: string
  productName: string
  annualRate: string
  amount: string
  profit: string
  totalProfit: string
  status: number
  statusName: string
  autoRenew: boolean
  createdAt: string
  expireAt: string
}

export interface HoldingListResponse {
  list: HoldingItem[]
  total: number
  page: number
  limit: number
}

export function fetchHoldingList(params: {
  productId?: string
  userId?: string
  status?: number
  page?: number
  limit?: number
}) {
  return request.get<HoldingListResponse>({ url: '/api/v1/admin/financial/holdings', params })
}
