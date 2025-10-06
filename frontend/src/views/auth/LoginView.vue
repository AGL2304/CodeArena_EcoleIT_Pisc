<template>
  <div class="max-w-md mx-auto py-12">
    <div class="card">
      <h1 class="text-3xl font-bold text-center mb-8">Connexion</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="input"
            placeholder="john@example.com"
            :disabled="userStore.isLoading"
          />
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="input"
            placeholder="••••••••"
            :disabled="userStore.isLoading"
          />
        </div>

        <!-- Message d'erreur -->
        <div v-if="userStore.error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {{ userStore.error }}
        </div>

        <!-- Message de succès -->
        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
          {{ successMessage }}
        </div>

        <!-- Bouton de soumission -->
        <button
          type="submit"
          :disabled="userStore.isLoading"
          class="btn btn-primary w-full"
        >
          <span v-if="!userStore.isLoading">Se connecter</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connexion en cours...
          </span>
        </button>
      </form>

      <!-- Lien vers inscription -->
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Pas encore de compte ?
          <RouterLink to="/register" class="text-primary-600 hover:text-primary-700 font-medium">
            Inscrivez-vous
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  email: '',
  password: ''
})

const successMessage = ref('')

const handleSubmit = async () => {
  successMessage.value = ''
  const success = await userStore.login(form.value)
  
  if (success) {
    successMessage.value = 'Connexion réussie ! Redirection...'
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }
}
</script>