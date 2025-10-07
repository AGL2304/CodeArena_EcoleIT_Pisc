<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-block mb-6">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CodeArena
          </h1>
        </router-link>
        <h2 class="text-3xl font-bold text-white mb-2">Connexion</h2>
        <p class="text-gray-400">Accédez à votre compte pour continuer</p>
      </div>

      <!-- Carte de formulaire -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-500/20">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Adresse email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="john@example.com"
              :disabled="userStore.isLoading"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-medium text-gray-300">
                Mot de passe
              </label>
              <a href="#" class="text-sm text-purple-400 hover:text-purple-300 transition">
                Mot de passe oublié ?
              </a>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
                :disabled="userStore.isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                :disabled="userStore.isLoading"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Se souvenir de moi -->
          <div class="flex items-center">
            <input
              id="remember"
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-800"
              :disabled="userStore.isLoading"
            />
            <label for="remember" class="ml-2 text-sm text-gray-300">
              Se souvenir de moi
            </label>
          </div>

          <!-- Message d'erreur -->
          <div 
            v-if="userStore.error" 
            class="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-2"
          >
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ userStore.error }}</span>
          </div>

          <!-- Message de succès -->
          <div 
            v-if="successMessage" 
            class="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg text-sm flex items-start gap-2"
          >
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ successMessage }}</span>
          </div>

          <!-- Bouton de soumission -->
          <button
            type="submit"
            :disabled="userStore.isLoading"
            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!userStore.isLoading" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Se connecter
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion en cours...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-slate-800/50 text-gray-400">OU</span>
          </div>
        </div>

        <!-- Lien vers inscription -->
        <div class="text-center">
          <p class="text-gray-400">
            Pas encore de compte ?
            <router-link 
              to="/register" 
              class="text-purple-400 hover:text-purple-300 font-semibold transition"
            >
              Créer un compte
            </router-link>
          </p>
        </div>
      </div>

      <!-- Lien retour -->
      <div class="mt-6 text-center">
        <router-link 
          to="/" 
          class="text-gray-400 hover:text-white transition inline-flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)
const successMessage = ref('')

// Gérer la soumission du formulaire
const handleSubmit = async () => {
  successMessage.value = ''
  
  // Réinitialiser les erreurs précédentes
  userStore.error = ''
  
  try {
    const success = await userStore.login(form.value)
    
    if (success) {
      successMessage.value = '✅ Connexion réussie ! Redirection...'
      
      // Attendre un peu pour l'effet visuel
      setTimeout(() => {
        // Récupérer la destination de redirection depuis les query params
        const redirectPath = route.query.redirect || '/dashboard'
        
        // Rediriger vers la page demandée ou le dashboard
        router.push(redirectPath)
      }, 800)
    }
  } catch (error) {
    console.error('Erreur de connexion:', error)
  }
}

// Pré-remplir l'email si venant de l'inscription
onMounted(() => {
  if (route.query.email) {
    form.value.email = route.query.email
  }
})
</script>