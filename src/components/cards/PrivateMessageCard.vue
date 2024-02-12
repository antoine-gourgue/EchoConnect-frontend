<template>
  <div class="flex flex-col h-screen">
    <div class="flex-grow overflow-auto p-4 space-y-4 flex flex-col">
      <div v-for="message in messages" :key="message.timestamp" :class="{'justify-end': isMessageFromCurrentUser(message.senderUsername), 'justify-start': !isMessageFromCurrentUser(message.senderUsername)}" class="flex">
        <div :class="{'bg-indigo-500': isMessageFromCurrentUser(message.senderUsername), 'bg-gray-200': !isMessageFromCurrentUser(message.senderUsername)}" class="max-w-[60%] rounded-lg p-2">
          <div class="font-bold">{{ message.senderUsername }}</div>
          <div class="break-words">{{ message.text }}</div>
          <div class="timestamp text-xs text-right mt-2">{{ formatDate(message.timestamp) }}</div>
        </div>
      </div>
    </div>
    <div class="p-4 flex space-x-2">
      <input v-model="newMessage" type="text" placeholder="Écrire un message..." @keydown.enter="sendPrivateMessage"
             class="border-gray-600 focus:border-indigo-700 outline-none block w-full rounded-md border-2 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 pl-[14px] sm:text-sm sm:leading-6">
      <button @click="sendPrivateMessage"
              class="flex w-[150px] justify-center rounded-md bg-[#4341C0] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Envoyer
      </button>
    </div>
  </div>
</template>




<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import { useRoute } from 'vue-router';

const socket = io('http://localhost:3001');
const newMessage = ref('');
const messages = ref([]);

const route = useRoute();
const currentUser = computed(() => JSON.parse(localStorage.getItem('user')));
const receiverUsername = computed(() => route.params.username);

const isMessageFromCurrentUser = (senderUsername) => {
  return senderUsername === currentUser.value.username;
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

const sendPrivateMessage = () => {
  if (newMessage.value.trim() !== '') {
    const messagePayload = {
      senderId: currentUser.value.id,
      senderUsername: currentUser.value.username, // Assumez que username est disponible dans currentUser
      receiverUsername: receiverUsername.value,
      text: newMessage.value,
      timestamp: new Date().toISOString(),
    };

    socket.emit('sendPrivateMessage', messagePayload);
    newMessage.value = '';
  }
};

onMounted(() => {
  socket.on('receivePrivateMessage', (message) => {
    // Assurez-vous de traiter et d'afficher seulement les messages pertinents
    if (message.senderUsername === currentUser.value.username || message.receiverUsername === receiverUsername.value) {
      messages.value.push(message);
    }
  });
});

onUnmounted(() => {
  socket.off('receivePrivateMessage');
});
</script>



