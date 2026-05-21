/**
 * 集享公社 - 快速入口（业务模块）
 */
import type { FastEnterConfig } from '@/types/config'

const fastEnterConfig: FastEnterConfig = {
  minWidth: 1200,
  applications: [
    {
      name: '数据看板',
      description: '经营数据与核心指标',
      icon: 'ri:dashboard-line',
      iconColor: '#C9A227',
      enabled: true,
      order: 1,
      routeName: 'AdminDashboard'
    },
    {
      name: '订单管理',
      description: '订单查询、发货与售后',
      icon: 'ri:file-list-3-line',
      iconColor: '#1D84FF',
      enabled: true,
      order: 2,
      routeName: 'AdminOrders'
    },
    {
      name: '商品管理',
      description: '商品与 SKU 维护',
      icon: 'ri:goods-line',
      iconColor: '#60C041',
      enabled: true,
      order: 3,
      routeName: 'AdminProductsOnSale'
    },
    {
      name: '用户管理',
      description: '会员与积分账户',
      icon: 'ri:user-line',
      iconColor: '#B48DF3',
      enabled: true,
      order: 4,
      routeName: 'AdminUsers'
    },
    {
      name: '提现管理',
      description: '提现审核与打款',
      icon: 'ri:bank-card-line',
      iconColor: '#F9901F',
      enabled: true,
      order: 5,
      routeName: 'AdminWithdrawals'
    },
    {
      name: '系统配置',
      description: '平台参数与运营配置',
      icon: 'ri:settings-line',
      iconColor: '#6B6B6B',
      enabled: true,
      order: 6,
      routeName: 'AdminConfig'
    }
  ],
  quickLinks: [
    {
      name: '分类管理',
      enabled: true,
      order: 1,
      routeName: 'AdminCategories'
    },
    {
      name: '理财管理',
      enabled: true,
      order: 2,
      routeName: 'AdminFinancial'
    },
    {
      name: '工单管理',
      enabled: true,
      order: 3,
      routeName: 'AdminTickets'
    },
    {
      name: '退款管理',
      enabled: true,
      order: 4,
      routeName: 'AdminRefunds'
    },
    {
      name: '等级配置',
      enabled: true,
      order: 5,
      routeName: 'AdminLevels'
    },
    {
      name: '推荐管理',
      enabled: true,
      order: 6,
      routeName: 'AdminReferral'
    }
  ]
}

export default Object.freeze(fastEnterConfig)
