/**
 * 集享公社管理后台路由
 */
import { AppRouteRecord } from '@/types/router'
import { mallManageRoutes } from './mall-routes'

export const adminRoutes: AppRouteRecord = {
  path: '/admin',
  name: 'Admin',
  component: '/index/index',
  meta: {
    title: '运营管理',
    icon: 'ri:store-2-line',
    roles: ['R_SUPER', 'R_ADMIN', 'R_MERCHANT']
  },
  children: [
    {
      path: 'dashboard',
      name: 'AdminDashboard',
      component: '/admin/dashboard',
      meta: {
        title: '数据看板',
        icon: 'ri:dashboard-line',
        keepAlive: true,
        fixedTab: true
      }
    },
    mallManageRoutes,
    {
      path: 'users',
      name: 'AdminUsers',
      component: '/admin/users',
      meta: {
        title: '用户管理',
        icon: 'ri:user-line',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'financial',
      name: 'AdminFinancial',
      component: '/admin/financial',
      meta: {
        title: '理财管理',
        icon: 'ri:bar-chart-box-line',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'withdrawals',
      name: 'AdminWithdrawals',
      component: '/admin/withdrawals',
      meta: {
        title: '提现管理',
        icon: 'ri:bank-card-line',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'tickets',
      name: 'AdminTickets',
      component: '/admin/tickets',
      meta: {
        title: '工单管理',
        icon: 'ri:service-line',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'config',
      name: 'AdminConfig',
      component: '/admin/config',
      meta: {
        title: '系统配置',
        icon: 'ri:settings-line',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'levels',
      name: 'AdminLevels',
      component: '/admin/levels',
      meta: {
        title: '等级配置',
        icon: 'ri:vip-crown-line',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'refunds',
      name: 'AdminRefunds',
      component: '/admin/refunds',
      meta: {
        title: '退款管理',
        icon: 'ri:refund-2-line',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'referral',
      name: 'AdminReferral',
      component: '/admin/referral',
      meta: {
        title: '推荐管理',
        icon: 'ri:user-follow-line',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'coupons',
      name: 'AdminCoupons',
      component: '/admin/coupons',
      meta: {
        title: '优惠券',
        icon: 'ri:coupon-line',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'system',
      name: 'AdminSystem',
      component: '/index/index',
      meta: {
        title: '系统管理',
        icon: 'ri:settings-3-line',
        roles: ['R_SUPER']
      },
      children: [
        {
          path: 'admins',
          name: 'AdminSystemAdmins',
          component: '/admin/system/admins',
          meta: {
            title: '管理员与角色',
            icon: 'ri:shield-user-line',
            keepAlive: true,
            roles: ['R_SUPER']
          }
        }
      ]
    }
  ]
}
