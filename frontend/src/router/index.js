import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ========================================
    // 🔹 PAGES PUBLIQUES (Visiteurs non connectés)
    // ========================================
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { 
        title: 'Accueil - CodeArena',
        description: 'Rejoignez la compétition de code en temps réel'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { 
        title: 'À propos - CodeArena',
        description: 'Découvrez CodeArena et son fonctionnement'
      }
    },
    {
      path: '/challenge',
      name: 'challenges',
      component: () => import('@/views/challenge/ChallengeView.vue'),
      meta: { 
        title: 'Défis - CodeArena',
        description: 'Découvrez nos défis de programmation'
      }
    },
    {
      path: '/challenge/:id',
      name: 'challenge-detail',
      component: () => import('@/views/challenge/ChallengeDetailView.vue'),
      meta: { 
        title: 'Défi - CodeArena'
      }
    },

    // ========================================
    // 🔹 AUTHENTIFICATION
    // ========================================
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { 
        requiresGuest: true,
        title: 'Connexion - CodeArena'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { 
        requiresGuest: true,
        title: 'Inscription - CodeArena'
      }
    },

    // ========================================
    // 🔹 PAGES UTILISATEURS CONNECTÉS
    // ========================================
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Tableau de bord - CodeArena'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Profil - CodeArena'
      }
    },
    {
      path: '/submissions',
      name: 'submissions',
      component: () => import('@/views/SubmissionsView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Mes soumissions - CodeArena'
      }
    },

    // ========================================
    // 🔹 CHAT / MESSAGES
    // ========================================
    {
      path: '/messages',
      name: 'messages',
      component: () => import('@/views/ChatView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Messages - CodeArena'
      }
    },
    {
      path: '/messages/:roomId',
      name: 'chat-room',
      component: () => import('@/views/ChatView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Chat - CodeArena'
      }
    },

    // ========================================
    // 🔹 CONCOURS/COMPÉTITIONS
    // ========================================
    {
      path: '/contests',
      name: 'contests',
      component: () => import('@/views/contests/ContestsView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Concours - CodeArena'
      }
    },
    {
      path: '/contest/:id',
      name: 'contest-detail',
      component: () => import('@/views/contests/ContestDetailView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Détails du concours - CodeArena'
      }
    },
    {
      path: '/contests/:id/submit',
      name: 'contest-submit',
      component: () => import('@/views/contests/ContestSubmitView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Soumettre - CodeArena'
      }
    },
    {
      path: '/contest/:id/room',
      name: 'contest-room',
      component: () => import('@/views/contests/ContestRoomView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Salle de compétition - CodeArena'
      }
    },

    // Alias pour contests
    {
      path: '/contest',
      redirect: '/contests'
    },

    // ========================================
    // 🔹 CLASSEMENT
    // ========================================
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('@/views/LeaderboardView.vue'),
      meta: { 
        title: 'Classement - CodeArena'
      }
    },

    // ========================================
    // 🔹 ADMINISTRATION
    // ========================================
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminView.vue'),
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Administration - CodeArena'
      },
      children: [
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/AdminUsersView.vue')
        },
        {
          path: 'challenges',
          name: 'admin-challenges',
          component: () => import('@/views/admin/AdminChallengesView.vue')
        },
        {
          path: 'contests',
          name: 'admin-contests',
          component: () => import('@/views/admin/AdminContestView.vue')
        }
      ]
    },

    // ========================================
    // 🔹 SUPPORT / CONTACT
    // ========================================
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: { 
        title: 'Contact - CodeArena'
      }
    },

    // ========================================
    // 🔹 ERREURS
    // ========================================
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { 
        title: '404 - Page non trouvée'
      }
    }
  ]
})

// ========================================
// 🔹 NAVIGATION GUARDS
// ========================================
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // Définir le titre de la page
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Pages nécessitant une authentification
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ 
      name: 'login', 
      query: { redirect: to.fullPath } 
    })
    return
  }
  
  // Pages pour invités uniquement (login, register)
  if (to.meta.requiresGuest && userStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }
  
  // Vérifier les droits admin
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next({ name: 'home' })
    return
  }
  
  next()
})

// Scroll en haut de page à chaque navigation
router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router