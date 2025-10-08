<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- État de chargement -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p class="text-xl text-gray-700">Chargement du challenge...</p>
      </div>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md text-center">
        <div class="text-red-600 text-5xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-red-800 mb-2">Erreur</h2>
        <p class="text-red-700">{{ error }}</p>
        <button 
          @click="fetchChallenge"
          class="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Bouton retour -->
      <button 
        @click="goBack"
        class="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
      >
        ← Retour aux challenges
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Section Description du challenge -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h1 class="text-3xl font-bold">{{ challenge.title }}</h1>
              <span :class="difficultyClass" class="px-3 py-1 rounded-full text-sm font-semibold">
                {{ challenge.difficulty }}
              </span>
            </div>
            <div class="prose max-w-none" v-html="challenge.description"></div>
            
            <div v-if="challenge.examples && challenge.examples.length > 0" class="mt-6">
              <h3 class="text-xl font-semibold mb-3">Exemples</h3>
              <div v-for="(example, index) in challenge.examples" :key="index" class="mb-4 p-4 bg-gray-50 rounded-lg">
                <div class="mb-2">
                  <span class="font-semibold">Entrée:</span>
                  <pre class="mt-1 bg-gray-100 p-2 rounded overflow-x-auto">{{ formatValue(example.input) }}</pre>
                </div>
                <div>
                  <span class="font-semibold">Sortie:</span>
                  <pre class="mt-1 bg-gray-100 p-2 rounded overflow-x-auto">{{ formatValue(example.output) }}</pre>
                </div>
                <p v-if="example.explanation" class="mt-2 text-gray-600">
                  <span class="font-semibold">Explication:</span> {{ example.explanation }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Soumission de code -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 class="text-xl font-bold mb-4">Soumettre une solution</h2>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Langage
              </label>
              <select v-model="selectedLanguage" class="w-full border rounded-md p-2">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="php">PHP</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <textarea
                v-model="code"
                rows="10"
                class="w-full border rounded-md p-2 font-mono text-sm"
                placeholder="Écrivez votre code ici..."
              ></textarea>
            </div>

            <button
              @click="submitSolution"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Soumission en cours...' : 'Soumettre' }}
            </button>

            <div v-if="submissionResult" class="mt-4">
              <div :class="resultClass" class="p-4 rounded-md">
                <h3 class="font-semibold mb-2">Résultat</h3>
                <p>{{ submissionResult.message }}</p>
                <div v-if="submissionResult.score !== undefined" class="mt-2">
                  <span class="font-semibold">Score:</span> {{ submissionResult.score }}/100
                </div>
                <pre v-if="submissionResult.details" class="mt-2 text-sm bg-gray-100 p-2 rounded overflow-x-auto">{{ submissionResult.details }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'ChallengeDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const challenge = ref({})
    const selectedLanguage = ref('javascript')
    const code = ref('')
    const isSubmitting = ref(false)
    const submissionResult = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const difficultyClass = computed(() => {
      const classes = {
        'Facile': 'bg-green-100 text-green-800',
        'Moyen': 'bg-yellow-100 text-yellow-800',
        'Difficile': 'bg-red-100 text-red-800'
      }
      return classes[challenge.value.difficulty] || ''
    })

    const resultClass = computed(() => {
      if (!submissionResult.value) return ''
      return submissionResult.value.success
        ? 'bg-green-100 text-green-800 border-2 border-green-300'
        : 'bg-red-100 text-red-800 border-2 border-red-300'
    })

    const formatValue = (value) => {
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2)
      }
      return value
    }

    const fetchChallenge = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await axios.get(`http://localhost:5010/api/challenge/${route.params.id}`)
        challenge.value = response.data
      } catch (err) {
        error.value = 'Erreur lors du chargement du challenge'
        console.error('Erreur:', err)
      } finally {
        loading.value = false
      }
    }

    const submitSolution = async () => {
      if (!code.value.trim()) {
        alert('Veuillez entrer du code avant de soumettre')
        return
      }

      isSubmitting.value = true
      submissionResult.value = null
      
      try {
        const userId = localStorage.getItem('userId') || 'anonymous'
        const response = await axios.post('http://localhost:5010/api/submissions', {
          userId: userId,
          challengeId: route.params.id,
          language: selectedLanguage.value,
          code: code.value
        })
        
        const submission = response.data.submission
        submissionResult.value = {
          success: submission.status === 'Success',
          message: submission.status === 'Success' ? '✅ Tests réussis!' : '❌ Tests échoués',
          details: submission.output || submission.error,
          score: submission.score
        }
      } catch (err) {
        submissionResult.value = {
          success: false,
          message: '❌ Erreur lors de la soumission',
          details: err.response?.data?.message || err.message
        }
      } finally {
        isSubmitting.value = false
      }
    }

    const goBack = () => {
      router.push('/challenges')
    }

    onMounted(fetchChallenge)

    return {
      challenge,
      selectedLanguage,
      code,
      isSubmitting,
      submissionResult,
      loading,
      error,
      difficultyClass,
      resultClass,
      formatValue,
      submitSolution,
      fetchChallenge,
      goBack
    }
  }
}
</script>