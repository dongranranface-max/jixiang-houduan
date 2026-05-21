/**
 * 管理后台数据看板 API
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

function toMoney(val: unknown): string {
  const n = Number(val)
  return Number.isFinite(n) ? String(n) : '0'
}

function normalizeStats(raw: Record<string, unknown>): DashboardStats {
  return {
    totalUsers: Number(raw.totalUsers) || 0,
    todayNewUsers: Number(raw.todayNewUsers) || 0,
    totalOrders: Number(raw.totalOrders) || 0,
    todayOrders: Number(raw.todayOrders) || 0,
    totalRevenue: toMoney(raw.totalRevenue),
    todayRevenue: toMoney(raw.todayRevenue),
    pendingWithdrawals: Number(raw.pendingWithdrawals) || 0,
    pendingWithdrawalsAmount: toMoney(raw.pendingWithdrawalsAmount),
    totalFinancialInvested: toMoney(raw.totalFinancialInvested),
    todayFinancialInvested: toMoney(raw.todayFinancialInvested)
  }
}

export function fetchDashboardStats() {
  return request
    .get<Record<string, unknown>>({ url: '/api/v1/admin/stats/dashboard' })
    .then(normalizeStats)
}
