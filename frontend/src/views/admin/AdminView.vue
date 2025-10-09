<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Créer un nouveau challenge</h1>
      
      <div class="bg-white shadow-md rounded-lg p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <!-- Titre -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Titre du challenge
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="input w-full"
              placeholder="Titre du challenge"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              required
              class="input w-full"
              placeholder="Description détaillée du challenge"
            ></textarea>
          </div>

          <!-- Difficulté -->
          <div>
            <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-2">
              Difficulté
            </label>
            <select
              id="difficulty"
              v-model="form.difficulty"
              required
              class="input w-full"
            >
              <option value="Facile">Facile</option>
              <option value="Moyen">Moyen</option>
              <option value="Difficile">Difficile</option>
            </select>
          </div>

          <!-- Code initial -->
          <div>
            <label for="initialCode" class="block text-sm font-medium text-gray-700 mb-2">
              Code initial
            </label>
            <textarea
              id="initialCode"
              v-model="form.initialCode"
              rows="6"
              class="input w-full font-mono"
              placeholder="Code initial fourni aux participants"
            ></textarea>
          </div>

          <!-- Tests -->
          <div>
            <label for="tests" class="block text-sm font-medium text-gray-700 mb-2">
              Tests
            </label>
            <textarea
              id="tests"
              v-model="form.tests"
              rows="6"
              required
              class="input w-full font-mono"
              placeholder="Tests pour valider la solution"
            ></textarea>
          </div>

          <!-- Message d'erreur -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Message de succès -->
          <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
            {{ successMessage }}
          </div>

          <!-- Boutons -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              class="btn btn-secondary"
              @click="$router.back()"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Créer le challenge</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création en cours...
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/config/api'

const router = useRouter()

const form = ref({
  title: '',
  description: '',
  difficulty: 'Moyen',
  initialCode: '',
  tests: ''
})

const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const response = await api.post('/challenge', form.value)
    
    if (response.data.success) {
      successMessage.value = 'Challenge créé avec succès !'
      setTimeout(() => {
        router.push('/admin/challenge')
      }, 1500)
    } else {
      throw new Error(response.data.message || 'Erreur lors de la création du challenge')
    }
  } catch (err) {
    console.error('Erreur:', err)
    error.value = err.response?.data?.message || err.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded-lg p-2 w-full;
}
.btn {
  @apply px-4 py-2 rounded-lg font-semibold;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
.btn-secondary {
  @apply bg-gray-300 text-gray-700 hover:bg-gray-400;
}
</style>
