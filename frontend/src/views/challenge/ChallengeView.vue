<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- État de chargement -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p class="text-xl text-gray-700">Chargement des challenges...</p>
      </div>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md text-center">
        <div class="text-red-600 text-5xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-red-800 mb-2">Erreur</h2>
        <p class="text-red-700">{{ error }}</p>
        <button 
          @click="refreshChallenges"
          class="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else>
      <!-- En-tête -->
      <div class="bg-white shadow-md border-b border-gray-200">
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            🚀 Challenges de Programmation
          </h1>
          <p class="text-gray-600 text-lg">
            Explorez {{ challengesStore.challenges.length }} challenges pour améliorer vos compétences
          </p>
        </div>
      </div>

      <!-- Filtres -->
      <div class="container mx-auto px-4 py-6">
        <div class="bg-white rounded-xl shadow-md p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Barre de recherche -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Rechercher
              </label>
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Rechercher un challenge..."
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <!-- Filtre de difficulté -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                📊 Difficulté
              </label>
              <select
                v-model="selectedDifficulty"
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="all">Toutes</option>
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              <span class="font-semibold">{{ filteredChallenges.length }}</span> challenge(s) trouvé(s)
            </p>
          </div>
        </div>

        <!-- Liste des challenges -->
        <div v-if="filteredChallenges.length === 0" class="bg-white rounded-xl shadow-md p-12 text-center">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Aucun challenge trouvé</h3>
          <p class="text-gray-600">Essayez de modifier vos critères de recherche</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="challenge in filteredChallenges"
            :key="challenge._id"
            class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-2 border-gray-100"
          >
            <!-- Badge de difficulté -->
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
              <div class="flex justify-between items-start">
                <span :class="getDifficultyColor(challenge.difficulty)" class="px-3 py-1 rounded-full text-xs font-bold border-2">
                  {{ challenge.difficulty }}
                </span>
                <span class="text-white text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                  #{{ challenge._id.slice(-6) }}
                </span>
              </div>
            </div>

            <!-- Contenu -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {{ challenge.title }}
              </h3>
              
              <div 
                class="text-gray-600 text-sm mb-4 line-clamp-3"
                v-html="challenge.description"
              ></div>

              <!-- Exemples -->
              <div v-if="challenge.examples && challenge.examples.length > 0" class="mb-4">
                <p class="text-xs font-semibold text-gray-700 mb-2">
                  📝 {{ challenge.examples.length }} exemple(s)
                </p>
                <div class="bg-gray-50 rounded-lg p-3 text-xs">
                  <div class="flex items-start gap-2">
                    <span class="font-semibold text-gray-700">Entrée:</span>
                    <pre class="flex-1 bg-white p-2 rounded text-xs overflow-x-auto">{{ formatValue(challenge.examples[0].input) }}</pre>
                  </div>
                  <div class="flex items-start gap-2 mt-2">
                    <span class="font-semibold text-gray-700">Sortie:</span>
                    <pre class="flex-1 bg-white p-2 rounded text-xs overflow-x-auto">{{ formatValue(challenge.examples[0].output) }}</pre>
                  </div>
                </div>
              </div>

              <!-- Bouton d'action -->
              <button
                @click="goToChallenge(challenge._id)"
                class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                type="button">
                Relever le défi →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChallengesStore } from '@/stores/challenges'

const router = useRouter()
const challengesStore = useChallengesStore()

const searchTerm = ref('')
const selectedDifficulty = ref('all')

// État réactif
const loading = computed(() => challengesStore.isLoading)
const error = computed(() => challengesStore.error)

// Filtrage des challenges
const filteredChallenges = computed(() => {
  return challengesStore.filteredChallenges(searchTerm.value, selectedDifficulty.value)
})

// Utilitaires
const getDifficultyColor = (difficulty) => {
  const colors = {
    'Facile': 'bg-green-100 text-green-800 border-green-300',
    'Moyen': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Difficile': 'bg-red-100 text-red-800 border-red-300'
  }
  return colors[difficulty] || 'bg-gray-100 text-gray-800 border-gray-300'
}

const formatValue = (value) => {
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return value
}

// Navigation
const goToChallenge = (id) => {
  if (!id) {
    console.error('ID du challenge manquant!')
    return
  }
  router.push(`/challenge/${id}`)
}

// Rafraîchissement des données
const refreshChallenges = () => {
  challengesStore.fetchChallenges()
}

// Chargement initial
onMounted(() => {
  refreshChallenges()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>