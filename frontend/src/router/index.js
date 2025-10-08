import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeView from '@/views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/challenge',
      name: 'challenges',
      component: () => import('@/views/challenge/ChallengeView.vue')
    },
    {
      path: '/challenge/:id',
      name: 'challenge-detail',
      component: () => import('@/views/challenge/ChallengeDetailView.vue')
    },
    // Liste des concours
    {
      path: '/contests',
      name: 'contests',
      component: () => import('@/views/contests/ContestsView.vue')
    },
    // Détail d'un concours + liste des challenges du concours
    {
      path: '/contests/:id',
      name: 'contest-detail',
      component: () => import('@/views/contests/ContestDetailView.vue')
    },
    // Route pour soumettre du code (si séparée, sinon incluse dans ContestDetailView)
    {
      path: '/contests/:id/submit',
      name: 'contest-submit',
      component: () => import('@/views/contests/ContestSubmitView.vue')
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('@/views/LeaderboardView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    },
    {
      path: '/contests/:id/submit',
      name: 'contest-submit',
      component: () => import('@/views/contests/ContestSubmitView.vue')
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // Pages nécessitant une authentification
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  
  // Pages pour invités uniquement (login, register)
  if (to.meta.requiresGuest && userStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }
  
  next()
})

export default router