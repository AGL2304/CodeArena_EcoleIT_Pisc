<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- En-tête de bienvenue -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">
          Bienvenue, {{ user.username }} ! 👋
        </h1>
        <p class="text-gray-400">
          Voici un aperçu de votre activité sur CodeArena
        </p>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Classement global -->
        <div class="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-xl">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-gray-300 text-sm font-medium">Classement</h3>
            <span class="text-2xl">🏆</span>
          </div>
          <p class="text-3xl font-bold text-white mb-1">#{{ stats.rank }}</p>
          <p class="text-sm text-green-400">
            <span class="inline-flex items-center">
              ↑ +{{ stats.rankChange }} places
            </span>
          </p>
        </div>

        <!-- Points totaux -->
        <div class="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-xl">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-gray-300 text-sm font-medium">Points totaux</h3>
            <span class="text-2xl">⭐</span>
          </div>
          <p class="text-3xl font-bold text-white mb-1">{{ stats.totalPoints }}</p>
          <p class="text-sm text-blue-400">
            +{{ stats.pointsThisWeek }} cette semaine
          </p>
        </div>

        <!-- Défis résolus -->
        <div class="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-xl">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-gray-300 text-sm font-medium">Défis résolus</h3>
            <span class="text-2xl">✅</span>
          </div>
          <p class="text-3xl font-bold text-white mb-1">{{ stats.solvedChallenges }}</p>
          <p class="text-sm text-gray-400">
            Sur {{ stats.totalChallenges }} disponibles
          </p>
        </div>

        <!-- Série actuelle -->
        <div class="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 shadow-xl">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-gray-300 text-sm font-medium">Série actuelle</h3>
            <span class="text-2xl">🔥</span>
          </div>
          <p class="text-3xl font-bold text-white mb-1">{{ stats.currentStreak }} jours</p>
          <p class="text-sm text-orange-400">
            Max: {{ stats.maxStreak }} jours
          </p>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Colonne principale (2/3) -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Compétitions actives -->
          <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-purple-500/20">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-white">Compétitions actives</h2>
              <router-link
                to="/competitions"
                class="text-purple-400 hover:text-purple-300 text-sm font-medium transition"
              >
                Voir tout →
              </router-link>
            </div>

            <div v-if="activeCompetitions.length === 0" class="text-center py-8">
              <p class="text-gray-400 mb-4">Aucune compétition active pour le moment</p>
              <router-link
                to="/competitions"
                class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
              >
                Découvrir les compétitions
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="competition in activeCompetitions"
                :key="competition.id"
                class="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition cursor-pointer"
                @click="goToCompetition(competition.id)"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white mb-1">{{ competition.title }}</h3>
                    <p class="text-sm text-gray-400">{{ competition.description }}</p>
                  </div>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      competition.status === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                    ]"
                  >
                    {{ competition.status === 'live' ? '🟢 En cours' : '⏳ Bientôt' }}
                  </span>
                </div>

                <div class="flex items-center gap-4 text-sm text-gray-400">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {{ competition.participants }} participants
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ competition.timeLeft }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Activité récente -->
          <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-purple-500/20">
            <h2 class="text-2xl font-bold text-white mb-6">Activité récente</h2>

            <div class="space-y-4">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start gap-4 pb-4 border-b border-slate-700 last:border-0"
              >
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    activity.type === 'success' ? 'bg-green-500/20 text-green-400' :
                    activity.type === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  ]"
                >
                  <span class="text-lg">{{ activity.icon }}</span>
                </div>

                <div class="flex-1 min-w-0">
                  <p class="text-white font-medium">{{ activity.title }}</p>
                  <p class="text-sm text-gray-400">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
                </div>

                <div v-if="activity.points" class="text-right flex-shrink-0">
                  <span class="text-green-400 font-bold">+{{ activity.points }}</span>
                  <p class="text-xs text-gray-500">points</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Graphique de progression -->
          <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-purple-500/20">
            <h2 class="text-2xl font-bold text-white mb-6">Progression des 7 derniers jours</h2>
            
            <div class="h-64 flex items-end justify-between gap-2">
              <div
                v-for="(day, index) in weeklyProgress"
                :key="index"
                class="flex-1 flex flex-col items-center gap-2"
              >
                <div class="w-full bg-slate-700 rounded-lg overflow-hidden relative" style="height: 200px">
                  <div
                    class="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-pink-600 transition-all duration-500"
                    :style="{ height: (day.points / 100 * 100) + '%' }"
                  ></div>
                </div>
                <span class="text-xs text-gray-400">{{ day.label }}</span>
                <span class="text-sm font-semibold text-white">{{ day.points }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne latérale (1/3) -->
        <div class="space-y-8">
          <!-- Prochains défis -->
          <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-purple-500/20">
            <h2 class="text-xl font-bold text-white mb-4">Défis recommandés</h2>

            <div class="space-y-3">
              <div
                v-for="challenge in recommendedChallenges"
                :key="challenge.id"
                class="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition cursor-pointer"
                @click="goToChallenge(challenge.id)"
              >
                <div class="flex items-start justify-between mb-2">
                  <h3 class="text-white font-medium text-sm">{{ challenge.title }}</h3>
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs font-semibold',
                      challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    ]"
                  >
                    {{ challenge.difficulty === 'easy' ? 'Facile' : challenge.difficulty === 'medium' ? 'Moyen' : 'Difficile' }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 mb-2">{{ challenge.category }}</p>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-500">{{ challenge.solvers }} résolus</span>
                  <span class="text-purple-400 font-semibold">{{ challenge.points }} pts</span>
                </div>
              </div>
            </div>

            <router-link
              to="/challenges"
              class="block text-center mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium transition"
            >
              Voir tous les défis →
            </router-link>
          </div>

          <!-- Top 5 du classement -->
          <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-purple-500/20">
            <h2 class="text-xl font-bold text-white mb-4">Top 5 du classement</h2>

            <div class="space-y-3">
              <div
                v-for="(leader, index) in topLeaders"
                :key="leader.id"
                class="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
              >
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                    index === 0 ? 'bg-yellow-500 text-yellow-900' :
                    index === 1 ? 'bg-gray-400 text-gray-900' :
                    index === 2 ? 'bg-orange-600 text-orange-100' :
                    'bg-slate-600 text-white'
                  ]"
                >
                  {{ index + 1 }}
                </div>

                <div class="flex-1 min-w-0">
                  <p class="text-white font-medium text-sm truncate">{{ leader.username }}</p>
                  <p class="text-xs text-gray-400">{{ leader.solvedChallenges }} défis</p>
                </div>

                <div class="text-right">
                  <p class="text-purple-400 font-bold text-sm">{{ leader.points }}</p>
                  <p class="text-xs text-gray-500">points</p>
                </div>
              </div>
            </div>

            <router-link
              to="/leaderboard"
              class="block text-center mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium transition"
            >
              Voir le classement complet →
            </router-link>
          </div>

          <!-- Objectif du jour -->
          <div class="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-xl">
            <h2 class="text-xl font-bold text-white mb-4">Objectif du jour</h2>
            
            <div class="text-center mb-4">
              <div class="text-5xl mb-2">🎯</div>
              <p class="text-white font-semibold">Résoudre 3 défis</p>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-300">Progression</span>
                <span class="text-purple-400 font-bold">{{ dailyGoal.current }}/{{ dailyGoal.target }}</span>
              </div>
              <div class="w-full bg-slate-700 rounded-full h-3">
                <div
                  class="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  :style="{ width: (dailyGoal.current / dailyGoal.target * 100) + '%' }"
                ></div>
              </div>
            </div>

            <p class="text-xs text-gray-400 text-center">
              {{ dailyGoal.target - dailyGoal.current > 0 ? `Plus que ${dailyGoal.target - dailyGoal.current} défis !` : '✅ Objectif atteint !' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// Données utilisateur
const user = reactive({
  username: userStore.user?.username || 'Utilisateur'
})

// Statistiques
const stats = reactive({
  rank: 42,
  rankChange: 5,
  totalPoints: 1250,
  pointsThisWeek: 185,
  solvedChallenges: 37,
  totalChallenges: 150,
  currentStreak: 7,
  maxStreak: 12
})

// Compétitions actives
const activeCompetitions = ref([
  {
    id: 1,
    title: 'Sprint Algorithmique',
    description: 'Résolvez un maximum de défis en 2 heures',
    status: 'live',
    participants: 234,
    timeLeft: '1h 23min'
  },
  {
    id: 2,
    title: 'Battle Python',
    description: 'Défis exclusivement en Python',
    status: 'upcoming',
    participants: 89,
    timeLeft: 'Dans 3h'
  }
])

// Activité récente
const recentActivity = ref([
  {
    id: 1,
    type: 'success',
    icon: '✅',
    title: 'Défi résolu',
    description: 'Two Sum - Facile',
    time: 'Il y a 2 heures',
    points: 50
  },
  {
    id: 2,
    type: 'failed',
    icon: '❌',
    title: 'Tentative échouée',
    description: 'Binary Tree - Difficile',
    time: 'Il y a 5 heures',
    points: 0
  },
  {
    id: 3,
    type: 'badge',
    icon: '🏆',
    title: 'Badge débloqué',
    description: 'Séquence de 7 jours',
    time: 'Il y a 1 jour',
    points: 100
  },
  {
    id: 4,
    type: 'success',
    icon: '✅',
    title: 'Défi résolu',
    description: 'Palindrome - Moyen',
    time: 'Il y a 1 jour',
    points: 75
  }
])

// Progression hebdomadaire
const weeklyProgress = ref([
  { label: 'Lun', points: 45 },
  { label: 'Mar', points: 65 },
  { label: 'Mer', points: 30 },
  { label: 'Jeu', points: 80 },
  { label: 'Ven', points: 55 },
  { label: 'Sam', points: 70 },
  { label: 'Dim', points: 40 }
])

// Défis recommandés
const recommendedChallenges = ref([
  {
    id: 1,
    title: 'Reverse String',
    difficulty: 'easy',
    category: 'Strings',
    solvers: 1234,
    points: 50
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    difficulty: 'medium',
    category: 'Stack',
    solvers: 856,
    points: 75
  },
  {
    id: 3,
    title: 'Binary Search',
    difficulty: 'easy',
    category: 'Algorithms',
    solvers: 2103,
    points: 50
  }
])

// Top 5 leaders
const topLeaders = ref([
  { id: 1, username: 'CodeMaster', points: 5420, solvedChallenges: 145 },
  { id: 2, username: 'AlgoQueen', points: 4890, solvedChallenges: 132 },
  { id: 3, username: 'PyThon98', points: 4235, solvedChallenges: 118 },
  { id: 4, username: 'JSNinja', points: 3876, solvedChallenges: 105 },
  { id: 5, username: 'DevPro', points: 3542, solvedChallenges: 98 }
])

// Objectif du jour
const dailyGoal = reactive({
  current: 1,
  target: 3
})

// Navigation
const goToCompetition = (id) => {
  router.push(`/competitions/${id}`)
}

const goToChallenge = (id) => {
  router.push(`/challenges/${id}`)
}

// Charger les données
onMounted(async () => {
  try {
    // Charger les données depuis l'API
    // const response = await fetch('/api/dashboard', {
    //   headers: { 'Authorization': `Bearer ${userStore.token}` }
    // })
    // const data = await response.json()
    // Object.assign(stats, data.stats)
  } catch (error) {
    console.error('Erreur lors du chargement du dashboard:', error)
  }
})
</script>