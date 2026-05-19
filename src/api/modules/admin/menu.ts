/**
 * 管理员菜单 API
 * GET /api/v1/admin/menu
 *
 * 返回适配前端动态路由的菜单结构
 */
import request from '@/utils/http'
import type { AppRouteRecord } from '@/types/router'

export interface MenuItem {
  id: string
  name: string
  path: string
  component?: string
  icon?: string
  hidden?: boolean
  keepAlive?: boolean
  children?: MenuItem[]
}

export function fetchAdminMenu() {
  return request.get<MenuItem[]>({ url: '/api/v1/admin/menu' })
}
