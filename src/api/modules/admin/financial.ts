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
  annualRate: string | number
  cycle: number
  cycleUnit: string
  minAmount: string | number
  maxAmount: string | number
  earlyRedeemFee: string
  totalInvested: string | number
  investedCount: number
  riskLevel: number
  riskName: string
  status: number
  statusName: string
  createdAt: string
}

export interface FinancialProductParams {
  name?: string
  description?: string
  type?: string | number
  annualRate?: number | string
  cycleDays?: number
  minAmount?: number | string
  totalAmount?: number | string
  earlyRedeemFee?: number | string
  status?: number
}

export function fetchFinancialProductList() {
  return request
    .get<{ list: FinancialProductItem[] }>({ url: '/api/v1/admin/financial/products' })
    .then((res) => res.list || [])
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

export interface HoldingItem {
  id: string
  userId: string
  userPhone: string
  productId: string
  productName: string
  amount: string | number
  expectedEarning?: number
  actualEarning?: number
  startDate?: string
  endDate?: string
  status: number
  statusName: string
  createdAt: string
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
