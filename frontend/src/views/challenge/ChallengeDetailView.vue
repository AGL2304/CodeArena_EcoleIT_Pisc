<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- État de chargement -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mb-4"></div>
        <p class="text-xl text-purple-200">Chargement du challenge...</p>
      </div>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-red-900/20 backdrop-blur-sm border border-red-500/50 rounded-xl p-8 max-w-md text-center">
        <div class="text-red-400 text-5xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-red-300 mb-2">Erreur</h2>
        <p class="text-red-200">{{ error }}</p>
        <button 
          @click="fetchChallenge"
          class="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 active:scale-95"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- En-tête avec navigation et statistiques -->
      <div class="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
        <button 
          @click="goBack"
          class="group mb-4 md:mb-0 flex items-center gap-2 text-purple-300 hover:text-purple-200 font-medium transition-all"
        >
          <span class="transform transition-transform group-hover:-translate-x-1">←</span>
          Retour aux challenges
        </button>

        <!-- Stats du challenge -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 text-purple-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ challenge.submissions || 0 }} soumissions</span>
          </div>
          <div class="flex items-center gap-2 text-purple-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            <span>{{ challenge.successRate || 0 }}% de réussite</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Section Description du challenge -->
        <div class="lg:col-span-2 space-y-6">
          <!-- En-tête du challenge -->
          <div class="bg-white/5 backdrop-blur-lg rounded-xl border border-purple-500/20 p-8">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                {{ challenge.title }}
              </h1>
              <span 
                :class="[
                  difficultyClass,
                  'px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2'
                ]"
              >
                <span class="w-2 h-2 rounded-full" :class="[
                  {'bg-green-400': challenge.difficulty === 'Facile'},
                  {'bg-yellow-400': challenge.difficulty === 'Moyen'},
                  {'bg-red-400': challenge.difficulty === 'Difficile'}
                ]"></span>
                {{ challenge.difficulty }}
              </span>
            </div>
            <div class="prose prose-invert max-w-none" v-html="challenge.description"></div>
          </div>
            
          <!-- Section Exemples -->
          <div v-if="challenge.examples && challenge.examples.length > 0" 
               class="bg-white/5 backdrop-blur-lg rounded-xl border border-purple-500/20 p-8">
            <h3 class="text-xl font-semibold mb-6 text-purple-200">Exemples</h3>
            <div class="space-y-6">
              <div v-for="(example, index) in challenge.examples" 
                   :key="index" 
                   class="relative">
                <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <div class="pl-4 space-y-4">
                  <div class="space-y-2">
                    <span class="text-sm font-medium text-purple-300">Entrée:</span>
                    <pre class="bg-slate-900/50 border border-purple-500/20 p-4 rounded-lg overflow-x-auto font-mono text-purple-200">{{ formatValue(example.input) }}</pre>
                  </div>
                  <div class="space-y-2">
                    <span class="text-sm font-medium text-purple-300">Sortie:</span>
                    <pre class="bg-slate-900/50 border border-purple-500/20 p-4 rounded-lg overflow-x-auto font-mono text-purple-200">{{ formatValue(example.output) }}</pre>
                  </div>
                  <p v-if="example.explanation" class="text-purple-200 text-sm italic">
                    {{ example.explanation }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Soumission de code -->
        <div class="lg:col-span-1">
          <div class="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8 sticky top-6">
            <h2 class="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Votre Solution
            </h2>
            
            <!-- Barre d'outils -->
            <div class="mb-6 space-y-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-purple-200">
                  Langage de programmation
                </label>
                <div class="relative">
                  <select 
                    v-model="selectedLanguage" 
                    @change="onLanguageChange"
                    class="w-full bg-slate-900/50 border border-purple-500/20 rounded-lg px-4 py-2.5 text-purple-200 appearance-none focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="php">PHP</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg class="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="space-y-2">
                <label class="flex items-center justify-between">
                  <span class="text-sm font-medium text-purple-200">Thème de l'éditeur</span>
                  <button
                    @click="toggleTheme"
                    class="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-900/50 border border-purple-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    :class="{ 'bg-purple-600': editorTheme === 'vs-dark' }"
                  >
                    <span
                      class="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out"
                      :class="editorTheme === 'vs-dark' ? 'translate-x-7' : 'translate-x-1'"
                    >
                      <!-- Icône Soleil -->
                      <svg
                        v-if="editorTheme === 'vs'"
                        class="h-6 w-6 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <!-- Icône Lune -->
                      <svg
                        v-else
                        class="h-6 w-6 text-purple-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                        />
                      </svg>
                    </span>
                  </button>
                </label>
              </div>
            </div>

            <!-- Monaco Editor -->
            <div class="mb-4 border-2 border-gray-300 rounded-lg overflow-hidden h-[80vh]">
                    <vue-monaco-editor
                      v-model:value="code"
                      :language="monacoLanguage"
                      :theme="editorTheme"
                      height="100%"   
                      :options="editorOptions"
                      @mount="onEditorMount"
                    />
            </div>


            <!-- Boutons d'action -->
            <div class="flex gap-2 mb-4">
              <button
                @click="resetCode"
                class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isSubmitting"
              >
                🔄 Réinitialiser
              </button>
              <button
                @click="submitSolution"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? '⏳ Soumission...' : '🚀 Soumettre' }}
              </button>
            </div>

            <!-- Raccourcis clavier -->
            <div class="text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded border border-gray-200">
              <p class="font-semibold mb-1">💡 Raccourcis clavier:</p>
              <ul class="space-y-1">
                <li>• <kbd class="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs">Ctrl+S</kbd> Soumettre</li>
                <li>• <kbd class="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs">Ctrl+/</kbd> Commenter</li>
                <li>• <kbd class="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs">Ctrl+Z</kbd> Annuler</li>
              </ul>
            </div>

            <!-- Résultats -->
            <div v-if="submissionResult" class="mt-4 animate-fadeIn">
              <div :class="resultClass" class="p-4 rounded-lg shadow-sm">
                <h3 class="font-semibold mb-2 text-lg">📊 Résultat</h3>
                <p class="text-base">{{ submissionResult.message }}</p>
                <div v-if="submissionResult.score !== undefined" class="mt-3">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-semibold text-sm">Score:</span> 
                    <span class="font-bold text-lg">{{ submissionResult.score }}/100</span>
                  </div>
                  <div class="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      :class="submissionResult.score === 100 ? 'bg-green-500' : 'bg-yellow-500'"
                      class="h-3 rounded-full transition-all duration-700 ease-out"
                      :style="{ width: submissionResult.score + '%' }"
                    ></div>
                  </div>
                </div>
                <pre v-if="submissionResult.details" class="mt-3 text-xs bg-white bg-opacity-50 p-3 rounded overflow-x-auto border border-gray-300">{{ submissionResult.details }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'ChallengeDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const challenge = ref({})
    const selectedLanguage = ref('javascript')
    const code = ref('')
    const isSubmitting = ref(false)
    const submissionResult = ref(null)
    const loading = ref(true)
    const error = ref(null)
    
    const fetchChallenge = async () => {
      loading.value = true
      error.value = null
      
      try {
        const response = await axios.get(`/api/challenge/${route.params.id}`)
        challenge.value = response.data
      } catch (err) {
        console.error('Erreur lors du chargement du challenge:', err)
        error.value = err.response?.data?.message || 'Impossible de charger le challenge'
      } finally {
        loading.value = false
      }
    }
    const editorTheme = ref('vs-dark')
    const editorInstance = ref(null)

    // Templates de code par défaut
    const codeTemplates = {
      javascript: `// Écrivez votre solution ici
function solution(input) {
  // Votre code
  
  return result;
}

// Exemple d'utilisation
console.log(solution(input));`,
      python: `# Écrivez votre solution ici
def solution(input):
    # Votre code
    
    return result

# Exemple d'utilisation
print(solution(input))`,
      java: `// Écrivez votre solution ici
public class Solution {
    public static Object solution(Object input) {
        // Votre code
        
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println(solution(input));
    }
}`,
      cpp: `// Écrivez votre solution ici
#include <iostream>
using namespace std;

auto solution(auto input) {
    // Votre code
    
    return result;
}

int main() {
    cout << solution(input) << endl;
    return 0;
}`,
      php: `<?php
// Écrivez votre solution ici
function solution($input) {
    // Votre code
    
    return $result;
}

// Exemple d'utilisation
echo solution($input);
?>`
    }

    // Mapping des langages pour Monaco
    const languageMap = {
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      php: 'php'
    }

    const monacoLanguage = computed(() => languageMap[selectedLanguage.value] || 'javascript')

    const editorOptions = {
      automaticLayout: true,
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      tabSize: 2,
      wordWrap: 'on',
      padding: { top: 10, bottom: 10 }
    }

    const difficultyClass = computed(() => {
      const classes = {
        'Facile': 'bg-green-100 text-green-800 border-2 border-green-300',
        'Moyen': 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300',
        'Difficile': 'bg-red-100 text-red-800 border-2 border-red-300'
      }
      return classes[challenge.value.difficulty] || ''
    })

    const resultClass = computed(() => {
      if (!submissionResult.value) return ''
      return submissionResult.value.success
        ? 'bg-green-50 text-green-900 border-2 border-green-300'
        : 'bg-red-50 text-red-900 border-2 border-red-300'
    })

    const formatValue = (value) => {
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2)
      }
      return value
    }

    const onEditorMount = (editor) => {
      editorInstance.value = editor
      
      // Raccourci Ctrl+S pour soumettre
      editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KeyS, () => {
        submitSolution()
      })
    }

    const onLanguageChange = () => {
      code.value = codeTemplates[selectedLanguage.value]
      submissionResult.value = null
    }

    const resetCode = () => {
      code.value = codeTemplates[selectedLanguage.value]
      submissionResult.value = null
    }

    const submitSolution = async () => {
      if (!code.value.trim()) {
        alert('⚠️ Veuillez entrer du code avant de soumettre')
        return
      }

      isSubmitting.value = true
      submissionResult.value = null
      
      try {
        const userId = localStorage.getItem('userId') || 'anonymous'
        const response = await axios.post('http://localhost:5010/api/submissions', {
          userId: userId,
          challengeId: route.params.id,
          language: selectedLanguage.value,
          code: code.value
        })
        
        const submission = response.data.submission
        submissionResult.value = {
          success: submission.status === 'Success',
          message: submission.status === 'Success' ? '✅ Tous les tests sont passés avec succès!' : '❌ Certains tests ont échoué',
          details: submission.output || submission.error,
          score: submission.score
        }
      } catch (err) {
        submissionResult.value = {
          success: false,
          message: '❌ Erreur lors de la soumission',
          details: err.response?.data?.message || err.message
        }
      } finally {
        isSubmitting.value = false
      }
    }

    const goBack = () => {
      router.push('/challenge')
    }

    const toggleTheme = () => {
      editorTheme.value = editorTheme.value === 'vs' ? 'vs-dark' : 'vs'
    }

    // Initialiser le code et charger le challenge au montage
    onMounted(() => {
      fetchChallenge()
      code.value = codeTemplates[selectedLanguage.value]
    })

    return {
      challenge,
      selectedLanguage,
      code,
      isSubmitting,
      submissionResult,
      loading,
      error,
      editorTheme,
      monacoLanguage,
      editorOptions,
      difficultyClass,
      resultClass,
      formatValue,
      submitSolution,
      fetchChallenge,
      goBack,
      onEditorMount,
      onLanguageChange,
      resetCode,
      toggleTheme
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

kbd {
  font-family: monospace;
}
</style>