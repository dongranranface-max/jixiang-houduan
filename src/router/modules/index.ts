import { AppRouteRecord } from '@/types/router'
import { adminRoutes } from './admin'

/**
 * 集享公社管理后台：仅注册业务路由
 */
export const routeModules: AppRouteRecord[] = [adminRoutes]
