import request from './index'
import type { ApiReportListData, ApiResponse } from '@/types'

export interface ReportQueryRequest {
  keyword?: string
  reason?: string
  status?: number
  handleType?: number
  reportTimeStart?: string
  reportTimeEnd?: string
  handleTimeStart?: string
  handleTimeEnd?: string
  page?: number
  size?: number
}

export function getReportList(data: ReportQueryRequest) {
  return request.post<any, ApiResponse<ApiReportListData>>('/api/admin/report/list', data)
}

export function handleReport(reportId: number, params: { action: string; days?: number }) {
  return request.post<any, ApiResponse<boolean>>(`/api/admin/report/${reportId}/handle`, null, { params })
}
