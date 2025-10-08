<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">{{ contest.title }}</h1>
    <p class="mb-6">{{ contest.description }}</p>

    <div v-for="challenge in contest.challenges" :key="challenge._id" class="mb-6 border rounded p-4">
      <h2 class="text-xl font-semibold mb-2">{{ challenge.title }}</h2>
      <p class="text-gray-600 mb-2">{{ challenge.description }}</p>

      <textarea
        v-model="code[challenge._id]"
        placeholder="Collez votre code ici..."
        class="w-full p-2 border rounded mb-2"
        rows="6"
      ></textarea>

      <select v-model="language[challenge._id]" class="border rounded p-1 mb-2">
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
      </select>

      <button
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        @click="submitCode(challenge._id)"
      >
        Soumettre
      </button>

      <div v-if="results[challenge._id]" class="mt-2 p-2 border rounded bg-gray-50">
        <p><strong>Score:</strong> {{ results[challenge._id].score }}</p>
        <p><strong>Statut:</strong> {{ results[challenge._id].status }}</p>
        <p v-if="results[challenge._id].output"><strong>Sortie:</strong> {{ results[challenge._id].output }}</p>
        <p v-if="results[challenge._id].error" class="text-red-600"><strong>Erreur:</strong> {{ results[challenge._id].error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const contest = ref({ title: "", description: "", challenges: [] });
const code = ref({});
const language = ref({});
const results = ref({});

const fetchContest = async () => {
  try {
    const res = await axios.get(`http://localhost:5010/api/challenges/${route.params.id}`);
    contest.value = res.data;
    contest.value.challenges.forEach(c => {
      code.value[c._id] = "";
      language.value[c._id] = "javascript";
    });
  } catch (err) {
    console.error(err);
  }
};

const submitCode = async (challengeId) => {
  try {
    const res = await axios.post("http://localhost:5010/api/submissions", {
      userId: "USER_ID_ICI",  // à remplacer par l'ID de l'utilisateur connecté
      challengeId,
      code: code.value[challengeId],
      language: language.value[challengeId],
    });
    results.value[challengeId] = res.data.submission;
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchContest);
</script>