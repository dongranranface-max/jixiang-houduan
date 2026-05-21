/** 商城类型（与后端 ProductType / OrderType 一致） */
export const MALL_TYPE = {
  CONSUME: 1,
  EXCHANGE: 2,
  REDEEM: 3
} as const

export type MallType = (typeof MALL_TYPE)[keyof typeof MALL_TYPE]

export const MALL_TYPE_NAME: Record<number, string> = {
  1: '消费商城',
  2: '换购商城',
  3: '兑换商城'
}

export const ORDER_TYPE_NAME: Record<number, string> = {
  1: '消费订单',
  2: '换购订单',
  3: '兑换订单'
}

/** 后端 AdminRole → 前端路由角色 */
export const ADMIN_ROLE_MAP: Record<string, string[]> = {
  super: ['R_SUPER', 'R_ADMIN'],
  operator: ['R_ADMIN'],
  merchant: ['R_MERCHANT']
}

export function mapAdminRoleToFrontend(role: string): string[] {
  return ADMIN_ROLE_MAP[role] || ['R_ADMIN']
}

/** 管理端按钮权限（与 API admin-permissions 一致） */
export const ADMIN_ROLE_BUTTONS: Record<string, string[]> = {
  super: ['*'],
  operator: [
    'mall:view',
    'product:edit',
    'order:ship',
    'user:view',
    'coupon:edit',
    'ticket:reply',
    'refund:approve',
    'config:view'
  ],
  merchant: ['mall:view', 'product:edit', 'order:view']
}

export function mapAdminButtons(role: string): string[] {
  return ADMIN_ROLE_BUTTONS[role] || []
}
