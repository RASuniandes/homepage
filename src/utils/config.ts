const API_URL: string =
  import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000'
const REPO_NAME: string = import.meta.env.VITE_REPO_NAME || ''
export { API_URL, REPO_NAME }
