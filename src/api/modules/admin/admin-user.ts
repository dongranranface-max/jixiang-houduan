/**
 * 管理员账号与角色 API
 */
import request from '@/utils/http'

export interface AdminAccountItem {
  id: string
  username: string
  nickname: string
  role: string
  roleName: string
  status: number
  merchantId?: string
  lastLoginAt?: string
  createdAt: string
}

export interface RoleOption {
  value: string
  label: string
  desc: string
}

export function fetchAdminAccountList(params?: { page?: number; limit?: number }) {
  return request.get<{ list: AdminAccountItem[]; total: number }>({
    url: '/api/v1/admin/admins',
    params
  })
}

export function fetchRoleOptions() {
  return request.get<RoleOption[]>({ url: '/api/v1/admin/roles' })
}

export function fetchCreateAdminAccount(data: {
  username: string
  password: string
  nickname?: string
  role: string
  merchantId?: string
}) {
  return request.post({ url: '/api/v1/admin/admins', data })
}

export function fetchUpdateAdminAccount(
  id: string,
  data: {
    nickname?: string
    role?: string
    status?: number
    password?: string
    merchantId?: string
  }
) {
  return request.put({ url: `/api/v1/admin/admins/${id}`, data })
}
