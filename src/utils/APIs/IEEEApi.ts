import axios from 'axios'
import {
  requestErrorInterceptor,
  requestInterceptor,
  responseErrorInterceptor,
  responseInterceptor
} from './interceptors.js'
import { API_URL } from '../config.js'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(requestInterceptor, requestErrorInterceptor)

api.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

// Posts API (backend uses /api/posts)
export const iEEEApi = {
  async getEvents (params?: Record<string, string | number>) {
    const response = await api.get('/ieee/ieee-events', { params })
    return response.data
  }
}

export default api
