export type APIResponse<T> = {
  data: T
  message?: string
  error?: string
}

export type PaginatedResponse<T> = APIResponse<{
  items: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    pages: number
    total_amount?: number // for cases where we want to sum a field instead of count items
  }
}>
