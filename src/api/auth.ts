import request from '@/utils/http'

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
  return request.get<AdminProfileData>({
    url: '/api/v1/admin/profile'
  }).then((res) => {
    // 适配：后端返回 id，store 需要 userId
    return {
      userId: res.id,
      username: res.username,
      nickname: res.nickname,
      role: res.role,
    } as Api.Auth.UserInfo
  })
}
