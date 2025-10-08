import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/config/api'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)
  const error = ref('')

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'user')

  // Actions

  /**
   * Connexion utilisateur
   */
  const login = async (credentials) => {
    isLoading.value = true
    error.value = ''

    try {
      console.log('🔐 Tentative de connexion...', credentials.email)
      
      const response = await api.post('/auth/login', credentials)
      const data = response.data

      console.log('📥 Réponse du serveur:', data)

      // Vérifier si la connexion est réussie
      if (data.success && data.token && data.user) {
        // Sauvegarder le token
        token.value = data.token
        localStorage.setItem('token', data.token)

        // Sauvegarder les infos utilisateur
        user.value = data.user
        localStorage.setItem('user', JSON.stringify(data.user))

        console.log('✅ Connexion réussie:', user.value.username)
        
        isLoading.value = false
        return true // Retourner true pour indiquer le succès
      } else {
        throw new Error(data.message || 'Erreur de connexion')
      }
    } catch (err) {
      console.error('❌ Erreur de connexion:', err)
      
      // Gérer les différents types d'erreurs
      if (err.response?.data?.message) {
        error.value = err.response.data.message
      } else if (err.message) {
        error.value = err.message
      } else {
        error.value = 'Une erreur est survenue lors de la connexion'
      }
      
      isLoading.value = false
      return false // Retourner false en cas d'échec
    }
  }

  /**
   * Inscription utilisateur
   */
  const register = async (userData) => {
    isLoading.value = true
    error.value = ''

    try {
      console.log('📝 Tentative d\'inscription...', userData.email)
      
      const response = await api.post('/auth/register', userData)
      const data = response.data

      console.log('📥 Réponse du serveur:', data)

      if (data.success) {
        console.log('✅ Inscription réussie')
        
        // Après inscription, connecter automatiquement l'utilisateur
        const loginSuccess = await login({
          email: userData.email,
          password: userData.password
        })
        
        isLoading.value = false
        return loginSuccess
      } else {
        throw new Error(data.message || 'Erreur d\'inscription')
      }
    } catch (err) {
      console.error('❌ Erreur d\'inscription:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
      } else if (err.message) {
        error.value = err.message
      } else {
        error.value = 'Une erreur est survenue lors de l\'inscription'
      }
      
      isLoading.value = false
      return false
    }
  }

  /**
   * Déconnexion utilisateur
   */
  const logout = () => {
    console.log('👋 Déconnexion...')
    
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    console.log('✅ Déconnexion réussie')
  }

  /**
   * Récupérer le profil utilisateur depuis le serveur
   */
  const fetchProfile = async () => {
    if (!token.value) {
      console.log('⚠️ Pas de token, impossible de récupérer le profil')
      return false
    }

    isLoading.value = true
    error.value = ''

    try {
      console.log('👤 Récupération du profil utilisateur...')
      
      const response = await api.get('/auth/profile')
      const data = response.data

      if (data.success && data.user) {
        user.value = data.user
        localStorage.setItem('user', JSON.stringify(data.user))
        
        console.log('✅ Profil récupéré:', user.value.username)
        
        isLoading.value = false
        return true
      } else {
        throw new Error('Profil non trouvé')
      }
    } catch (err) {
      console.error('❌ Erreur lors de la récupération du profil:', err)
      
      // Si le token est invalide, déconnecter l'utilisateur
      if (err.response?.status === 401) {
        logout()
      }
      
      error.value = 'Impossible de récupérer votre profil'
      isLoading.value = false
      return false
    }
  }

  /**
   * Initialiser l'utilisateur depuis le localStorage
   */
  const initUser = async () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
        console.log('✅ Utilisateur restauré depuis localStorage:', user.value.username)
        
        // Vérifier que le token est toujours valide en récupérant le profil
        await fetchProfile()
      } catch (err) {
        console.error('❌ Erreur lors de la restauration de l\'utilisateur:', err)
        logout()
      }
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  const updateProfile = async (updates) => {
    isLoading.value = true
    error.value = ''

    try {
      const response = await api.put('/auth/profile', updates)
      const data = response.data

      if (data.success && data.user) {
        user.value = { ...user.value, ...data.user }
        localStorage.setItem('user', JSON.stringify(user.value))
        
        console.log('✅ Profil mis à jour')
        
        isLoading.value = false
        return true
      } else {
        throw new Error(data.message || 'Erreur de mise à jour')
      }
    } catch (err) {
      console.error('❌ Erreur de mise à jour du profil:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
      } else {
        error.value = 'Erreur lors de la mise à jour du profil'
      }
      
      isLoading.value = false
      return false
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Computed
    isAuthenticated,
    isAdmin,
    isUser,
    
    // Actions
    login,
    register,
    logout,
    fetchProfile,
    initUser,
    updateProfile
  }
})