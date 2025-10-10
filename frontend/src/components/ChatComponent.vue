<template>
  <div class="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b p-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-800">Salle: {{ roomId }}</h2>
          <p class="text-sm text-gray-500">
            <span :class="isConnected ? 'text-green-500' : 'text-red-500'">●</span>
            {{ isConnected ? 'Connecté' : 'Déconnecté' }}
          </p>
        </div>
        <div class="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span class="font-semibold text-blue-700">{{ participantCount }}</span>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3" ref="messagesContainer">
      <div
        v-for="(msg, index) in messages"
        :key="msg._id || index"
        :class="msg.type === 'system' ? 'text-center' : ''"
      >
        <!-- Message système -->
        <span
          v-if="msg.type === 'system'"
          class="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full inline-block"
        >
          {{ msg.content }}
        </span>

        <!-- Message utilisateur -->
        <div
          v-else
          :class="['flex', isOwnMessage(msg.userId) ? 'justify-end' : 'justify-start']"
        >
          <div :class="['max-w-xs lg:max-w-md', isOwnMessage(msg.userId) ? 'order-2' : 'order-1']">
            <div
              v-if="!isOwnMessage(msg.userId)"
              class="text-xs text-gray-600 font-semibold mb-1 ml-1"
            >
              {{ msg.username }}
            </div>
            <div
              :class="[
                'rounded-2xl px-4 py-2',
                isOwnMessage(msg.userId)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow-sm'
              ]"
            >
              <p class="break-words">{{ msg.content }}</p>
              <div class="flex items-center justify-between mt-1 gap-2">
                <span
                  :class="[
                    'text-xs',
                    isOwnMessage(msg.userId) ? 'text-blue-100' : 'text-gray-400'
                  ]"
                >
                  {{ formatTime(msg.timestamp) }}
                </span>
                <span
                  v-if="msg.isEdited"
                  :class="[
                    'text-xs italic',
                    isOwnMessage(msg.userId) ? 'text-blue-100' : 'text-gray-400'
                  ]"
                >
                  modifié
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Indicateur de frappe -->
      <div v-if="typingUsers.size > 0" class="text-sm text-gray-500 italic ml-2">
        {{ typingUsersText }} {{ typingUsers.size > 1 ? 'sont' : 'est' }} en train d'écrire...
      </div>

      <div ref="messagesEnd"></div>
    </div>

    <!-- Input -->
    <div class="bg-white border-t p-4">
      <div class="flex gap-2">
        <input
          type="text"
          v-model="newMessage"
          @input="handleTyping"
          @keyup.enter="handleSendMessage"
          placeholder="Écrivez votre message..."
          class="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxlength="1000"
          :disabled="!isConnected"
        />
        <button
          @click="handleSendMessage"
          :disabled="!newMessage.trim() || !isConnected"
          class="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
      <div class="text-xs text-gray-400 mt-2 text-center">
        {{ newMessage.length }}/1000 caractères
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { io } from 'socket.io-client';

export default {
  name: 'ChatComponent',
  props: {
    roomId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const messages = ref([]);
    const newMessage = ref('');
    const participants = ref({});
    const typingUsers = ref(new Set());
    const isConnected = ref(false);
    const messagesEnd = ref(null);
    const messagesContainer = ref(null);
    const socket = ref(null);
    const typingTimeout = ref(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5010';

    // Computed
    const participantCount = computed(() => Object.keys(participants.value).length);

    const typingUsersText = computed(() => {
      return Array.from(typingUsers.value).join(', ');
    });

    const isOwnMessage = (messageUserId) => {
      return messageUserId === props.userId;
    };

    // Methods
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const scrollToBottom = () => {
      nextTick(() => {
        messagesEnd.value?.scrollIntoView({ behavior: 'smooth' });
      });
    };

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/messages/room/${props.roomId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          messages.value = data.messages;
          scrollToBottom();
        }
      } catch (error) {
        console.error('Erreur chargement messages:', error);
      }
    };

    const handleSendMessage = () => {
      if (newMessage.value.trim() && socket.value) {
        socket.value.emit('sendMessage', {
          roomId: props.roomId,
          content: newMessage.value.trim(),
          userId: props.userId,
          username: props.username
        });
        newMessage.value = '';
        socket.value.emit('stopTyping', { roomId: props.roomId, userId: props.userId });
      }
    };

    const handleTyping = () => {
      if (!socket.value) return;

      socket.value.emit('typing', {
        roomId: props.roomId,
        userId: props.userId,
        username: props.username
      });

      if (typingTimeout.value) {
        clearTimeout(typingTimeout.value);
      }

      typingTimeout.value = setTimeout(() => {
        socket.value.emit('stopTyping', {
          roomId: props.roomId,
          userId: props.userId
        });
      }, 2000);
    };

    const initializeSocket = () => {
      const token = localStorage.getItem('token');
      
      socket.value = io(API_URL, {
        auth: { token }
      });

      socket.value.on('connect', () => {
        console.log('✅ Socket connecté');
        isConnected.value = true;
        socket.value.emit('joinRoom', {
          roomId: props.roomId,
          username: props.username,
          userId: props.userId
        });
      });

      socket.value.on('disconnect', () => {
        console.log('❌ Socket déconnecté');
        isConnected.value = false;
      });

      socket.value.on('newMessage', (message) => {
        console.log('📩 Nouveau message:', message);
        messages.value.push(message);
        scrollToBottom();
      });

      socket.value.on('systemMessage', (data) => {
        console.log('🔔 Message système:', data);
        messages.value.push({
          type: 'system',
          content: data.content,
          timestamp: data.timestamp
        });
        scrollToBottom();
      });

      socket.value.on('roomUpdate', (updatedParticipants) => {
        console.log('👥 Mise à jour participants:', updatedParticipants);
        participants.value = updatedParticipants;
      });

      socket.value.on('userTyping', ({ userId: typingUserId, username: typingUsername, isTyping }) => {
        if (typingUserId !== props.userId) {
          if (isTyping) {
            typingUsers.value.add(typingUsername);
          } else {
            typingUsers.value.delete(typingUsername);
          }
          typingUsers.value = new Set(typingUsers.value);
        }
      });

      socket.value.on('messageDeleted', ({ messageId }) => {
        messages.value = messages.value.filter(msg => msg._id !== messageId);
      });

      socket.value.on('messageEdited', ({ messageId, content }) => {
        const messageIndex = messages.value.findIndex(msg => msg._id === messageId);
        if (messageIndex !== -1) {
          messages.value[messageIndex].content = content;
          messages.value[messageIndex].isEdited = true;
        }
      });

      socket.value.on('messageError', ({ error }) => {
        console.error('❌ Erreur message:', error);
        alert(error);
      });

      socket.value.on('connect_error', (error) => {
        console.error('❌ Erreur de connexion socket:', error);
      });
    };

    // Lifecycle
    onMounted(() => {
      console.log('🚀 Initialisation ChatComponent');
      console.log('Props:', { roomId: props.roomId, userId: props.userId, username: props.username });
      initializeSocket();
      loadMessages();
    });

    onUnmounted(() => {
      console.log('👋 Nettoyage ChatComponent');
      if (socket.value) {
        socket.value.emit('leaveRoom', { roomId: props.roomId });
        socket.value.disconnect();
      }
      if (typingTimeout.value) {
        clearTimeout(typingTimeout.value);
      }
    });

    watch(messages, () => {
      scrollToBottom();
    });

    return {
      messages,
      newMessage,
      participants,
      typingUsers,
      isConnected,
      messagesEnd,
      messagesContainer,
      participantCount,
      typingUsersText,
      isOwnMessage,
      formatTime,
      handleSendMessage,
      handleTyping
    };
  }
};
</script>

<style scoped>
/* Assurer que le conteneur prend toute la hauteur disponible */
.flex-1 {
  flex: 1;
  min-height: 0;
}

/* Scroll bar personnalisée */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>