// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialiser l'utilisateur depuis localStorage AVANT de monter l'app
const userStore = useUserStore()
userStore.initUser().then(() => {
  app.mount('#app')
})