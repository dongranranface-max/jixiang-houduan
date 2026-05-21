/**
 * 推荐管理 API
 */
import request from '@/utils/http'

export interface ReferralRelationItem {
  userId: string
  phone: string
  nickname: string
  inviteCode: string
  parentId: string
  parentPhone: string
  parentNickname?: string
  referrerPhone: string
  inviteePhone: string
  inviteeLevel: number
  directCount: number
  teamCount: number
  teamPerformance: number
  createdAt: string
}

export interface ReferralListResponse {
  list: ReferralRelationItem[]
  total: number
  page: number
  limit: number
}

export interface ReferralSummary {
  totalReferrals: number
  activeReferrals: number
  totalBonus: number
  todayBonus: number
}

export function fetchReferralSummary() {
  return request.get<ReferralSummary>({ url: '/api/v1/admin/referral/summary' })
}

export function fetchReferralList(params: { keyword?: string; page?: number; limit?: number }) {
  return request.get<ReferralListResponse>({ url: '/api/v1/admin/referral/stats', params })
}
