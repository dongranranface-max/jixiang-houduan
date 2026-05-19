/**
 * 分类管理 API
 */
import request from '@/utils/http'

export interface CategoryItem {
  id: string
  name: string
  icon?: string
  parentId: string | null
  sort: number
  status: number
  children?: CategoryItem[]
}

export interface CategoryParams {
  name: string
  icon?: string
  parentId?: string
  sort?: number
}

export function fetchCategoryList(params?: { parentId?: string }) {
  return request.get<CategoryItem[]>({ url: '/api/v1/admin/categories', params })
}

export function fetchCreateCategory(data: CategoryParams) {
  return request.post({ url: '/api/v1/admin/categories', data })
}

export function fetchUpdateCategory(id: string, data: CategoryParams) {
  return request.put({ url: `/api/v1/admin/categories/${id}`, data })
}

export function fetchDeleteCategory(id: string) {
  return request.del({ url: `/api/v1/admin/categories/${id}` })
}
