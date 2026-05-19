/**
 * 集享公社管理后台路由
 */
import { AppRouteRecord } from '@/types/router'

export const adminRoutes: AppRouteRecord = {
  path: '/admin',
  name: 'Admin',
  component: '/index/index',
  meta: {
    title: '集享公社',
    icon: 'ri:government-line',
    roles: ['R_ADMIN', 'R_SUPER']
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
    {
      path: 'users',
      name: 'AdminUsers',
      component: '/admin/users',
      meta: {
        title: '用户管理',
        icon: 'ri:user-line',
        keepAlive: true
      }
    },
    {
      path: 'products',
      name: 'AdminProducts',
      component: '/admin/products',
      meta: {
        title: '商品管理',
        icon: 'ri:goods-line',
        keepAlive: true
      }
    },
    {
      path: 'categories',
      name: 'AdminCategories',
      component: '/admin/categories',
      meta: {
        title: '分类管理',
        icon: 'ri:folder-3-line',
        keepAlive: true
      }
    },
    {
      path: 'orders',
      name: 'AdminOrders',
      component: '/admin/orders',
      meta: {
        title: '订单管理',
        icon: 'ri:file-list-3-line',
        keepAlive: true
      }
    },
    {
      path: 'financial',
      name: 'AdminFinancial',
      component: '/admin/financial',
      meta: {
        title: '理财管理',
        icon: 'ri:bar-chart-box-line',
        keepAlive: true
      }
    },
    {
      path: 'withdrawals',
      name: 'AdminWithdrawals',
      component: '/admin/withdrawals',
      meta: {
        title: '提现管理',
        icon: 'ri:bank-card-line',
        keepAlive: true
      }
    },
    {
      path: 'tickets',
      name: 'AdminTickets',
      component: '/admin/tickets',
      meta: {
        title: '工单管理',
        icon: 'ri:service-line',
        keepAlive: true
      }
    },
    {
      path: 'config',
      name: 'AdminConfig',
      component: '/admin/config',
      meta: {
        title: '系统配置',
        icon: 'ri:settings-line',
        keepAlive: true
      }
    },
    {
      path: 'levels',
      name: 'AdminLevels',
      component: '/admin/levels',
      meta: {
        title: '等级配置',
        icon: 'ri:vip-crown-line',
        keepAlive: true
      }
    },
    {
      path: 'refunds',
      name: 'AdminRefunds',
      component: '/admin/refunds',
      meta: {
        title: '退款管理',
        icon: 'ri:refund-2-line',
        keepAlive: true
      }
    },
    {
      path: 'referral',
      name: 'AdminReferral',
      component: '/admin/referral',
      meta: {
        title: '推荐管理',
        icon: 'ri:user-follow-line',
        keepAlive: true
      }
    }
  ]
}
