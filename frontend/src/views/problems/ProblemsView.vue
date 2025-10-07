<template>
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Problèmes</h1>
      <div class="flex gap-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un problème..."
          class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          v-model="difficultyFilter"
          class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toutes les difficultés</option>
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Difficulté
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Taux de réussite
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tags
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="problem in filteredProblems" :key="problem.id" @click="goToProblem(problem.id)" class="hover:bg-gray-50 cursor-pointer">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ problem.title }}</div>
            </td>
            <td class="px-6 py-4">
              <span :class="getDifficultyClass(problem.difficulty)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ problem.difficulty }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ problem.successRate }}%
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span v-for="tag in problem.tags" :key="tag" class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                  {{ tag }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-700">
        Affichage {{ startIndex + 1 }}-{{ endIndex }} sur {{ totalProblems }} problèmes
      </div>
      <div class="flex gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          @click="nextPage"
          :disabled="endIndex >= totalProblems"
          class="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ProblemsView',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const difficultyFilter = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 10
    
    // Simulated data - to be replaced with API calls
    const problems = ref([
      {
        id: 1,
        title: 'Somme de deux nombres',
        difficulty: 'easy',
        successRate: 85,
        tags: ['math', 'arrays']
      },
      // Add more sample problems here
    ])

    const filteredProblems = computed(() => {
      return problems.value
        .filter(problem => {
          const matchesSearch = problem.title.toLowerCase().includes(searchQuery.value.toLowerCase())
          const matchesDifficulty = !difficultyFilter.value || problem.difficulty === difficultyFilter.value
          return matchesSearch && matchesDifficulty
        })
    })

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
    const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalProblems.value))
    const totalProblems = computed(() => filteredProblems.value.length)

    const getDifficultyClass = (difficulty) => {
      const classes = {
        easy: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        hard: 'bg-red-100 text-red-800'
      }
      return classes[difficulty] || ''
    }

    const goToProblem = (id) => {
      router.push(`/problems/${id}`)
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (endIndex.value < totalProblems.value) {
        currentPage.value++
      }
    }

    return {
      searchQuery,
      difficultyFilter,
      filteredProblems,
      currentPage,
      startIndex,
      endIndex,
      totalProblems,
      getDifficultyClass,
      goToProblem,
      previousPage,
      nextPage
    }
  }
}
</script>
