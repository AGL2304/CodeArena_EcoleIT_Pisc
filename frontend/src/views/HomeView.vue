<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <section class="text-center py-20">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Bienvenue sur CodeArena
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Améliorez vos compétences en programmation à travers des défis passionnants et des compétitions en temps réel.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/register" class="btn btn-primary text-lg px-8 py-3">
            Commencer maintenant
          </RouterLink>
          <RouterLink to="/problems" class="btn btn-secondary text-lg px-8 py-3">
            Explorer les problèmes
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Statistiques -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="card text-center">
        <div class="text-4xl font-bold text-primary-600 mb-2">{{ stats.users }}+</div>
        <div class="text-gray-600">Développeurs</div>
      </div>
      <div class="card text-center">
        <div class="text-4xl font-bold text-primary-600 mb-2">{{ stats.problems }}+</div>
        <div class="text-gray-600">Problèmes</div>
      </div>
      <div class="card text-center">
        <div class="text-4xl font-bold text-primary-600 mb-2">{{ stats.contests }}+</div>
        <div class="text-gray-600">Concours</div>
      </div>
    </section>

    <!-- Fonctionnalités -->
    <section>
      <h2 class="text-3xl font-bold text-center mb-12">Pourquoi CodeArena ?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="card">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Compétitions en Temps Réel</h3>
          <p class="text-gray-600">
            Participez à des concours en direct et voyez votre classement évoluer en temps réel.
          </p>
        </div>

        <div class="card">
          <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Exécution Sécurisée</h3>
          <p class="text-gray-600">
            Votre code est exécuté dans des conteneurs Docker isolés pour une sécurité maximale.
          </p>
        </div>

        <div class="card">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Suivi des Progrès</h3>
          <p class="text-gray-600">
            Suivez votre progression et comparez-vous aux autres développeurs du monde entier.
          </p>
        </div>
      </div>
    </section>

    <!-- Concours à venir -->
    <section v-if="upcomingContests.length > 0">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold">Concours à venir</h2>
        <RouterLink to="/contests" class="text-primary-600 hover:text-primary-700 font-medium">
          Voir tous →
        </RouterLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="contest in upcomingContests" :key="contest.id" class="card hover:shadow-lg transition-shadow cursor-pointer">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold mb-2">{{ contest.title }}</h3>
              <p class="text-gray-600 text-sm">{{ contest.description }}</p>
            </div>
            <span class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
              À venir
            </span>
          </div>
          <div class="flex items-center text-sm text-gray-500 space-x-4">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(contest.startDate) }}
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {{ contest.participants }} participants
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-white text-center">
      <h2 class="text-3xl font-bold mb-4">Prêt à relever le défi ?</h2>
      <p class="text-xl mb-8 text-primary-100">
        Rejoignez des milliers de développeurs et commencez votre parcours d'apprentissage aujourd'hui.
      </p>
      <RouterLink to="/register" class="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
        Créer un compte gratuitement
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const stats = ref({
  users: 1250,
  problems: 150,
  contests: 45
})

const upcomingContests = ref([
  {
    id: 1,
    title: 'Weekly Challenge #12',
    description: 'Algorithmes de tri et recherche',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    participants: 234
  },
  {
    id: 2,
    title: 'Monthly Cup - Janvier',
    description: 'Structures de données avancées',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    participants: 567
  }
])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Ici, vous pourrez charger les vraies données depuis l'API
})
</script>