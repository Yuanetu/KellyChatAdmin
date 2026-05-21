import request from './index'
import type { ApiReportListData, ApiResponse } from '@/types'

export interface ReportListParams {
  page: number
  size: number
}

export function getReportList(params: ReportListParams) {
  return request.get<any, ApiResponse<ApiReportListData>>('/api/admin/report/list', { params })
}

export function muteReportTarget(id: number, data: { duration: number }) {
  return request.put<any, ApiResponse<void>>(`/api/admin/report/${id}/mute`, data)
}

export function banReportTarget(id: number, data: { duration: number }) {
  return request.put<any, ApiResponse<void>>(`/api/admin/report/${id}/ban`, data)
}

export function markReportInvalid(id: number) {
  return request.put<any, ApiResponse<void>>(`/api/admin/report/${id}/invalid`)
}
