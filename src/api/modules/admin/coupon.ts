/**
 * 优惠券管理 API
 */
import request from '@/utils/http'

export interface CouponItem {
  id: string
  name: string
  type: number
  typeName: string
  amount: string
  minAmount: string
  totalStock: number
  remainStock: number
  validDays: number
  status: number
  statusName: string
  createdAt: string
}

export interface CouponListResponse {
  list: CouponItem[]
  total: number
  page: number
  limit: number
}

export interface CouponParams {
  name: string
  type: number
  amount: string
  minAmount: string
  totalStock: number
  validDays: number
}

export function fetchCouponList(params?: { page?: number; limit?: number }) {
  return request.get<CouponListResponse>({ url: '/api/v1/admin/coupons', params })
}

export function fetchCreateCoupon(data: CouponParams) {
  return request.post({ url: '/api/v1/admin/coupons', data })
}

export function fetchUpdateCoupon(id: string, data: CouponParams) {
  return request.put({ url: `/api/v1/admin/coupons/${id}`, data })
}

export function fetchDeleteCoupon(id: string) {
  return request.del({ url: `/api/v1/admin/coupons/${id}` })
}
