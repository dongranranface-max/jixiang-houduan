/**
 * 集享公社管理后台 - 顶栏功能
 */
import { HeaderBarFeatureConfig } from '@/types'

export const headerBarConfig: HeaderBarFeatureConfig = {
  menuButton: {
    enabled: true,
    description: '侧边栏展开/收起'
  },
  refreshButton: {
    enabled: true,
    description: '刷新当前页'
  },
  fastEnter: {
    enabled: true,
    description: '业务模块快速入口'
  },
  breadcrumb: {
    enabled: true,
    description: '面包屑导航'
  },
  globalSearch: {
    enabled: true,
    description: '全局搜索 Ctrl+K'
  },
  fullscreen: {
    enabled: true,
    description: '全屏'
  },
  notification: {
    enabled: false,
    description: '通知中心'
  },
  chat: {
    enabled: false,
    description: '聊天'
  },
  language: {
    enabled: false,
    description: '多语言'
  },
  settings: {
    enabled: true,
    description: '布局与主题设置'
  },
  themeToggle: {
    enabled: true,
    description: '明暗主题'
  }
}

export default headerBarConfig
