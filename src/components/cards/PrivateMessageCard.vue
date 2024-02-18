<template>
  <div class="flex h-screen">
    <SideBar />
  <div class="flex flex-col h-screen w-full">
    <div class="flex h-[4.5rem] items-center justify-between w-full border-b border-gray-200 p-4">
    <div class="flex-grow text-center">
      <h1 class="text-xl font-bold inline-block">
        {{ route.params.username }}
      </h1>
    </div>
  </div>
    <div class="flex-grow overflow-auto p-4 space-y-4 flex flex-col" ref="messageContainer">
      <div v-for="message in messages" :key="message.timestamp" class="flex" :class="{'justify-end': isMessageFromCurrentUser(message.senderUsername), 'justify-start': !isMessageFromCurrentUser(message.senderUsername)}">
        <div :class="{
        'bg-indigo-500 text-white': isMessageFromCurrentUser(message.senderUsername),
        'bg-gray-200 text-black': !isMessageFromCurrentUser(message.senderUsername)
      }" class="max-w-[60%] rounded-lg p-2">
          <div class="font-bold">{{ message.senderUsername || 'Unknown' }}</div>
          <div class="break-words">{{ message.text }}</div>
          <div class="timestamp text-xs text-right mt-2">{{ formatDate(message.timestamp) }}</div>
        </div>
      </div>
    </div>
    <div class="p-4 flex space-x-2">
      <input v-model="newMessage" type="text" placeholder="Écrire un message..." @keydown.enter.prevent="sendPrivateMessage" class="border-gray-600 focus:border-indigo-700 outline-none block w-full rounded-md border-2 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 pl-[14px] sm:text-sm sm:leading-6">
      <button @click="sendPrivateMessage" class="flex w-[150px] justify-center rounded-md bg-[#4341C0] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Envoyer</button>
    </div>
  </div>
    </div>
</template>


<script setup>
import {ref, computed, onMounted, watch, nextTick} from 'vue';
import { useRoute } from 'vue-router';
import SocketService from "@/socket";
import SideBar from "@/components/cards/SideBar.vue";

const messageContainer = ref(null);
const messages = ref([]);
const newMessage = ref('');

// Utilisation de useRoute pour accéder aux paramètres de la route, si nécessaire
const route = useRoute();

// Récupération des informations de l'utilisateur courant depuis le localStorage
const currentUser = computed(() => JSON.parse(localStorage.getItem('user') || '{}'));

// Fonction pour vérifier si le message provient de l'utilisateur courant
const isMessageFromCurrentUser = (senderUsername) => {
  // Assurez-vous que currentUser est correctement chargé et réactif
  return senderUsername === currentUser.value.username;
};

// Fonction pour formater les timestamps des messages
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

const fetchPrivateMessages = async () => {
  const senderId = currentUser.value.id;
  const receiverId = route.params.userId; // Assurez-vous que ce paramètre est correctement transmis à votre route

  try {
    const response = await fetch(`http://localhost:3001/private-messages/${senderId}/${receiverId}`);
    const data = await response.json();
    if (response.ok) {
      messages.value = data; // Supposons que l'API renvoie un tableau de messages
    } else {
      throw new Error(data.message || 'Could not fetch the messages');
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

watch(messages, () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
}, { deep: true });

watch(() => route.params, async (newParams) => {
  // Assurez-vous que cette logique est exécutée uniquement si les paramètres pertinents pour charger les messages sont présents
  if (newParams.userId) {
    await fetchPrivateMessages();
  }
}, { deep: true });

onMounted(() => {
  fetchPrivateMessages();
  SocketService.socket.on('receivePrivateMessage', (message) => {
    messages.value.push({...message});
    console.log('Message reçu:', message);
  });
});
// Fonction pour envoyer un message privé
const sendPrivateMessage = async () => {
  if (newMessage.value.trim() !== '') {
    const messagePayload = {
      senderId: currentUser.value.id,
      receiverId: route.params.userId, // Assurez-vous d'avoir le receiverId. Vous devrez peut-être ajuster cela selon votre logique d'application.
      senderUsername: currentUser.value.username,
      receiverUsername: route.params.username, // ou une valeur fixe si vous ne l'utilisez pas
      text: newMessage.value,
      timestamp: new Date().toISOString(),
    };

    // Envoyer le message à la base de données via votre API
    try {
      const response = await fetch('http://localhost:3001/private-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to send the message');
      }
      console.log('Message saved:', responseData);
      // Si l'enregistrement en DB est réussi, on peut également l'émettre via Socket.IO
      SocketService.socket.emit('sendPrivateMessage', messagePayload);
      messages.value.push({...messagePayload, ...responseData}); // Assume que la réponse inclut des données enrichies, comme un ID de message
    } catch (error) {
      console.error('Error sending message:', error);
    }

    newMessage.value = '';
  }
};
</script>

<style scoped>
.flex-grow::-webkit-scrollbar {
  @apply w-2;
}

.flex-grow::-webkit-scrollbar-track {
  @apply bg-gray-200;
}

.flex-grow::-webkit-scrollbar-thumb {
  @apply bg-gray-400 hover:bg-gray-500;
}

/* Pour Firefox */
.flex-grow {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.400') theme('colors.gray.200');
}
</style>
