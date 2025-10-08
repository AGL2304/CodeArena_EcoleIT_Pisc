<template>
  <div class="container mx-auto px-4 py-8">
    <!-- En-tête et filtres -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <h1 class="text-3xl font-bold mb-4 md:mb-0">Classement</h1>
      <div class="flex flex-wrap gap-4">
        <select v-model="timeFilter" class="border rounded-md px-3 py-2">
          <option value="all-time">Tout temps</option>
          <option value="weekly">Cette semaine</option>
          <option value="monthly">Ce mois</option>
        </select>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un utilisateur..."
          class="border rounded-md px-3 py-2 min-w-[200px]"
        >
      </div>
    </div>

    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Participants actifs</h3>
        <p class="text-3xl font-bold text-blue-600">{{ stats.activeUsers }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Problèmes résolus</h3>
        <p class="text-3xl font-bold text-blue-600">{{ stats.totalSolutions }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Score moyen</h3>
        <p class="text-3xl font-bold text-blue-600">{{ stats.averageScore }}</p>
      </div>
    </div>

    <!-- Tableau de classement -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rang</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problèmes résolus</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de réussite</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière activité</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(user, index) in filteredUsers" :key="user.id" 
                :class="{'bg-blue-50': user.isCurrentUser}">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-900" :class="getRankClass(index + 1)">
                    {{ index + 1 }}
                  </span>
                  <span v-if="user.rankChange" 
                        :class="user.rankChange > 0 ? 'text-green-600' : 'text-red-600'"
                        class="ml-2 text-sm">
                    {{ user.rankChange > 0 ? '↑' : '↓' }}
                    {{ Math.abs(user.rankChange) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-lg font-semibold">{{ user.username.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                    <div class="text-sm text-gray-500">Membre depuis {{ formatDate(user.joinDate) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.score }}</div>
                <div class="text-xs text-gray-500">
                  {{ user.scoreChange > 0 ? '+' : ''}}{{ user.scoreChange }} cette période
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm text-gray-900">{{ user.solvedCount }}</span>
                  <div class="ml-2 flex space-x-1">
                    <div v-for="difficulty in ['easy', 'medium', 'hard']" :key="difficulty"
                         :class="getDifficultyColor(difficulty)"
                         class="h-2 w-2 rounded-full">
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" 
                         :style="{ width: user.successRate + '%' }">
                    </div>
                  </div>
                  <span class="ml-2 text-sm text-gray-500">{{ user.successRate }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatTimeAgo(user.lastActive) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button @click="prevPage" 
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
              Précédent
            </button>
            <button @click="nextPage"
                    :disabled="isLastPage"
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': isLastPage }">
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage de <span class="font-medium">{{ paginationStart + 1 }}</span> à
                <span class="font-medium">{{ paginationEnd }}</span> sur
                <span class="font-medium">{{ totalUsers }}</span> utilisateurs
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button @click="goToPage(1)"
                        :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                  &lt;&lt;
                </button>
                <button v-for="page in visiblePages" 
                        :key="page"
                        @click="goToPage(page)"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                        :class="page === currentPage ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-50'">
                  {{ page }}
                </button>
                <button @click="goToPage(totalPages)"
                        :disabled="currentPage === totalPages"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                  &gt;&gt;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'LeaderboardView',
  setup() {
    const users = ref([])
    const stats = ref({
      activeUsers: 0,
      totalSolutions: 0,
      averageScore: 0
    })
    const timeFilter = ref('all-time')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 10

    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/leaderboard', {
          params: {
            timeFrame: timeFilter.value,
            page: currentPage.value,
            limit: itemsPerPage
          }
        })
        users.value = response.data.users
        stats.value = response.data.stats
      } catch (error) {
        console.error('Erreur lors du chargement du classement:', error)
      }
    }

    const filteredUsers = computed(() => {
      if (!searchQuery.value) return users.value
      const query = searchQuery.value.toLowerCase()
      return users.value.filter(user => 
        user.username.toLowerCase().includes(query)
      )
    })

    const totalUsers = computed(() => filteredUsers.value.length)
    const totalPages = computed(() => Math.ceil(totalUsers.value / itemsPerPage))
    const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage)
    const paginationEnd = computed(() => Math.min(paginationStart.value + itemsPerPage, totalUsers.value))
    const isLastPage = computed(() => currentPage.value === totalPages.value)

    const visiblePages = computed(() => {
      const delta = 2
      const range = []
      for (let i = Math.max(1, currentPage.value - delta); 
           i <= Math.min(totalPages.value, currentPage.value + delta); 
           i++) {
        range.push(i)
      }
      return range
    })

    const getRankClass = (rank) => {
      if (rank === 1) return 'text-yellow-500'
      if (rank === 2) return 'text-gray-500'
      if (rank === 3) return 'text-amber-600'
      return ''
    }

    const getDifficultyColor = (difficulty) => {
      return {
        'easy': 'bg-green-500',
        'medium': 'bg-yellow-500',
        'hard': 'bg-red-500'
      }[difficulty]
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    const formatTimeAgo = (date) => {
      const now = new Date()
      const past = new Date(date)
      const diff = now - past
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (days > 0) return `il y a ${days}j`
      if (hours > 0) return `il y a ${hours}h`
      if (minutes > 0) return `il y a ${minutes}m`
      return 'à l\'instant'
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const goToPage = (page) => {
      currentPage.value = page
    }

    watch([timeFilter, currentPage], () => {
      fetchLeaderboard()
    })

    onMounted(fetchLeaderboard)

    return {
      users,
      stats,
      timeFilter,
      searchQuery,
      filteredUsers,
      currentPage,
      totalUsers,
      totalPages,
      paginationStart,
      paginationEnd,
      isLastPage,
      visiblePages,
      getRankClass,
      getDifficultyColor,
      formatDate,
      formatTimeAgo,
      prevPage,
      nextPage,
      goToPage
    }
  }
}
</script>
