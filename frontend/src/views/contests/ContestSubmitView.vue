<template>
  <div class="contest-submit-page">
    <h1>Soumettre un challenge</h1>
    <p>Page de soumission en test...</p>
    <form @submit.prevent="submitCode">
      <textarea v-model="code" placeholder="Écris ton code ici..." rows="10" cols="50"></textarea>
      <br />
      <select v-model="language">
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
      </select>
      <br />
      <button type="submit">Soumettre</button>
    </form>
    <div v-if="output">
      <h3>Résultat :</h3>
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const code = ref('')
const language = ref('javascript')
const output = ref('')

const submitCode = async () => {
  // Ici, juste un test pour simuler l'exécution
  output.value = `Code soumis en ${language.value} :\n${code.value}`
}
</script>

<style scoped>
textarea { width: 100%; margin-bottom: 10px; }
button { margin-top: 10px; padding: 5px 10px; }
</style>
