<template>
  <div class="container mx-auto px-4 py-8">
          <AdminUserSubBar />
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
            <label for="testCases" class="block text-sm font-medium text-gray-700 mb-2">
              Tests
            </label>
            <textarea
              id="testCases"
              v-model="form.testCases"
              rows="6"
              required
              class="input w-full font-mono"
              placeholder='[{"input": "test", "output": "test"}]'
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Format JSON attendu : [{"input": "valeur", "output": "résultat attendu"}, ...]
            </p>
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

    <!-- Liste des challenges -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold mb-6">Liste des challenges</h2>
      
      <div v-if="isLoadingChallenges" class="flex justify-center py-8">
        <svg class="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="challenges.length === 0" class="text-center py-8 text-gray-500">
        Aucun challenge n'a encore été créé.
      </div>

      <div v-else class="space-y-4">
        <div v-for="challenge in challenges" :key="challenge._id" 
             class="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-lg">{{ challenge.title }}</h3>
            <p class="text-sm text-gray-600">{{ challenge.description }}</p>
            <span :class="{
              'px-2 py-1 rounded-full text-xs font-medium': true,
              'bg-green-100 text-green-800': challenge.difficulty === 'Facile',
              'bg-yellow-100 text-yellow-800': challenge.difficulty === 'Moyen',
              'bg-red-100 text-red-800': challenge.difficulty === 'Difficile'
            }">
              {{ challenge.difficulty }}
            </span>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="editChallenge(challenge._id)"
              class="p-2 text-blue-600 hover:text-blue-800"
              title="Modifier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button 
              @click="confirmDelete(challenge)"
              class="p-2 text-red-600 hover:text-red-800"
              title="Supprimer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de confirmation de suppression -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-bold mb-4">Confirmer la suppression</h3>
          <p class="mb-6">Êtes-vous sûr de vouloir supprimer le challenge "{{ challengeToDelete?.title }}" ?</p>
          <div class="flex justify-end space-x-4">
            <button 
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button 
              @click="deleteChallenge"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useChallengesStore } from '@/stores/challenges'
import AdminUserSubBar from "@/components/admin/AdminUserSubBar.vue";


const router = useRouter()
const challengesStore = useChallengesStore()

// État pour la gestion des challenges
const isLoadingChallenges = ref(true)
const showDeleteModal = ref(false)
const challengeToDelete = ref(null)

// Accès aux challenges via le store
const challenges = computed(() => challengesStore.challenges)

// État pour le formulaire
const defaultTests = [
  {
    input: "test",
    output: "test"
  }
]

const form = ref({
  title: '',
  description: '',
  difficulty: 'Moyen',
  initialCode: 'function solution(input) {\n  // Votre code ici\n  return input;\n}',
  testCases: JSON.stringify(defaultTests, null, 2)
})

const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

// Charger les challenges au montage du composant
onMounted(async () => {
  console.log('🔄 Composant monté, chargement des challenges...')
  try {
    await loadChallenges()
  } catch (err) {
    console.error('❌ Erreur dans onMounted:', err)
    error.value = 'Erreur lors du chargement des challenges'
  }
})

// Charger la liste des challenges
const loadChallenges = async () => {
  console.log('📋 Début du chargement des challenges')
  isLoadingChallenges.value = true
  try {
    await challengesStore.fetchChallenges()
    console.log('📥 Challenges chargés dans le store:', challengesStore.challenges)
  } catch (err) {
    console.error('❌ Erreur dans loadChallenges:', err)
    throw err
  } finally {
    isLoadingChallenges.value = false
    console.log('✅ État final des challenges:', challenges.value)
  }
}

// Gérer la suppression
const confirmDelete = (challenge) => {
  challengeToDelete.value = challenge
  showDeleteModal.value = true
}

const deleteChallenge = async () => {
  if (!challengeToDelete.value) return

  try {
    console.log('🗑️ Suppression du challenge:', challengeToDelete.value)
    await challengesStore.deleteChallenge(challengeToDelete.value._id)
    
    // Fermer le modal et réinitialiser
    showDeleteModal.value = false
    challengeToDelete.value = null
    
    // Afficher le message de succès
    successMessage.value = 'Challenge supprimé avec succès'
    
    // Recharger la liste des challenges
    await loadChallenges()
  } catch (err) {
    console.error('❌ Erreur de suppression:', err)
    error.value = err.message || 'Erreur lors de la suppression du challenge'
  }
}

const editChallenge = (id) => {
  router.push(`/admin/challenges/${id}/edit`)
}

const handleSubmit = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    // Validation de base
    if (!form.value.title?.trim()) {
      throw new Error('Le titre est requis')
    }
    if (!form.value.description?.trim()) {
      throw new Error('La description est requise')
    }
    
    // Validation et parsage des tests
    let testCases
    try {
      testCases = JSON.parse(form.value.testCases)
      if (!Array.isArray(testCases) || testCases.length === 0) {
        throw new Error('Les tests doivent être un tableau non vide')
      }
    } catch (e) {
      throw new Error('Format JSON des tests invalide. Utilisez le format : [{"input": "test", "output": "test"}]')
    }

    // Préparation des données
    const challengeData = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      difficulty: form.value.difficulty,
      initialCode: form.value.initialCode,
      testCases
    }

    // Envoi au store
    await challengesStore.createChallenge(challengeData)
    
    // Réinitialiser le formulaire
    form.value = {
      title: '',
      description: '',
      difficulty: 'Moyen',
      initialCode: 'function solution(input) {\n  // Votre code ici\n  return input;\n}',
      testCases: JSON.stringify(defaultTests, null, 2)
    }
    
    // Recharger la liste des challenges
    await loadChallenges()
    
    successMessage.value = 'Challenge créé avec succès !'
  } catch (err) {
    console.error('Erreur:', err)
    error.value = err.message || 'Une erreur est survenue lors de la création du challenge'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: 100%;
}
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
}
.btn-primary {
  background-color: #2563eb;
  color: white;
}
.btn-primary:hover {
  background-color: #1d4ed8;
}
.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}
.btn-secondary:hover {
  background-color: #d1d5db;
}
</style>
