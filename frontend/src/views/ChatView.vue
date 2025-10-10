<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Header avec sélection de room -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">💬 Chat CodeArena</h1>
        
        <!-- Sélecteur de room si pas de roomId dans l'URL -->
        <div v-if="!currentRoomId" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Rejoindre ou créer une salle
            </label>
            <div class="flex gap-2">
              <input
                v-model="roomInput"
                type="text"
                placeholder="Entrez le nom de la salle..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="joinRoom"
              />
              <button
                @click="joinRoom"
                :disabled="!roomInput.trim()"
                class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Rejoindre
              </button>
            </div>
          </div>

          <!-- Liste des salles populaires (optionnel) -->
          <div class="border-t pt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Salles populaires :</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="room in popularRooms"
                :key="room"
                @click="joinRoomById(room)"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
              >
                # {{ room }}
              </button>
            </div>
          </div>
        </div>

        <!-- Bouton retour si dans une room -->
        <div v-else class="flex items-center justify-between">
          <button
            @click="leaveRoom"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Quitter la salle
          </button>
        </div>
      </div>

      <!-- Composant Chat -->
      <div v-if="currentRoomId && userData" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <ChatComponent
          :roomId="currentRoomId"
          :userId="userData.id"
          :username="userData.username"
        />
      </div>

      <!-- Message si pas connecté -->
      <div v-else-if="!userData" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p class="text-yellow-800">Vous devez être connecté pour accéder au chat.</p>
        <router-link 
          to="/login" 
          class="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Se connecter
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import ChatComponent from '@/components/ChatComponent.vue';

export default {
  name: 'ChatView',
  components: {
    ChatComponent
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();

    const roomInput = ref('');
    const currentRoomId = ref(null);
    const popularRooms = ref(['general', 'help', 'contests', 'random']);

    const userData = computed(() => {
      if (!userStore.isAuthenticated || !userStore.user) return null;
      return {
        id: userStore.user._id || userStore.user.id,
        username: userStore.user.username || userStore.user.name || 'Anonyme'
      };
    });

    const joinRoom = () => {
      if (roomInput.value.trim()) {
        currentRoomId.value = roomInput.value.trim();
        router.push(`/messages/${currentRoomId.value}`);
      }
    };

    const joinRoomById = (roomId) => {
      currentRoomId.value = roomId;
      router.push(`/messages/${roomId}`);
    };

    const leaveRoom = () => {
      currentRoomId.value = null;
      router.push('/messages');
    };

    onMounted(() => {
      // Si un roomId est dans l'URL, le charger
      if (route.params.roomId) {
        currentRoomId.value = route.params.roomId;
      }
    });

    return {
      roomInput,
      currentRoomId,
      popularRooms,
      userData,
      joinRoom,
      joinRoomById,
      leaveRoom
    };
  }
};
</script>

<style scoped>
/* Styles additionnels si nécessaire */
</style>