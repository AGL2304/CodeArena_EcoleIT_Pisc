<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Section Description du problème -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-3xl font-bold">{{ problem.title }}</h1>
            <span :class="difficultyClass" class="px-3 py-1 rounded-full text-sm font-semibold">
              {{ problem.difficulty }}
            </span>
          </div>
          <div class="prose max-w-none" v-html="problem.description"></div>
          
          <div class="mt-6">
            <h3 class="text-xl font-semibold mb-3">Exemples</h3>
            <div v-for="(example, index) in problem.examples" :key="index" class="mb-4 p-4 bg-gray-50 rounded-lg">
              <div class="mb-2">
                <span class="font-semibold">Entrée:</span>
                <pre class="mt-1 bg-gray-100 p-2 rounded">{{ example.input }}</pre>
              </div>
              <div>
                <span class="font-semibold">Sortie:</span>
                <pre class="mt-1 bg-gray-100 p-2 rounded">{{ example.output }}</pre>
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
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Code
            </label>
            <textarea
              v-model="code"
              rows="10"
              class="w-full border rounded-md p-2 font-mono"
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
              <pre v-if="submissionResult.details" class="mt-2 text-sm bg-gray-100 p-2 rounded">{{ submissionResult.details }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

export default {
  name: 'ProblemDetailView',
  setup() {
    const route = useRoute()
    const problem = ref({})
    const selectedLanguage = ref('javascript')
    const code = ref('')
    const isSubmitting = ref(false)
    const submissionResult = ref(null)

    const difficultyClass = computed(() => {
      const classes = {
        'Facile': 'bg-green-100 text-green-800',
        'Moyen': 'bg-yellow-100 text-yellow-800',
        'Difficile': 'bg-red-100 text-red-800'
      }
      return classes[problem.value.difficulty] || ''
    })

    const resultClass = computed(() => {
      if (!submissionResult.value) return ''
      return submissionResult.value.success
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
    })

    const fetchProblem = async () => {
      try {
        const response = await axios.get(`/api/problems/${route.params.id}`)
        problem.value = response.data
      } catch (error) {
        console.error('Erreur lors du chargement du problème:', error)
      }
    }

    const submitSolution = async () => {
      if (!code.value.trim()) {
        alert('Veuillez entrer du code avant de soumettre')
        return
      }

      isSubmitting.value = true
      try {
        const response = await axios.post(`/api/submissions`, {
          problemId: route.params.id,
          language: selectedLanguage.value,
          code: code.value
        })
        submissionResult.value = {
          success: response.data.success,
          message: response.data.success ? 'Tests réussis!' : 'Tests échoués',
          details: response.data.details
        }
      } catch (error) {
        submissionResult.value = {
          success: false,
          message: 'Erreur lors de la soumission',
          details: error.response?.data?.message || error.message
        }
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(fetchProblem)

    return {
      problem,
      selectedLanguage,
      code,
      isSubmitting,
      submissionResult,
      difficultyClass,
      resultClass,
      submitSolution
    }
  }
}
</script>
