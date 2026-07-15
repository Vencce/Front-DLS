import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dls-auto-pecas-api.onrender.com/api/v1',
  timeout: 15000,
  headers: {
    'Accept': 'application/json'
  }
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        try {
          const response = await axios.post('https://dls-auto-pecas-api.onrender.com/api/v1/auth/token/refresh/', {
            refresh: refreshToken
          })
          
          localStorage.setItem('accessToken', response.data.access)
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`
          
          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/admin/login'
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api