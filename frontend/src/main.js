// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueMonacoEditorPlugin, {
  paths: {
    // Configuration optionnelle pour charger Monaco depuis un CDN
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
  }
})

// Initialiser l'utilisateur depuis localStorage AVANT de monter l'app
const userStore = useUserStore()
userStore.initUser().then(() => {
  app.mount('#app')
})
