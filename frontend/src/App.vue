<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { connectSocket } from '@/config/api'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

const userStore = useUserStore()

onMounted(async () => {
  // Récupérer le profil utilisateur si un token existe
  if (userStore.token) {
    await userStore.fetchProfile()
    connectSocket()
  }
})
</script>

<style>
@import './assets/main.css';
</style>