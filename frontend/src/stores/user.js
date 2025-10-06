import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/config/api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Connexion
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', credentials)
      const { token: newToken, user: userData } = response.data
      
      token.value = newToken
      user.value = userData
      localStorage.setItem('token', newToken)
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur de connexion'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Inscription
  const register = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/register', userData)
      const { token: newToken, user: newUser } = response.data
      
      token.value = newToken
      user.value = newUser
      localStorage.setItem('token', newToken)
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur d\'inscription'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Déconnexion
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  // Récupérer le profil utilisateur
  const fetchProfile = async () => {
    if (!token.value) return
    
    try {
      const response = await api.get('/auth/profile')
      user.value = response.data.user
    } catch (err) {
      console.error('Erreur lors de la récupération du profil:', err)
      logout()
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchProfile
  }
})