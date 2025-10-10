import axios from 'axios'
import { io } from 'socket.io-client'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5010'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Log des requêtes
    console.log(`🚀 Requête ${config.method.toUpperCase()} vers ${config.url}:`, config.data)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log('📥 Réponse du serveur:', response.data)
    return response
  },
  (error) => {
    console.error('❌ Erreur de la requête:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    
    if (error.response?.status === 401) {
      console.log('Token invalide ou expiré, déconnexion...')
      localStorage.clear()
     // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const socket = io(API_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
})

export const connectSocket = () => {
  const token = localStorage.getItem('token')
  if (token) {
    socket.auth = { token }
    socket.connect()
  }
}

export default api
