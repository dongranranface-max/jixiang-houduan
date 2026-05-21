/**
 * 会员等级配置 API（管理端）
 */
import request from '@/utils/http'

export interface LevelConfigItem {
  level: number | string
  name: string
  icon: string
  minPerformance: number
  dailyBonus: string
}

export interface LevelConfigParams {
  level: number | string
  name: string
  icon: string
  minPerformance: number
  dailyBonus: string
}

export function fetchLevelConfigs() {
  return request
    .get<{ list: LevelConfigItem[] }>({ url: '/api/v1/admin/level/configs' })
    .then((res) => res.list || [])
}

export function fetchUpdateLevelConfig(level: number | string, data: LevelConfigParams) {
  return request.put({
    url: `/api/v1/admin/level/configs/${level}`,
    data
  })
}
