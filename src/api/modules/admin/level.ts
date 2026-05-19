/**
 * 会员等级配置 API
 */
import request from '@/utils/http'

export interface LevelConfigItem {
  level: number
  name: string
  icon: string
  minPerformance: number
  dailyBonus: string
}

export interface LevelConfigParams {
  level: number
  name: string
  icon: string
  minPerformance: number
  dailyBonus: string
}

export function fetchLevelConfigs() {
  return request.get<LevelConfigItem[]>({ url: '/api/v1/level/configs' })
}

export function fetchUpdateLevelConfig(id: number, data: LevelConfigParams) {
  return request.put({ url: `/api/v1/admin/level/configs/${id}`, data })
}
