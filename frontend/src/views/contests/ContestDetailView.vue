<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ contest.title }}</h1>
          <p class="text-gray-600">{{ contest.description }}</p>
        </div>
        <div class="text-right">
          <div :class="statusClass" class="inline-block px-4 py-2 rounded-full font-semibold mb-2">
            {{ contestStatus }}
          </div>
          <div v-if="isOngoing" class="text-lg font-semibold">
            Temps restant: {{ timeLeft }}
          </div>
          <div v-else-if="isUpcoming" class="text-lg font-semibold">
            Début dans: {{ timeToStart }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold mb-2">Participants</h3>
          <p class="text-3xl font-bold text-blue-600">{{ contest.participantsCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold mb-2">Problèmes</h3>
          <p class="text-3xl font-bold text-blue-600">{{ contest.problemCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-lg font-semibold mb-2">Points totaux</h3>
          <p class="text-3xl font-bold text-blue-600">{{ totalPoints }}</p>
        </div>
      </div>
    </div>

    <!-- Tableau de classement -->
    <div v-if="!isUpcoming" class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">Classement</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rang</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problèmes résolus</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(participant, index) in leaderboard" :key="participant.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {{ participant.username.charAt(0).toUpperCase() }}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ participant.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ participant.score }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ participant.solvedCount }}/{{ contest.problemCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Liste des problèmes -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">Problèmes</h2>
        <div class="space-y-4">
          <div v-for="problem in problems" :key="problem.id" 
               class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-semibold">{{ problem.title }}</h3>
                <p class="text-gray-600 mt-1">{{ problem.shortDescription }}</p>
                <div class="flex items-center mt-2 space-x-4">
                  <span :class="difficultyClass(problem.difficulty)" class="px-3 py-1 rounded-full text-sm">
                    {{ problem.difficulty }}
                  </span>
                  <span class="text-sm text-gray-500">{{ problem.points }} points</span>
                </div>
              </div>
              <router-link 
                v-if="canAccessProblem(problem)"
                :to="{ name: 'problem-detail', params: { id: problem.id }}"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Résoudre
              </router-link>
              <button 
                v-else
                class="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
                disabled
              >
                Verrouillé
              </button>
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
  name: 'ContestDetailView',
  setup() {
    const route = useRoute()
    const contest = ref({})
    const problems = ref([])
    const leaderboard = ref([])

    const fetchContest = async () => {
      try {
        const response = await axios.get(`/api/contests/${route.params.id}`)
        contest.value = response.data
      } catch (error) {
        console.error('Erreur lors du chargement du concours:', error)
      }
    }

    const fetchProblems = async () => {
      try {
        const response = await axios.get(`/api/contests/${route.params.id}/problems`)
        problems.value = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des problèmes:', error)
      }
    }

    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`/api/contests/${route.params.id}/leaderboard`)
        leaderboard.value = response.data
      } catch (error) {
        console.error('Erreur lors du chargement du classement:', error)
      }
    }

    const isOngoing = computed(() => {
      if (!contest.value.startTime || !contest.value.endTime) return false
      const now = new Date()
      const start = new Date(contest.value.startTime)
      const end = new Date(contest.value.endTime)
      return now >= start && now <= end
    })

    const isUpcoming = computed(() => {
      if (!contest.value.startTime) return false
      const now = new Date()
      return new Date(contest.value.startTime) > now
    })

    const contestStatus = computed(() => {
      if (isOngoing.value) return 'En cours'
      if (isUpcoming.value) return 'À venir'
      return 'Terminé'
    })

    const statusClass = computed(() => {
      if (isOngoing.value) return 'bg-green-100 text-green-800'
      if (isUpcoming.value) return 'bg-yellow-100 text-yellow-800'
      return 'bg-gray-100 text-gray-800'
    })

    const totalPoints = computed(() => {
      return problems.value.reduce((sum, problem) => sum + problem.points, 0)
    })

    const formatTimeRemaining = (ms) => {
      const hours = Math.floor(ms / (1000 * 60 * 60))
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((ms % (1000 * 60)) / 1000)
      return `${hours}h ${minutes}m ${seconds}s`
    }

    const timeLeft = computed(() => {
      if (!contest.value.endTime) return ''
      const now = new Date()
      const end = new Date(contest.value.endTime)
      return formatTimeRemaining(end - now)
    })

    const timeToStart = computed(() => {
      if (!contest.value.startTime) return ''
      const now = new Date()
      const start = new Date(contest.value.startTime)
      return formatTimeRemaining(start - now)
    })

    const difficultyClass = (difficulty) => {
      const classes = {
        'Facile': 'bg-green-100 text-green-800',
        'Moyen': 'bg-yellow-100 text-yellow-800',
        'Difficile': 'bg-red-100 text-red-800'
      }
      return classes[difficulty] || ''
    }

    const canAccessProblem = (problem) => {
      return isOngoing.value || !isUpcoming.value
    }

    onMounted(() => {
      fetchContest()
      fetchProblems()
      fetchLeaderboard()

      // Mettre à jour le temps restant
      const timer = setInterval(() => {
        if (!isOngoing.value && !isUpcoming.value) {
          clearInterval(timer)
        }
      }, 1000)
    })

    return {
      contest,
      problems,
      leaderboard,
      isOngoing,
      isUpcoming,
      contestStatus,
      statusClass,
      totalPoints,
      timeLeft,
      timeToStart,
      difficultyClass,
      canAccessProblem
    }
  }
}
</script>
