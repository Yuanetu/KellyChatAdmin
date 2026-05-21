import request from './index'
import type { ApiFeedbackListData, ApiResponse } from '@/types'

export interface FeedbackListParams {
  page: number
  size: number
}

export function getFeedbackList(params: FeedbackListParams) {
  return request.get<any, ApiResponse<ApiFeedbackListData>>('/api/admin/feedback/list', { params })
}
