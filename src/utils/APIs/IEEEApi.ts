import { supabase } from '../supabase'

// Posts API (backend uses /api/posts)
export const iEEEApi = {
  async getEvents (params?: Record<string, string | number>) {
    const { data, error } = await supabase.functions.invoke('ieee-events', {
      method: 'POST',
      body: params ?? {}
    })
    if (error) throw error
    return data
  }
}
