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
              :disabled="isLoading"
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
              :disabled="isLoading"
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
              :disabled="isLoading"
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
              :disabled="isLoading"
            ></textarea>
          </div>

          <!-- Tests -->
          <div>
            <label for="testCases" class="block text-sm font-medium text-gray-700 mb-2">
              Tests
            </label>
            <textarea
              id="testCases"
              v-model="form.testCases"
              rows="6"
              required
              class="input w-full font-mono"
              placeholder="Tests pour valider la solution (format JSON)"
              :disabled="isLoading"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Format attendu : [{"input": "valeur", "expectedOutput": "résultat attendu"}, ...]
            </p>
          </div>

          <!-- Exemples -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Exemples
            </label>
            <div v-for="(example, index) in form.examples" :key="index" class="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label :for="'input-'+index" class="block text-xs font-medium text-gray-600 mb-1">
                  Entrée
                </label>
                <textarea
                  :id="'input-'+index"
                  v-model="example.input"
                  rows="2"
                  class="input w-full font-mono text-sm"
                  placeholder="Exemple d'entrée"
                  :disabled="isLoading"
                ></textarea>
              </div>
              <div>
                <label :for="'output-'+index" class="block text-xs font-medium text-gray-600 mb-1">
                  Sortie attendue
                </label>
                <textarea
                  :id="'output-'+index"
                  v-model="example.output"
                  rows="2"
                  class="input w-full font-mono text-sm"
                  placeholder="Exemple de sortie"
                  :disabled="isLoading"
                ></textarea>
              </div>
              <button
                type="button"
                class="text-red-600 hover:text-red-800 text-sm"
                @click="removeExample(index)"
                :disabled="isLoading"
              >
                Supprimer cet exemple
              </button>
            </div>
            <button
              type="button"
              class="text-blue-600 hover:text-blue-800 text-sm"
              @click="addExample"
              :disabled="isLoading"
            >
              + Ajouter un exemple
            </button>
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
              @click="$router.push('/admin/challenges')"
              :disabled="isLoading"
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
import { useChallengesStore } from '@/stores/challenges'


const router = useRouter()
const challengesStore = useChallengesStore()

  const defaultTestCase = [
    {
      input: "test",
      output: "test"
    }
  ]

  const form = ref({
    title: '',
    description: '',
    difficulty: 'Moyen',
    testCases: JSON.stringify(defaultTestCase, null, 2),
    examples: []
  })

const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

const addExample = () => {
  form.value.examples.push({
    input: '',
    output: ''
  })
}

const removeExample = (index) => {
  form.value.examples.splice(index, 1)
}

const handleSubmit = async () => {
  if (isLoading.value) return

  isLoading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    // Validation des champs requis
    if (!form.value.title?.trim()) {
      throw new Error('Le titre est requis')
    }
    if (!form.value.description?.trim()) {
      throw new Error('La description est requise')
    }
    if (!form.value.testCases?.trim()) {
      throw new Error('Les tests sont requis')
    }

    // Parsage des tests JSON
    let testCases
    try {
      testCases = JSON.parse(form.value.testCases)
      if (!Array.isArray(testCases) || !testCases.length) {
        throw new Error('Les tests doivent être un tableau non vide')
      }

      // Vérifier et normaliser chaque test
      testCases = testCases.map((test, index) => {
        if (!test || typeof test !== 'object') {
          throw new Error(`Le test #${index + 1} doit être un objet`)
        }
        if (!('input' in test)) {
          throw new Error(`Le test #${index + 1} doit avoir une propriété 'input'`)
        }
        if (!('output' in test) && !('expectedOutput' in test)) {
          throw new Error(`Le test #${index + 1} doit avoir une propriété 'output' ou 'expectedOutput'`)
        }

        return {
          input: test.input,
          expectedOutput: test.output || test.expectedOutput
        }
      })
    } catch (e) {
      throw new Error('Format des tests invalide. Utilisez le format JSON : [{"input": "valeur", "output": "résultat"}, ...]')
    }

    // Préparation des données
    const challengeData = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      difficulty: form.value.difficulty,
      testCases // Les tests déjà parsés et validés
    }

    console.log('📤 Données à envoyer:', JSON.stringify(challengeData, null, 2))

    // Envoi au store
    const result = await challengesStore.createChallenge(challengeData)
    console.log('📥 Réponse reçue:', result)

    // Envoi au store
    await challengesStore.createChallenge(challengeData)
    successMessage.value = 'Challenge créé avec succès !'
    
    // Redirection après un court délai
    setTimeout(() => {
      router.push('/admin/challenges')
    }, 1500)
  } catch (err) {
    console.error('Erreur:', err)
    error.value = err.message || 'Une erreur est survenue lors de la création du challenge'
  } finally {
    isLoading.value = false
  }
}
</script>