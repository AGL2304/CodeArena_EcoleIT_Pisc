<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header du profil -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 mb-8 border border-purple-500/20">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
          <!-- Avatar -->
          <div class="relative group">
            <div class="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {{ userInitials }}
            </div>
            <button 
              @click="showAvatarModal = true"
              class="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <!-- Informations utilisateur -->
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-3xl font-bold text-white mb-2">{{ user.username }}</h1>
            <p class="text-gray-400 mb-4">{{ user.email }}</p>
            
            <div class="flex flex-wrap gap-4 justify-center md:justify-start">
              <div class="bg-slate-700/50 px-4 py-2 rounded-lg">
                <p class="text-sm text-gray-400">Classement</p>
                <p class="text-xl font-bold text-purple-400">#{{ user.rank || 'N/A' }}</p>
              </div>
              <div class="bg-slate-700/50 px-4 py-2 rounded-lg">
                <p class="text-sm text-gray-400">Points totaux</p>
                <p class="text-xl font-bold text-green-400">{{ user.totalPoints || 0 }}</p>
              </div>
              <div class="bg-slate-700/50 px-4 py-2 rounded-lg">
                <p class="text-sm text-gray-400">Défis résolus</p>
                <p class="text-xl font-bold text-blue-400">{{ user.solvedChallenges || 0 }}</p>
              </div>
              <div class="bg-slate-700/50 px-4 py-2 rounded-lg">
                <p class="text-sm text-gray-400">Membre depuis</p>
                <p class="text-xl font-bold text-pink-400">{{ formatDate(user.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglets -->
      <div class="mb-8">
        <div class="flex flex-wrap gap-2 border-b border-slate-700">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-3 font-semibold transition rounded-t-lg',
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Contenu des onglets -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-500/20">
        <!-- Onglet Statistiques -->
        <div v-if="activeTab === 'stats'" class="space-y-6">
          <h2 class="text-2xl font-bold text-white mb-6">Statistiques détaillées</h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Progression -->
            <div class="bg-slate-700/30 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Progression</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-400">Défis faciles</span>
                    <span class="text-green-400">{{ stats.easy }}/50</span>
                  </div>
                  <div class="w-full bg-slate-600 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" :style="{ width: (stats.easy / 50 * 100) + '%' }"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-400">Défis moyens</span>
                    <span class="text-yellow-400">{{ stats.medium }}/30</span>
                  </div>
                  <div class="w-full bg-slate-600 rounded-full h-2">
                    <div class="bg-yellow-500 h-2 rounded-full" :style="{ width: (stats.medium / 30 * 100) + '%' }"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-400">Défis difficiles</span>
                    <span class="text-red-400">{{ stats.hard }}/20</span>
                  </div>
                  <div class="w-full bg-slate-600 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" :style="{ width: (stats.hard / 20 * 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Langages utilisés -->
            <div class="bg-slate-700/30 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Langages préférés</h3>
              <div class="space-y-3">
                <div v-for="lang in stats.languages" :key="lang.name" class="flex items-center justify-between">
                  <span class="text-gray-300">{{ lang.name }}</span>
                  <span class="text-purple-400 font-semibold">{{ lang.count }} soumissions</span>
                </div>
              </div>
            </div>

            <!-- Activité récente -->
            <div class="bg-slate-700/30 rounded-lg p-6 md:col-span-2">
              <h3 class="text-lg font-semibold text-white mb-4">Activité des 30 derniers jours</h3>
              <div class="grid grid-cols-10 gap-2">
                <div
                  v-for="(day, index) in activityDays"
                  :key="index"
                  :class="[
                    'h-8 rounded',
                    day === 0 ? 'bg-slate-700' :
                    day <= 2 ? 'bg-purple-900' :
                    day <= 5 ? 'bg-purple-700' :
                    'bg-purple-500'
                  ]"
                  :title="`${day} soumissions`"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Paramètres -->
        <div v-if="activeTab === 'settings'" class="space-y-6">
          <h2 class="text-2xl font-bold text-white mb-6">Paramètres du compte</h2>
          
          <!-- Modifier le profil -->
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Nom d'utilisateur</label>
              <input
                v-model="profileForm.username"
                type="text"
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Votre nom d'utilisateur"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                v-model="profileForm.bio"
                rows="3"
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Parlez-nous de vous..."
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="loadingProfile"
              class="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
            >
              {{ loadingProfile ? 'Enregistrement...' : 'Enregistrer les modifications' }}
            </button>
          </form>

          <hr class="border-slate-700" />

          <!-- Changer le mot de passe -->
          <form @submit.prevent="changePassword" class="space-y-6">
            <h3 class="text-xl font-semibold text-white">Changer le mot de passe</h3>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Mot de passe actuel</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Nouveau mot de passe</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Confirmer le mot de passe</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            <div v-if="passwordError" class="p-4 bg-red-500/20 text-red-300 rounded-lg border border-red-500/30">
              {{ passwordError }}
            </div>

            <button
              type="submit"
              :disabled="loadingPassword"
              class="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
            >
              {{ loadingPassword ? 'Modification...' : 'Changer le mot de passe' }}
            </button>
          </form>

          <hr class="border-slate-700" />

          <!-- Supprimer le compte -->
          <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <h3 class="text-xl font-semibold text-red-400 mb-3">Zone de danger</h3>
            <p class="text-gray-400 mb-4">
              La suppression de votre compte est définitive et irréversible. Toutes vos données seront perdues.
            </p>
            <button
              @click="showDeleteModal = true"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>

        <!-- Onglet Badges -->
        <div v-if="activeTab === 'badges'" class="space-y-6">
          <h2 class="text-2xl font-bold text-white mb-6">Mes badges</h2>
          
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="badge in badges"
              :key="badge.id"
              :class="[
                'p-6 rounded-lg border-2 text-center transition',
                badge.earned
                  ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500'
                  : 'bg-slate-700/30 border-slate-600 opacity-50'
              ]"
            >
              <div class="text-5xl mb-3">{{ badge.icon }}</div>
              <h3 class="text-lg font-bold text-white mb-2">{{ badge.name }}</h3>
              <p class="text-sm text-gray-400">{{ badge.description }}</p>
              <p v-if="badge.earned" class="text-xs text-purple-400 mt-2">
                Obtenu le {{ formatDate(badge.earnedAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal suppression compte -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-slate-800 rounded-xl p-8 max-w-md w-full border border-red-500/30">
        <h3 class="text-2xl font-bold text-white mb-4">Confirmer la suppression</h3>
        <p class="text-gray-400 mb-6">
          Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
        </p>
        <div class="flex gap-4">
          <button
            @click="showDeleteModal = false"
            class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Annuler
          </button>
          <button
            @click="deleteAccount"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

// Données utilisateur
const user = reactive({
  username: 'JohnDoe',
  email: 'john@example.com',
  rank: 42,
  totalPoints: 1250,
  solvedChallenges: 37,
  createdAt: new Date('2024-01-15')
})

// Onglets
const activeTab = ref('stats')
const tabs = [
  { id: 'stats', label: 'Statistiques' },
  { id: 'settings', label: 'Paramètres' },
  { id: 'badges', label: 'Badges' }
]

// Statistiques
const stats = reactive({
  easy: 25,
  medium: 10,
  hard: 2,
  languages: [
    { name: 'JavaScript', count: 45 },
    { name: 'Python', count: 32 },
    { name: 'Java', count: 18 }
  ]
})

// Activité des 30 derniers jours (nombre de soumissions par jour)
const activityDays = ref(Array.from({ length: 30 }, () => Math.floor(Math.random() * 8)))

// Badges
const badges = ref([
  { id: 1, name: 'Premier pas', icon: '🎯', description: 'Résolvez votre premier défi', earned: true, earnedAt: new Date('2024-01-16') },
  { id: 2, name: 'Séquence', icon: '🔥', description: 'Résolvez des défis 7 jours consécutifs', earned: true, earnedAt: new Date('2024-02-01') },
  { id: 3, name: 'Expert Python', icon: '🐍', description: 'Résolvez 50 défis en Python', earned: false },
  { id: 4, name: 'Marathonien', icon: '🏃', description: 'Participez à 10 compétitions', earned: false },
  { id: 5, name: 'Champion', icon: '🏆', description: 'Gagnez une compétition', earned: false },
  { id: 6, name: 'Centurion', icon: '💯', description: 'Résolvez 100 défis', earned: false }
])

// Formulaires
const profileForm = reactive({
  username: user.username,
  email: user.email,
  bio: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loadingProfile = ref(false)
const loadingPassword = ref(false)
const passwordError = ref('')
const showDeleteModal = ref(false)
const showAvatarModal = ref(false)

// Initiales de l'utilisateur
const userInitials = computed(() => {
  return user.username.substring(0, 2).toUpperCase()
})

// Formater les dates
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Mettre à jour le profil
const updateProfile = async () => {
  loadingProfile.value = true
  try {
    // Appel API
    // await fetch('/api/profile', { method: 'PUT', body: JSON.stringify(profileForm) })
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    Object.assign(user, profileForm)
    alert('Profil mis à jour avec succès !')
  } catch (error) {
    alert('Erreur lors de la mise à jour')
  } finally {
    loadingProfile.value = false
  }
}

// Changer le mot de passe
const changePassword = async () => {
  passwordError.value = ''
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Les mots de passe ne correspondent pas'
    return
  }
  
  if (passwordForm.newPassword.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }
  
  loadingPassword.value = true
  try {
    // Appel API
    // await fetch('/api/profile/password', { method: 'PUT', body: JSON.stringify(passwordForm) })
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    alert('Mot de passe modifié avec succès !')
  } catch (error) {
    passwordError.value = 'Erreur lors du changement de mot de passe'
  } finally {
    loadingPassword.value = false
  }
}

// Supprimer le compte
const deleteAccount = async () => {
  try {
    // Appel API
    // await fetch('/api/profile', { method: 'DELETE' })
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    userStore.logout()
    router.push('/')
  } catch (error) {
    alert('Erreur lors de la suppression')
  }
}

// Charger les données au montage
onMounted(async () => {
  // Charger les données depuis l'API
  // const response = await fetch('/api/profile')
  // Object.assign(user, await response.json())
})
</script>