import request from './index'
import type { ApiUserListData, ApiResponse } from '@/types'

export interface UserListParams {
  keyword?: string
  gender?: number
  regStart?: string
  regEnd?: string
  page: number
  size: number
}

export function getUserList(params: UserListParams) {
  return request.get<any, ApiResponse<ApiUserListData>>('/api/admin/user/list', { params })
}

export function auditUser(id: number, data: { anomalyItems: string[] }) {
  return request.put<any, ApiResponse<void>>(`/api/admin/user/${id}/audit`, data)
}

export function muteUser(id: number, data: { duration: number }) {
  return request.put<any, ApiResponse<void>>(`/api/admin/user/${id}/mute`, data)
}

export function banUser(id: number, data: { duration: number }) {
  return request.put<any, ApiResponse<void>>(`/api/admin/user/${id}/ban`, data)
}
