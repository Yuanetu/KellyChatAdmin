import request from './index'
import type { StatsData, ApiResponse } from '@/types'

export function getStats() {
  return request.get<any, ApiResponse<StatsData>>('/api/admin/stats')
}
