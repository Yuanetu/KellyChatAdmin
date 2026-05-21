import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kellychat_token') || sessionStorage.getItem('kellychat_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('[Request Error]', error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    console.error('[Response Error]', error)
    return Promise.reject(error)
  }
)

export default service
