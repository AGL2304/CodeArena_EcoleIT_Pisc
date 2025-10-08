<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
    <div class="container mx-auto max-w-6xl">
      
      <!-- Hero Section -->
      <div class="text-center mb-16 animate-fade-in">
        <div class="inline-block mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto transform hover:scale-110 transition-transform">
            <span class="text-white font-bold text-4xl">C</span>
          </div>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
          CodeArena
        </h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">
          La plateforme ultime pour affronter des défis de programmation en temps réel et affûter vos compétences
        </p>
      </div>

      <!-- Mission Section -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-gray-700 hover:border-blue-500/50 transition-all">
        <h2 class="text-3xl font-bold text-white mb-4 flex items-center">
          <svg class="w-8 h-8 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Notre Mission
        </h2>
        <p class="text-gray-300 text-lg leading-relaxed">
          CodeArena est née de la passion pour le code et la compétition. Notre objectif est de créer un espace où les développeurs, 
          qu'ils soient débutants ou experts, peuvent se mesurer les uns aux autres, apprendre de nouvelles techniques, 
          et progresser ensemble dans un environnement stimulant et bienveillant.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-105">
          <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Compétitions en Temps Réel</h3>
          <p class="text-gray-400">
            Participez à des concours chronométrés et affrontez d'autres développeurs dans des défis palpitants.
          </p>
        </div>

        <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-105">
          <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Validation Automatique</h3>
          <p class="text-gray-400">
            Soumettez votre code et obtenez un feedback instantané grâce à notre système de tests automatisés.
          </p>
        </div>

        <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-105">
          <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Classement Global</h3>
          <p class="text-gray-400">
            Suivez votre progression et comparez-vous aux meilleurs développeurs de la communauté.
          </p>
        </div>
      </div>

      <!-- Technologies Section -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-gray-700">
        <h2 class="text-3xl font-bold text-white mb-6 flex items-center">
          <svg class="w-8 h-8 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Technologies Utilisées
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xl font-semibold text-blue-400 mb-3">Frontend</h3>
            <ul class="space-y-2 text-gray-300">
              <li class="flex items-center">
                <span class="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Vue.js 3 - Framework JavaScript progressif
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Tailwind CSS - Framework CSS utilitaire
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Socket.io - Communication en temps réel
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-green-400 mb-3">Backend</h3>
            <ul class="space-y-2 text-gray-300">
              <li class="flex items-center">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Node.js & Express - Serveur robuste
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                MongoDB - Base de données NoSQL
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                JWT - Authentification sécurisée
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- How it Works -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-gray-700">
        <h2 class="text-3xl font-bold text-white mb-8 text-center">Comment ça marche ?</h2>
        <div class="grid md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-blue-400">1</span>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Inscription</h3>
            <p class="text-gray-400 text-sm">Créez votre compte gratuitement en quelques secondes</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-blue-400">2</span>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Rejoindre</h3>
            <p class="text-gray-400 text-sm">Choisissez un concours ou un défi qui vous intéresse</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-blue-400">3</span>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Coder</h3>
            <p class="text-gray-400 text-sm">Résolvez les problèmes avec votre langage préféré</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-blue-400">4</span>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Progresser</h3>
            <p class="text-gray-400 text-sm">Gagnez des points et grimpez dans le classement</p>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/30 text-center">
          <div class="text-4xl font-bold text-blue-400 mb-2">500+</div>
          <div class="text-gray-300">Défis disponibles</div>
        </div>
        
        <div class="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/30 text-center">
          <div class="text-4xl font-bold text-green-400 mb-2">10k+</div>
          <div class="text-gray-300">Soumissions par mois</div>
        </div>
        
        <div class="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/30 text-center">
          <div class="text-4xl font-bold text-purple-400 mb-2">24/7</div>
          <div class="text-gray-300">Compétitions actives</div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Prêt à relever le défi ?</h2>
        <p class="text-blue-100 mb-6 max-w-2xl mx-auto">
          Rejoignez des milliers de développeurs qui améliorent leurs compétences chaque jour sur CodeArena
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink 
            to="/register" 
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 inline-block"
          >
            Commencer maintenant
          </RouterLink>
          <RouterLink 
            to="/challenge" 
            class="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all border-2 border-white/30 inline-block"
          >
            Explorer les défis
          </RouterLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}
</style>