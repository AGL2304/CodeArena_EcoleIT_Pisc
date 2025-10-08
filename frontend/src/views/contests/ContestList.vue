<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Concours disponibles</h1>
    <ul>
      <li
        v-for="contest in contests"
        :key="contest._id"
        class="border rounded p-4 mb-4 flex justify-between items-center"
      >
        <div>
          <h2 class="text-xl font-semibold">{{ contest.title }}</h2>
          <p class="text-gray-600">{{ contest.description }}</p>
        </div>
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          @click="joinContest(contest._id)"
        >
          Rejoindre
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const contests = ref([]);
const router = useRouter();

const fetchContests = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/challenges");
    contests.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const joinContest = (id) => {
  router.push({ name: "ContestDetail", params: { id } });
};

onMounted(fetchContests);
</script>
