<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Concours</h1>
      <div class="flex gap-4">
        <select v-model="statusFilter" class="border rounded-md px-3 py-2">
          <option value="all">Tous les statuts</option>
          <option value="upcoming">À venir</option>
          <option value="ongoing">En cours</option>
          <option value="ended">Terminés</option>
        </select>
      </div>
    </div>

    <!-- Concours en cours -->
    <div v-if="ongoingContests.length > 0" class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">En cours</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="contest in ongoingContests" :key="contest.id" 
             class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold">{{ contest.title }}</h3>
              <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                En cours
              </span>
            </div>
            <p class="text-gray-600 mb-4">{{ contest.description }}</p>
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Participants:</span>
                <span class="font-semibold">{{ contest.participantsCount }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Problèmes:</span>
                <span class="font-semibold">{{ contest.problemCount }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Fin dans:</span>
                <span class="font-semibold">{{ formatTimeLeft(contest.endTime) }}</span>
              </div>
            </div>
            <router-link :to="{ name: 'contest-detail', params: { id: contest.id }}"
                        class="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Rejoindre
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Concours à venir -->
    <div v-if="upcomingContests.length > 0" class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">À venir</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="contest in upcomingContests" :key="contest.id" 
             class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold">{{ contest.title }}</h3>
              <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                À venir
              </span>
            </div>
            <p class="text-gray-600 mb-4">{{ contest.description }}</p>
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Début dans:</span>
                <span class="font-semibold">{{ formatTimeLeft(contest.startTime) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Durée:</span>
                <span class="font-semibold">{{ formatDuration(contest.duration) }}</span>
              </div>
            </div>
            <button class="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md cursor-not-allowed">
              Bientôt disponible
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Concours terminés -->
    <div v-if="endedContests.length > 0" class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Terminés</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="contest in endedContests" :key="contest.id" 
             class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold">{{ contest.title }}</h3>
              <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                Terminé
              </span>
            </div>
            <p class="text-gray-600 mb-4">{{ contest.description }}</p>
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Participants:</span>
                <span class="font-semibold">{{ contest.participantsCount }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Date:</span>
                <span class="font-semibold">{{ formatDate(contest.endTime) }}</span>
              </div>
            </div>
            <router-link :to="{ name: 'contest-detail', params: { id: contest.id }}"
                        class="block w-full text-center bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
              Voir les résultats
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucun concours -->
    <div v-if="filteredContests.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">
        Aucun concours {{ statusFilter !== 'all' ? 'dans cette catégorie' : '' }} pour le moment.
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'ContestsView',
  setup() {
    const contests = ref([])
    const statusFilter = ref('all')

    const fetchContests = async () => {
      try {
        const response = await axios.get('/api/contests')
        contests.value = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des concours:', error)
      }
    }

    const filteredContests = computed(() => {
      if (statusFilter.value === 'all') return contests.value
      return contests.value.filter(contest => {
        const now = new Date()
        const start = new Date(contest.startTime)
        const end = new Date(contest.endTime)
        
        switch (statusFilter.value) {
          case 'upcoming':
            return start > now
          case 'ongoing':
            return start <= now && end > now
          case 'ended':
            return end < now
          default:
            return true
        }
      })
    })

    const ongoingContests = computed(() => {
      const now = new Date()
      return contests.value.filter(contest => {
        const start = new Date(contest.startTime)
        const end = new Date(contest.endTime)
        return start <= now && end > now
      })
    })

    const upcomingContests = computed(() => {
      const now = new Date()
      return contests.value.filter(contest => {
        return new Date(contest.startTime) > now
      })
    })

    const endedContests = computed(() => {
      const now = new Date()
      return contests.value.filter(contest => {
        return new Date(contest.endTime) < now
      })
    })

    const formatTimeLeft = (date) => {
      const now = new Date()
      const target = new Date(date)
      const diff = target - now
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (days > 0) return `${days}j ${hours}h`
      if (hours > 0) return `${hours}h ${minutes}m`
      return `${minutes}m`
    }

    const formatDuration = (duration) => {
      const hours = Math.floor(duration / 60)
      const minutes = duration % 60
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    onMounted(fetchContests)

    return {
      contests,
      statusFilter,
      filteredContests,
      ongoingContests,
      upcomingContests,
      endedContests,
      formatTimeLeft,
      formatDuration,
      formatDate
    }
  }
}
</script>
