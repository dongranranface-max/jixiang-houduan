/**
 * 工单管理 API
 */
import request from '@/utils/http'

export interface TicketItem {
  ticketId: string
  ticketNo: string
  userId: string
  userPhone: string
  type: number
  typeName: string
  title: string
  status: number
  statusName: string
  lastMessage: string
  lastReplyAt: string
  createdAt: string
}

export interface TicketDetail {
  ticketId: string
  ticketNo: string
  userId: string
  userPhone: string
  type: number
  typeName: string
  title: string
  content: string
  images: string[]
  orderNo: string | null
  status: number
  statusName: string
  messages: TicketMessage[]
  createdAt: string
}

export interface TicketMessage {
  id: string
  role: 'user' | 'admin'
  adminName?: string
  content: string
  images: string[]
  createdAt: string
}

export interface TicketListResponse {
  list: TicketItem[]
  total: number
  page: number
  limit: number
}

export function fetchTicketList(params: {
  status?: number
  type?: number
  keyword?: string
  page?: number
  limit?: number
}) {
  return request.get<TicketListResponse>({ url: '/api/v1/admin/tickets', params })
}

export function fetchTicketDetail(id: string) {
  return request.get<TicketDetail>({ url: `/api/v1/admin/tickets/${id}` })
}

export function fetchReplyTicket(id: string, data: { content: string; images?: string[] }) {
  return request.post({ url: `/api/v1/admin/tickets/${id}/reply`, data })
}

export function fetchResolveTicket(id: string) {
  return request.put({ url: `/api/v1/admin/tickets/${id}/resolve` })
}

export function fetchCloseTicket(id: string) {
  return request.put({ url: `/api/v1/admin/tickets/${id}/close` })
}
