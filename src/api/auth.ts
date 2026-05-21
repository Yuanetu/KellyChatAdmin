import request from './index'
import type { LoginParams, LoginData, ApiResponse } from '@/types'

export function login(data: LoginParams) {
  return request.post<any, ApiResponse<LoginData>>('/api/admin/auth/login', data)
}
