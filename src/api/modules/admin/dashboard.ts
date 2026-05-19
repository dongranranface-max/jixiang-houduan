/**
 * 管理后台数据看板 API
 * GET /api/v1/stats/dashboard
 */
import request from '@/utils/http'

export interface DashboardStats {
  totalUsers: number
  todayNewUsers: number
  totalOrders: number
  todayOrders: number
  totalRevenue: string
  todayRevenue: string
  pendingWithdrawals: number
  pendingWithdrawalsAmount: string
  totalFinancialInvested: string
  todayFinancialInvested: string
}

export function fetchDashboardStats() {
  return request.get<DashboardStats>({
    url: '/api/v1/stats/dashboard'
  })
}
