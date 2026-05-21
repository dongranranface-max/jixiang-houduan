import request from '@/utils/http'
import { mapAdminRoleToFrontend, mapAdminButtons } from '@/constants/mall'

/** 管理员登录响应（标准格式） */
export interface AdminLoginData {
  token: string
  admin: {
    id: string
    username: string
    nickname: string
    role: string
    roles?: string[]
    buttons?: string[]
  }
}

/** 管理员 profile / 登录扁平字段 */
interface AdminProfileFields {
  id?: string
  userId?: string
  username?: string
  nickname?: string
  role?: string
  roles?: string[]
  buttons?: string[]
}

function buildUserInfo(fields: AdminProfileFields): Api.Auth.UserInfo {
  const id = fields.id || fields.userId || ''
  const role = fields.role || 'super'
  const roles = fields.roles?.length ? fields.roles : mapAdminRoleToFrontend(role)
  const username = fields.username || 'admin'
  return {
    userId: id,
    userName: username,
    username,
    nickname: fields.nickname || username,
    role,
    roles,
    buttons: fields.buttons?.length ? fields.buttons : mapAdminButtons(role)
  }
}

/**
 * 兼容多种后端登录响应：
 * - 新：{ token, admin: { id, ... } }
 * - 旧：{ token, userId, username, role, ... }
 * - 仅 token：从 JWT 解析
 */
export function normalizeAdminLogin(raw: unknown, tokenFallback?: string): AdminLoginData {
  const data = (raw || {}) as Record<string, unknown>
  const token = String(data.token || tokenFallback || '')
  if (!token) {
    throw new Error('登录失败：未返回 token')
  }

  const adminRaw = data.admin as AdminProfileFields | undefined
  if (adminRaw && (adminRaw.id || adminRaw.userId)) {
    const admin = buildUserInfo(adminRaw)
    return { token, admin: { ...admin, id: admin.userId } }
  }

  if (data.userId || data.id) {
    const admin = buildUserInfo(data as AdminProfileFields)
    return { token, admin: { ...admin, id: admin.userId } }
  }

  const fromJwt = parseAdminFromToken(token)
  if (fromJwt) {
    return {
      token,
      admin: {
        id: fromJwt.userId,
        username: fromJwt.username,
        nickname: fromJwt.nickname || fromJwt.username,
        role: fromJwt.role,
        roles: fromJwt.roles,
        buttons: fromJwt.buttons
      }
    }
  }

  throw new Error('登录失败：响应格式无法识别')
}

/** 从 JWT 解析管理员身份（登录/profile 不可用时的兜底） */
export function parseAdminFromToken(token: string): Api.Auth.UserInfo | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const json = decodeURIComponent(
      atob(part.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(json) as {
      sub?: string
      type?: string
      username?: string
      role?: string
    }
    if (payload.type !== 'admin' || !payload.sub) return null
    return buildUserInfo({
      id: payload.sub,
      username: payload.username,
      role: payload.role || 'super'
    })
  } catch {
    return null
  }
}

/** 将后端管理员数据映射为 store UserInfo */
export function mapAdminToUserInfo(admin: AdminProfileFields & { id?: string }): Api.Auth.UserInfo {
  return buildUserInfo({ ...admin, id: admin.id || admin.userId })
}

/**
 * 管理员登录
 */
export function fetchLogin(params: { username: string; password: string }) {
  return request
    .post<unknown>({
      url: '/api/v1/auth/admin/login',
      params,
      showErrorMessage: true
    })
    .then((raw) => normalizeAdminLogin(raw))
}

/**
 * 静默拉取 profile（可选，失败不弹窗）
 */
async function fetchProfileSilent(): Promise<Api.Auth.UserInfo | null> {
  const paths = ['/api/v1/auth/admin/profile', '/api/v1/admin/profile']
  for (const url of paths) {
    try {
      const res = await request.get<AdminProfileFields>({ url, showErrorMessage: false })
      return mapAdminToUserInfo(res)
    } catch {
      // 继续尝试下一个地址
    }
  }
  return null
}

/**
 * 确保拿到完整管理员信息（登录后路由守卫用）
 * 顺序：已有缓存 → 静默 profile → JWT 解析
 */
export async function ensureAdminUserInfo(
  token: string,
  cached?: Partial<Api.Auth.UserInfo> | null
): Promise<Api.Auth.UserInfo> {
  if (cached?.userId && cached?.roles?.length) {
    return cached as Api.Auth.UserInfo
  }

  const profile = await fetchProfileSilent()
  if (profile?.userId && profile?.roles?.length) {
    return profile
  }

  const fromJwt = parseAdminFromToken(token)
  if (fromJwt?.userId && fromJwt?.roles?.length) {
    return fromJwt
  }

  throw new Error('无法获取管理员权限信息，请重新登录')
}

/** @deprecated 请传入 token，使用 ensureAdminUserInfo */
export function fetchGetUserInfo(token: string, cached?: Partial<Api.Auth.UserInfo> | null) {
  return ensureAdminUserInfo(token, cached)
}
