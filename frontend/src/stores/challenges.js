import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/config/api'

export const useChallengesStore = defineStore('challenges', () => {
  // État
  const challenges = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const getChallengeById = computed(() => {
    return (id) => challenges.value.find(challenge => challenge._id === id)
  })

  const filteredChallenges = computed(() => {
    return (searchTerm = '', difficulty = 'all') => {
      return challenges.value.filter(challenge => {
        const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesDifficulty = difficulty === 'all' || challenge.difficulty === difficulty
        return matchesSearch && matchesDifficulty
      })
    }
  })

  // Actions
  const fetchChallenges = async () => {
    isLoading.value = true
    error.value = null

    try {
      console.log('🔄 Début fetchChallenges')
      const response = await api.get('/challenge')
      console.log('📥 Réponse du serveur:', response.data)
      
      const challengesList = response.data || []
      challenges.value = challengesList
      
      console.log('✅ Challenges mis à jour:', challenges.value)
      return challengesList
    } catch (err) {
      console.error('❌ Erreur lors du chargement des challenges:', err)
      error.value = err.response?.data?.message || 'Impossible de charger les challenges'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createChallenge = async (challengeData) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('🔄 Données reçues dans le store:', JSON.stringify(challengeData, null, 2))

      // Validation de base
      if (!challengeData.title?.trim()) {
        throw new Error('Le titre est requis')
      }
      if (!challengeData.description?.trim()) {
        throw new Error('La description est requise')
      }
      if (!challengeData.testCases || !Array.isArray(challengeData.testCases) || !challengeData.testCases.length) {
        throw new Error('Les tests sont requis et doivent être un tableau non vide')
      }

      // Construction du payload
      const payload = {
        title: challengeData.title.trim(),
        description: challengeData.description.trim(),
        difficulty: challengeData.difficulty || 'Moyen',
        testCases: challengeData.testCases.map(test => ({
          input: test.input,
          expectedOutput: test.expectedOutput || test.output
        }))
      }

      console.log('📦 Payload préparé:', JSON.stringify(payload, null, 2))
      
      const response = await api.post('/challenge', payload)
      console.log('✅ Réponse de l\'API:', response.data)

      // Si response.data contient directement le challenge
      const newChallenge = response.data.challenge || response.data
      challenges.value.push(newChallenge)
      return newChallenge
    } catch (err) {
      console.error('Erreur lors de la création du challenge:', err)
      error.value = err.response?.data?.message || 'Impossible de créer le challenge'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateChallenge = async (id, challengeData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.put(`/challenges/${id}`, challengeData)
      const updatedChallenge = response.data.challenge
      const index = challenges.value.findIndex(c => c._id === id)
      if (index !== -1) {
        challenges.value[index] = updatedChallenge
      }
      return updatedChallenge
    } catch (err) {
      console.error('Erreur lors de la mise à jour du challenge:', err)
      error.value = err.response?.data?.message || 'Impossible de mettre à jour le challenge'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteChallenge = async (id) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('🗑️ Tentative de suppression du challenge:', id)
      await api.delete(`/challenge/${id}`) // Correction: /challenge au lieu de /challenges
      console.log('✅ Challenge supprimé avec succès')
      challenges.value = challenges.value.filter(c => c._id !== id)
      return true
    } catch (err) {
      console.error('❌ Erreur lors de la suppression du challenge:', err)
      error.value = err.response?.data?.message || 'Impossible de supprimer le challenge'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // État
    challenges,
    isLoading,
    error,
    
    // Getters
    getChallengeById,
    filteredChallenges,
    
    // Actions
    fetchChallenges,
    createChallenge,
    updateChallenge,
    deleteChallenge
  }
})