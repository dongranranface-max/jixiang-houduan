/**
 * 集享公社管理后台 - 全局配置
 */
import { MenuThemeEnum, MenuTypeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { SystemConfig } from '@/types/config'
import { configImages } from './assets/images'
import fastEnterConfig from './modules/fastEnter'
import { headerBarConfig } from './modules/headerBar'

/** 品牌主色：轻奢金 */
const BRAND_PRIMARY = '#C9A227'

const appConfig: SystemConfig = {
  systemInfo: {
    name: '集享公社',
    fullName: '集享公社管理后台',
    description: '三商城 · 双积分 · 会员等级 · 一体化电商运营',
    logo: '@imgs/common/logo.png',
    copyright: `© ${new Date().getFullYear()} 集享公社`
  },
  systemThemeStyles: {
    [SystemThemeEnum.LIGHT]: { className: '' },
    [SystemThemeEnum.DARK]: { className: SystemThemeEnum.DARK }
  },
  settingThemeList: [
    {
      name: '浅色',
      theme: SystemThemeEnum.LIGHT,
      color: ['#fff', '#fff'],
      leftLineColor: '#EDEEF0',
      rightLineColor: '#EDEEF0',
      img: configImages.themeStyles.light
    },
    {
      name: '深色',
      theme: SystemThemeEnum.DARK,
      color: ['#22252A'],
      leftLineColor: '#3F4257',
      rightLineColor: '#3F4257',
      img: configImages.themeStyles.dark
    },
    {
      name: '跟随系统',
      theme: SystemThemeEnum.AUTO,
      color: ['#fff', '#22252A'],
      leftLineColor: '#EDEEF0',
      rightLineColor: '#3F4257',
      img: configImages.themeStyles.system
    }
  ],
  menuLayoutList: [
    { name: '左侧菜单', value: MenuTypeEnum.LEFT, img: configImages.menuLayouts.vertical },
    { name: '顶部菜单', value: MenuTypeEnum.TOP, img: configImages.menuLayouts.horizontal },
    { name: '混合菜单', value: MenuTypeEnum.TOP_LEFT, img: configImages.menuLayouts.mixed },
    { name: '双栏菜单', value: MenuTypeEnum.DUAL_MENU, img: configImages.menuLayouts.dualColumn }
  ],
  themeList: [
    {
      theme: MenuThemeEnum.DESIGN,
      background: '#FFFFFF',
      systemNameColor: 'var(--art-gray-800)',
      iconColor: '#6B6B6B',
      textColor: '#29343D',
      img: configImages.menuStyles.design
    },
    {
      theme: MenuThemeEnum.DARK,
      background: '#1a1a1f',
      systemNameColor: '#E8D5A3',
      iconColor: '#BABBBD',
      textColor: '#BABBBD',
      img: configImages.menuStyles.dark
    },
    {
      theme: MenuThemeEnum.LIGHT,
      background: '#ffffff',
      systemNameColor: 'var(--art-gray-800)',
      iconColor: '#6B6B6B',
      textColor: '#29343D',
      img: configImages.menuStyles.light
    }
  ],
  darkMenuStyles: [
    {
      theme: MenuThemeEnum.DARK,
      background: 'var(--default-box-color)',
      systemNameColor: '#E8D5A3',
      iconColor: '#BABBBD',
      textColor: 'rgba(#FFFFFF, 0.7)'
    }
  ],
  systemMainColor: [
    BRAND_PRIMARY,
    '#1D84FF',
    '#60C041',
    '#B48DF3',
    '#F9901F',
    '#38C0FC',
    '#FF80C8'
  ] as const,
  fastEnter: fastEnterConfig,
  headerBar: headerBarConfig
}

export default Object.freeze(appConfig)
