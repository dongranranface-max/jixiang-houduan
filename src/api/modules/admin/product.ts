/**
 * 商品管理 API
 */
import request from '@/utils/http'

// ==================== 分类 ====================

export interface CategoryItem {
  id: string
  name: string
  icon: string
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
  status?: number
}

export function fetchCategoryList() {
  return request.get<CategoryItem[]>({ url: '/api/v1/admin/categories' })
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

// ==================== 商品 ====================

export interface ProductItem {
  id: string
  name: string
  categoryId: string
  categoryName: string
  type: number
  typeName: string
  price: string
  originalPrice: string
  requiredPoints: string
  stock: number
  sales: number
  coverImages: string[]
  description: string
  specs: any[]
  status: number
  statusName: string
  createdAt: string
}

export interface ProductListResponse {
  list: ProductItem[]
  total: number
  page: number
  limit: number
}

export interface ProductParams {
  name: string
  categoryId: string
  type: number
  price: string
  originalPrice?: string
  requiredPoints?: string
  stock: number
  coverImages: string[]
  description?: string
  specs?: any[]
  status?: number
}

export function fetchProductList(params: {
  keyword?: string
  categoryId?: string
  type?: number
  status?: number
  page?: number
  limit?: number
}) {
  return request.get<ProductListResponse>({ url: '/api/v1/admin/products', params })
}

export function fetchCreateProduct(data: ProductParams) {
  return request.post({ url: '/api/v1/admin/products', data })
}

export function fetchUpdateProduct(id: string, data: ProductParams) {
  return request.put({ url: `/api/v1/admin/products/${id}`, data })
}

export function fetchDeleteProduct(id: string) {
  return request.del({ url: `/api/v1/admin/products/${id}` })
}

export function fetchUpdateProductStatus(id: string, status: number) {
  return request.put({ url: `/api/v1/admin/products/${id}/status`, data: { status } })
}
