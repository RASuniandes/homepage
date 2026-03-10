/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from '../config'

export const requestInterceptor = (config: any) => {
  // Here we can add auth tokens or other headers if needed
  return config
}
export const requestErrorInterceptor = (error: any) => {
  return Promise.reject(error)
}

export const responseInterceptor = (response: any) => response

export const responseErrorInterceptor = (error: any) => {
  if (error.code === 'ECONNREFUSED') {
    console.error('❌ Cannot connect to backend at', API_URL)
    return Promise.reject(error)
  }

  const status = error.response?.status
  const data = error.response?.data
  // const path = window.location.pathname

  // Auth pages should receive the error normally
  if (data) {
    console.error('API Error:', status, data)
    return Promise.reject(data)
  }

  if (error.response) {
    console.error('API Error:', status, error.response.data)
  }

  return Promise.reject(error)
}
