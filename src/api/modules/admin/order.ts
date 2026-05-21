/**
 * 订单管理 API
 */
import request from '@/utils/http'

export interface OrderItem {
  orderNo: string
  orderType: number
  orderTypeName: string
  status: number
  statusName: string
  userId: string
  userPhone: string
  totalAmount: string
  payAmount: string
  pointsEarned: string
  remark: string
  expressCompany?: string
  expressNo?: string
  logistics?: {
    company: string
    trackingNo: string
    status?: string
  } | null
  items: {
    productName: string
    coverImage?: string
    price: string | number
    quantity: number
    specs?: string
    skuSpecs?: Record<string, string>
    subtotal?: string | number
  }[]
  createdAt: string
  paidAt: string
  shippedAt: string
  completedAt: string
}

export interface OrderListResponse {
  list: OrderItem[]
  total: number
  page: number
  limit: number
}

export function fetchOrderList(params: {
  orderNo?: string
  orderType?: number
  status?: number
  page?: number
  limit?: number
}) {
  return request.get<OrderListResponse>({ url: '/api/v1/admin/orders', params })
}

export function fetchShipOrder(
  orderNo: string,
  logistics: { company: string; trackingNo: string }
) {
  return request.post({ url: `/api/v1/admin/orders/${orderNo}/ship`, data: logistics })
}
