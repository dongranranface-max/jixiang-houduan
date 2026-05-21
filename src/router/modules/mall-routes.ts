/**
 * 三商城管理子路由（消费 / 换购 / 兑换）
 */
import { AppRouteRecord } from '@/types/router'
import { MALL_TYPE, MALL_TYPE_NAME } from '@/constants/mall'

function mallSection(
  slug: 'consume' | 'exchange' | 'redeem',
  mallType: number,
  icon: string
): AppRouteRecord {
  const prefix = `AdminMall${slug.charAt(0).toUpperCase()}${slug.slice(1)}`
  const title = MALL_TYPE_NAME[mallType]

  return {
    path: slug,
    name: `${prefix}Root`,
    component: '/index/index',
    meta: { title, icon, mallType },
    children: [
      {
        path: 'products/on-sale',
        name: `${prefix}ProductsOnSale`,
        component: '/admin/products',
        meta: {
          title: '上架商品',
          icon: 'ri:upload-cloud-line',
          keepAlive: true,
          mallType,
          productStatus: 1
        }
      },
      {
        path: 'products/off-sale',
        name: `${prefix}ProductsOffSale`,
        component: '/admin/products',
        meta: {
          title: '下架商品',
          icon: 'ri:download-cloud-line',
          keepAlive: true,
          mallType,
          productStatus: 2
        }
      },
      {
        path: 'orders',
        name: `${prefix}Orders`,
        component: '/admin/orders',
        meta: {
          title: '订单管理',
          icon: 'ri:file-list-3-line',
          keepAlive: true,
          mallType,
          orderType: mallType
        }
      },
      {
        path: 'categories',
        name: `${prefix}Categories`,
        component: '/admin/categories',
        meta: {
          title: '分类管理',
          icon: 'ri:folder-3-line',
          keepAlive: true,
          mallType
        }
      }
    ]
  }
}

export const mallManageRoutes: AppRouteRecord = {
  path: 'mall',
  name: 'AdminMall',
  component: '/index/index',
  meta: {
    title: '商城管理',
    icon: 'ri:store-3-line'
  },
  children: [
    mallSection('consume', MALL_TYPE.CONSUME, 'ri:shopping-cart-line'),
    mallSection('exchange', MALL_TYPE.EXCHANGE, 'ri:exchange-line'),
    mallSection('redeem', MALL_TYPE.REDEEM, 'ri:gift-line')
  ]
}
