<template>
  <div class="flex flex-col h-screen">
    <div class="flex-grow overflow-auto p-4 space-y-4 flex flex-col">
      <div v-for="message in messages" :key="message.timestamp" class="flex" :class="{'justify-end': isMessageFromCurrentUser(message.senderUsername), 'justify-start': !isMessageFromCurrentUser(message.senderUsername)}">
        <div :class="{'bg-indigo-500 text-white': isMessageFromCurrentUser(message.senderUsername), 'bg-gray-200 text-black': !isMessageFromCurrentUser(message.senderUsername)}" class="max-w-[60%] rounded-lg p-2">
          <div class="font-bold">{{ message.senderUsername || 'Unknown' }}</div>
          <div class="break-words">{{ message }}</div>
          <div class="timestamp text-xs text-right mt-2">{{ formatDate(message.timestamp) }}</div>
        </div>
      </div>
    </div>
    <div class="p-4 flex space-x-2">
      <input v-model="newMessage" type="text" placeholder="Écrire un message..." @keydown.enter.prevent="sendPrivateMessage" class="border-gray-600 focus:border-indigo-700 outline-none block w-full rounded-md border-2 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 pl-[14px] sm:text-sm sm:leading-6">
      <button @click="sendPrivateMessage" class="flex w-[150px] justify-center rounded-md bg-[#4341C0] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Envoyer</button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { io } from 'socket.io-client';
import { useRoute } from 'vue-router';

// Initialisation de Socket.io
const socket = io('http://localhost:3001');
const messages = ref([]);
const newMessage = ref('');

// Utilisation de useRoute pour accéder aux paramètres de la route, si nécessaire
const route = useRoute();

// Récupération des informations de l'utilisateur courant depuis le localStorage
const currentUser = computed(() => JSON.parse(localStorage.getItem('user') || '{}'));

// Fonction pour vérifier si le message provient de l'utilisateur courant
const isMessageFromCurrentUser = (message) => {
  return message.senderUsername === currentUser.value.username;
};

// Fonction pour formater les timestamps des messages
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

// Écouter les messages privés reçus
socket.on('receivePrivateMessage', (message) => {
  messages.value.push(message);
  console.log('Message reçu:', message);
});

// Fonction pour envoyer un message privé
const sendPrivateMessage = () => {
  if (newMessage.value.trim() !== '') {
    const messagePayload = {
      senderId: currentUser.value.id,
      senderUsername: currentUser.value.username,
      receiverUsername: route.params.username, // ou une valeur fixe si vous ne l'utilisez pas
      text: newMessage.value,
      timestamp: new Date().toISOString(),
    };

    // Envoyer le message au serveur
    socket.emit('sendPrivateMessage', messagePayload);
    console.log('Message envoyé:', messagePayload);
    newMessage.value = '';
  }
};
</script>
