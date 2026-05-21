import request from '@/utils/http'
import { mapAdminRoleToFrontend } from '@/constants/mall'

/** 管理员登录响应（后端返回的原始格式） */
interface AdminLoginData {
  token: string
  admin: {
    id: string
    username: string
    nickname: string
    role: string
  }
}

/** 管理员 profile 响应 */
interface AdminProfileData {
  id: string
  username: string
  nickname: string
  role: string
  roles?: string[]
  buttons?: string[]
}

/**
 * 管理员登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: { username: string; password: string }) {
  return request.post<AdminLoginData>({
    url: '/api/v1/auth/admin/login',
    params
  })
}

/**
 * 获取当前管理员信息
 * @returns 管理员信息（适配 store 的 UserInfo 格式）
 */
export function fetchGetUserInfo() {
  return request
    .get<AdminProfileData>({
      url: '/api/v1/admin/profile'
    })
    .then((res) => {
      const roles = res.roles?.length ? res.roles : mapAdminRoleToFrontend(res.role)
      return {
        userId: res.id,
        userName: res.username,
        username: res.username,
        nickname: res.nickname,
        role: res.role,
        roles,
        buttons: res.buttons || []
      } as Api.Auth.UserInfo
    })
}
