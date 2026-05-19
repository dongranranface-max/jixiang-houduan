/**
 * 用户管理 API
 */
import request from '@/utils/http'

/** 用户列表项 */
export interface UserItem {
  userId: string
  phone: string
  nickname: string
  avatar: string
  level: number
  levelName: string
  teamPerformance: number
  ecoPoints: string
  consumerPoints: string
  balance: string
  inviteCode: string
  parentInviteCode: string
  bankName: string
  bankCard: string
  status: number
  createdAt: string
}

/** 用户列表响应 */
export interface UserListResponse {
  list: UserItem[]
  total: number
  page: number
  limit: number
}

/** 用户搜索参数 */
export interface UserSearchParams {
  keyword?: string
  level?: number
  status?: number
  page?: number
  limit?: number
}

/** 获取用户列表 */
export function fetchUserList(params: UserSearchParams) {
  return request.get<UserListResponse>({
    url: '/api/v1/admin/users',
    params
  })
}

/** 修改用户状态 */
export function fetchUpdateUserStatus(userId: string, status: number) {
  return request.put({
    url: `/api/v1/admin/users/${userId}/status`,
    data: { status }
  })
}
