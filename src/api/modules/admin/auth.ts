/**
 * 管理员认证 API
 * POST /api/v1/auth/admin/login
 */
import request from '@/utils/http'

/** 管理员登录参数 */
export interface AdminLoginParams {
  username: string
  password: string
}

/** 管理员登录响应 */
export interface AdminLoginResponse {
  token: string
  userId: string
  username: string
  role: string
}

/** 管理员登录 */
export function fetchAdminLogin(params: AdminLoginParams) {
  return request.post<AdminLoginResponse>({
    url: '/api/v1/auth/admin/login',
    params
  })
}
