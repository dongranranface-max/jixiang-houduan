/**
 * 系统配置 API
 */
import request from '@/utils/http'

export interface SystemConfig {
  pointsEarnRate: string
  referralBonusRate: string
  exchangeToConsumerRate: string
  withdrawalFeeRate: string
  registerReward: string
}

export function fetchSystemConfig() {
  return request.get<SystemConfig>({ url: '/api/v1/admin/config' })
}

export function fetchUpdateSystemConfig(data: Partial<SystemConfig>) {
  return request.put({ url: '/api/v1/admin/config', data })
}
