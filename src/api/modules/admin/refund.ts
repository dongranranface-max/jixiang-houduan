/**
 * 退款管理 API
 */
import request from '@/utils/http'

export interface RefundItem {
  refundId: string
  orderNo: string
  userId: string
  userPhone: string
  orderType: number
  orderTypeName: string
  status: number
  statusName: string
  refundAmount: string
  refundPoints: string
  reason: number
  reasonName: string
  description: string
  images: string[]
  adminReply: string
  processedAt: string
  createdAt: string
}

export interface RefundListResponse {
  list: RefundItem[]
  total: number
  page: number
  limit: number
}

export function fetchRefundList(params: {
  status?: number
  orderNo?: string
  page?: number
  limit?: number
}) {
  return request.get<RefundListResponse>({ url: '/api/v1/admin/refunds', params })
}

export function fetchApproveRefund(orderNo: string) {
  return request.post({ url: `/api/v1/admin/orders/${orderNo}/refund/approve` })
}

export function fetchRejectRefund(orderNo: string, reason: string) {
  return request.post({ url: `/api/v1/admin/orders/${orderNo}/refund/reject`, data: { reason } })
}
