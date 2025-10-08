<template>
  <nav class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-2 group">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <span class="text-white font-bold text-xl">C</span>
          </div>
          <span class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            CodeArena
          </span>
        </RouterLink>

        <!-- Navigation Desktop -->
        <div class="hidden md:flex items-center space-x-8">
          <RouterLink 
            to="/challenge" 
            class="text-gray-300 hover:text-blue-400 font-medium transition-colors relative group"
          >
            Challenges
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </RouterLink>
          <RouterLink 
            to="/contests" 
            class="text-gray-300 hover:text-blue-400 font-medium transition-colors relative group"
          >
            Concours
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </RouterLink>
          <RouterLink 
            to="/leaderboard" 
            class="text-gray-300 hover:text-blue-400 font-medium transition-colors relative group"
          >
            Classement
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </RouterLink>
        </div>

        <!-- Boutons Auth / User Menu Desktop -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="userStore.isAuthenticated">
            <!-- Menu utilisateur -->
            <div class="relative" ref="userMenuRef">
              <button 
                @click="toggleUserMenu"
                class="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <span class="text-white text-sm font-semibold">
                    {{ userStore.user?.username?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <span class="font-medium">{{ userStore.user?.username }}</span>
                <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isUserMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown menu -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div 
                  v-if="isUserMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1"
                >
                  <RouterLink 
                    to="/profile" 
                    class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-colors"
                    @click="closeUserMenu"
                  >
                    Mon Profil
                  </RouterLink>
                  <RouterLink 
                    to="/my-submissions" 
                    class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-colors"
                    @click="closeUserMenu"
                  >
                    Mes Soumissions
                  </RouterLink>
                  <hr class="my-1 border-gray-700">
                  <button 
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              </transition>
            </div>
          </template>
          <template v-else>
            <RouterLink 
              to="/login" 
              class="text-gray-300 hover:text-blue-400 font-medium transition-colors"
            >
              Connexion
            </RouterLink>
            <RouterLink 
              to="/register" 
              class="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              S'inscrire
            </RouterLink>
          </template>
        </div>

        <!-- Bouton Menu Mobile -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden text-gray-300 hover:text-blue-400 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              v-if="!isMobileMenuOpen"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Menu Mobile -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isMobileMenuOpen" class="md:hidden pb-4 border-t border-gray-700 mt-2">
          <div class="space-y-2 pt-2">
            <RouterLink 
              to="/challenge" 
              class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-blue-400 rounded transition-colors"
              @click="closeMobileMenu"
            >
              Challenges
            </RouterLink>
            <RouterLink 
              to="/contests" 
              class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-blue-400 rounded transition-colors"
              @click="closeMobileMenu"
            >
              Concours
            </RouterLink>
            <RouterLink 
              to="/leaderboard" 
              class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-blue-400 rounded transition-colors"
              @click="closeMobileMenu"
            >
              Classement
            </RouterLink>

            <hr class="my-2 border-gray-700">

            <template v-if="userStore.isAuthenticated">
              <div class="px-4 py-2 text-gray-400 text-sm">
                Connecté en tant que <span class="text-blue-400 font-semibold">{{ userStore.user?.username }}</span>
              </div>
              <RouterLink 
                to="/profile" 
                class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-blue-400 rounded transition-colors"
                @click="closeMobileMenu"
              >
                Mon Profil
              </RouterLink>
              <RouterLink 
                to="/my-submissions" 
                class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-blue-400 rounded transition-colors"
                @click="closeMobileMenu"
              >
                Mes Soumissions
              </RouterLink>
              <button 
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded transition-colors"
              >
                Déconnexion
              </button>
            </template>
            <template v-else>
              <RouterLink 
                to="/login" 
                class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-blue-400 rounded transition-colors"
                @click="closeMobileMenu"
              >
                Connexion
              </RouterLink>
              <RouterLink 
                to="/register" 
                class="block mx-4 mt-2 text-center bg-gradient-to-r from-blue-500 to-orange-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all"
                @click="closeMobileMenu"
              >
                S'inscrire
              </RouterLink>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const userMenuRef = ref(null)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const handleLogout = async () => {
  await userStore.logout()
  closeUserMenu()
  closeMobileMenu()
  router.push('/')
}

// Fermer les menus en cliquant à l'extérieur
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    closeUserMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>