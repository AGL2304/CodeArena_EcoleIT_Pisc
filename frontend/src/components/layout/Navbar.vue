<template>
  <nav class="bg-white shadow-md border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <RouterLink to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">C</span>
          </div>
          <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            CodeArena
          </span>
        </RouterLink>

        <div class="hidden md:flex items-center space-x-8">
          <RouterLink to="/problems" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
            Problèmes
          </RouterLink>
          <RouterLink to="/contests" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
            Concours
          </RouterLink>
          <RouterLink to="/leaderboard" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
            Classement
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
