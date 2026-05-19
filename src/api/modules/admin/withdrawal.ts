/**
 * 提现管理 API
 */
import request from '@/utils/http'

export interface WithdrawalItem {
  id: string
  userId: string
  userPhone: string
  amount: string
  bankName: string
  bankCard: string
  realName: string
  status: number
  statusName: string
  adminRemark: string
  createdAt: string
  processedAt: string
}

export interface WithdrawalListResponse {
  list: WithdrawalItem[]
  total: number
  page: number
  limit: number
}

export function fetchWithdrawalList(params: {
  status?: number
  keyword?: string
  page?: number
  limit?: number
}) {
  return request.get<WithdrawalListResponse>({ url: '/api/v1/admin/withdrawals', params })
}

export function fetchApproveWithdrawal(id: string) {
  return request.post({ url: `/api/v1/admin/withdrawals/${id}/approve` })
}

export function fetchRejectWithdrawal(id: string, reason: string) {
  return request.post({ url: `/api/v1/admin/withdrawals/${id}/reject`, data: { reason } })
}
