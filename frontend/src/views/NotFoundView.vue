<template>
  <div class="text-center py-20">
    <div class="text-9xl font-bold text-gray-200 mb-4">404</div>
    <h1 class="text-4xl font-bold mb-4">Page non trouvée</h1>
    <p class="text-xl text-gray-600 mb-8">
      La page que vous recherchez n'existe pas.
    </p>
    <RouterLink to="/" class="btn btn-primary">
      Retour à l'accueil
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
