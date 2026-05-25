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

export interface UserAuditRequest {
  avatarAudit?: number | null
  nicknameAudit?: number | null
  tagAudit?: number | null
  bioAudit?: number | null
  photosAudit?: number | null
}

export function auditUser(userId: number, data: UserAuditRequest) {
  return request.post<any, ApiResponse<boolean>>(`/api/admin/user/${userId}/audit`, data)
}

export function muteUser(userId: number, data: { days?: number }) {
  return request.post<any, ApiResponse<boolean>>(`/api/admin/user/${userId}/mute`, data)
}

export function unmuteUser(userId: number) {
  return request.post<any, ApiResponse<boolean>>(`/api/admin/user/${userId}/unmute`, { userId })
}

export function banUser(data: { userId: number; days?: number }) {
  return request.post<any, ApiResponse<boolean>>(`/api/admin/user/${data.userId}/ban`, data)
}

export function unbanUser(userId: number) {
  return request.post<any, ApiResponse<boolean>>(`/api/admin/user/${userId}/unban`, { userId })
}
