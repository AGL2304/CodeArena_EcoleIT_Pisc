<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- État de chargement -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p class="text-xl text-gray-700">Chargement du challenge...</p>
      </div>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md text-center">
        <div class="text-red-600 text-5xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-red-800 mb-2">Erreur</h2>
        <p class="text-red-700">{{ error }}</p>
        <button 
          @click="fetchChallenge"
          class="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Bouton retour -->
      <button 
        @click="goBack"
        class="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
      >
        ← Retour aux challenges
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Section Description du challenge -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h1 class="text-3xl font-bold">{{ challenge.title }}</h1>
              <span :class="difficultyClass" class="px-3 py-1 rounded-full text-sm font-semibold">
                {{ challenge.difficulty }}
              </span>
            </div>
            <div class="prose max-w-none" v-html="challenge.description"></div>
            
            <div v-if="challenge.examples && challenge.examples.length > 0" class="mt-6">
              <h3 class="text-xl font-semibold mb-3">Exemples</h3>
              <div v-for="(example, index) in challenge.examples" :key="index" class="mb-4 p-4 bg-gray-50 rounded-lg">
                <div class="mb-2">
                  <span class="font-semibold">Entrée:</span>
                  <pre class="mt-1 bg-gray-100 p-2 rounded overflow-x-auto">{{ formatValue(example.input) }}</pre>
                </div>
                <div>
                  <span class="font-semibold">Sortie:</span>
                  <pre class="mt-1 bg-gray-100 p-2 rounded overflow-x-auto">{{ formatValue(example.output) }}</pre>
                </div>
                <p v-if="example.explanation" class="mt-2 text-gray-600">
                  <span class="font-semibold">Explication:</span> {{ example.explanation }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Soumission de code -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 class="text-xl font-bold mb-4">Soumettre une solution</h2>
            
            <!-- Barre d'outils -->
            <div class="mb-4 flex gap-2 items-center">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Langage
                </label>
                <select 
                  v-model="selectedLanguage" 
                  @change="onLanguageChange"
                  class="w-full border-2 border-gray-300 rounded-md p-2 bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="php">PHP</option>
                </select>
              </div>
              
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Thème
                </label>
                <select 
                  v-model="editorTheme" 
                  class="w-full border-2 border-gray-300 rounded-md p-2 bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="vs">Clair</option>
                  <option value="vs-dark">Sombre</option>
                  <option value="hc-black">Contraste</option>
                </select>
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

    const fetchChallenge = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await axios.get(`http://localhost:5010/api/challenge/${route.params.id}`)
        challenge.value = response.data
      } catch (err) {
        error.value = 'Erreur lors du chargement du challenge'
        console.error('Erreur:', err)
      } finally {
        loading.value = false
      }
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
    const payload = {
      userId: userId,
      challengeId: route.params.id,
      language: selectedLanguage.value,
      code: code.value
    }
    
    console.log('📤 Envoi de la soumission:', {
      userId,
      challengeId: route.params.id,
      language: selectedLanguage.value,
      codeLength: code.value.length
    })
    
    const response = await axios.post('http://localhost:5010/api/submissions', payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 secondes
    })
    
    console.log('📥 Réponse reçue:', response.data)
    
    const submission = response.data.submission
      submissionResult.value = {
        success: submission.status === 'Success',
        message: submission.status === 'Success' 
          ? '✅ Tous les tests sont passés avec succès!' 
          : '❌ Certains tests ont échoué',
        details: submission.output || submission.error,
        score: submission.score
      }
    } catch (err) {
      console.error('❌ Erreur complète:', err)
      console.error('❌ Réponse erreur:', err.response?.data)
      console.error('❌ Status:', err.response?.status)
      
      let errorMessage = 'Erreur lors de la soumission'
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Timeout: le serveur met trop de temps à répondre'
      } else if (err.response) {
        errorMessage = err.response.data?.message || err.response.data?.error || 'Erreur serveur'
      } else if (err.request) {
        errorMessage = 'Aucune réponse du serveur. Vérifiez que le backend est lancé.'
      } else {
        errorMessage = err.message
      }
      
      submissionResult.value = {
        success: false,
        message: '❌ ' + errorMessage,
        details: err.response?.data?.stack || err.stack
      }
    } finally {
      isSubmitting.value = false
    }
}

    const goBack = () => {
      router.push('/challenge')
    }

    // Initialiser le code au chargement
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
      resetCode
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