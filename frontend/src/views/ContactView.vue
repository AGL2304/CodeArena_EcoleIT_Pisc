<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">
          Contactez-nous
        </h1>
        <p class="text-lg text-gray-300">
          Une question ? Un problème ? Notre équipe est là pour vous aider.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Formulaire de contact -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-500/20">
          <h2 class="text-2xl font-bold text-white mb-6">Envoyez-nous un message</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Nom -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
                Nom complet
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="John Doe"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="john@example.com"
              />
            </div>

            <!-- Sujet -->
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-300 mb-2">
                Sujet
              </label>
              <select
                id="subject"
                v-model="form.subject"
                required
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="bug">🐛 Signaler un bug</option>
                <option value="feature">💡 Suggérer une fonctionnalité</option>
                <option value="account">👤 Problème de compte</option>
                <option value="competition">🏆 Question sur une compétition</option>
                <option value="other">💬 Autre</option>
              </select>
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="5"
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                placeholder="Décrivez votre demande en détail..."
              ></textarea>
            </div>

            <!-- Message de succès/erreur -->
            <div v-if="status.message" 
                 :class="[
                   'p-4 rounded-lg',
                   status.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                 ]"
            >
              {{ status.message }}
            </div>

            <!-- Bouton d'envoi -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">Envoyer le message</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
            </button>
          </form>
        </div>

        <!-- Informations de contact -->
        <div class="space-y-6">
          <!-- FAQ rapide -->
          <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-500/20">
            <h3 class="text-xl font-bold text-white mb-4">Questions fréquentes</h3>
            
            <div class="space-y-4">
              <div class="border-b border-slate-700 pb-4">
                <h4 class="text-purple-400 font-semibold mb-2">Comment participer à une compétition ?</h4>
                <p class="text-gray-400 text-sm">
                  Créez un compte, accédez à la page "Compétitions" et cliquez sur "Rejoindre" pour entrer dans une salle.
                </p>
              </div>

              <div class="border-b border-slate-700 pb-4">
                <h4 class="text-purple-400 font-semibold mb-2">Comment soumettre une solution ?</h4>
                <p class="text-gray-400 text-sm">
                  Dans la salle de compétition, écrivez votre code et cliquez sur "Soumettre". Les tests s'exécutent automatiquement.
                </p>
              </div>

              <div class="border-b border-slate-700 pb-4">
                <h4 class="text-purple-400 font-semibold mb-2">Comment fonctionne le classement ?</h4>
                <p class="text-gray-400 text-sm">
                  Les scores sont calculés en temps réel selon la rapidité et la justesse de vos solutions.
                </p>
              </div>

              <div class="pb-4">
                <h4 class="text-purple-400 font-semibold mb-2">Puis-je m'entraîner sans compétition ?</h4>
                <p class="text-gray-400 text-sm">
                  Oui ! Rendez-vous dans "Mode entraînement" pour résoudre des défis à votre rythme.
                </p>
              </div>
            </div>
          </div>

          <!-- Coordonnées -->
          <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-500/20">
            <h3 class="text-xl font-bold text-white mb-4">Autres moyens de contact</h3>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-400">Email</p>
                  <a href="mailto:support@codearena.com" class="text-purple-400 hover:text-purple-300 transition">
                    support@codearena.com
                  </a>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-400">Temps de réponse</p>
                  <p class="text-white">Sous 24-48 heures</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-400">Communauté</p>
                  <a href="#" class="text-purple-400 hover:text-purple-300 transition">
                    Rejoindre Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const status = reactive({
  type: '',
  message: ''
})

const handleSubmit = async () => {
  loading.value = true
  status.type = ''
  status.message = ''

  try {
    // Simuler l'envoi d'un email (à remplacer par votre API)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Ici, vous devriez faire un appel à votre backend
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(form)
    // })

    status.type = 'success'
    status.message = '✅ Message envoyé avec succès ! Nous vous répondrons sous 24-48h.'
    
    // Réinitialiser le formulaire
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (error) {
    status.type = 'error'
    status.message = '❌ Erreur lors de l\'envoi. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>