<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-6">
        Salle de compétition #{{ contestId }}
      </h1>
      
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
        <p class="text-gray-300">Salle de compétition en temps réel (Socket.io)</p>
        <p class="text-gray-400 text-sm mt-2">Cette page sera développée prochainement</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const contestId = route.params.id
</script>