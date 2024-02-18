<template>
  <div class="flex h-screen">
    <SideBar />
  <div class="flex flex-col h-screen w-full">
    <div class="flex h-[13rem] items-center justify-between w-full border-b border-gray-200 p-2">
      <div class="flex-grow text-center">
        <h1 class="text-xl font-bold inline-block">
          Général
        </h1>
      </div>

    </div>
    <div class="flex-grow overflow-auto p-4 space-y-4 flex flex-col" ref="generalMessageContainer">
      <div v-for="message in messages" :key="message.id" :class="{'justify-end': isMessageFromCurrentUser(message.user.id), 'justify-start': !isMessageFromCurrentUser(message.user.id)}" class="flex">
          <div class="max-w-[60%] rounded-lg p-2"
               :class="{
            'bg-indigo-500 text-white': isMessageFromCurrentUser(message.user.id),
            'bg-gray-200 text-black': !isMessageFromCurrentUser(message.user.id)}">
            <div class="font-bold">{{ message.user.username }}</div>
            <div class="break-words">{{ message.text }}</div>
            <div class="timestamp text-xs text-right mt-2">
              {{ formatDate(message.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    <div class="p-4">
      <div class="flex space-x-2">
        <input v-model="newMessage"
               type="text" placeholder="Écrire un message..."
               class= "border-gray-600 focus:border-indigo-700 outline-none block w-full rounded-md border-2 py-1.5 text-gray-900 shadow-sm
             placeholder:text-gray-400 pl-[14px] sm:text-sm sm:leading-6"
             @keydown.enter="sendMessage">
        <button @click="sendMessage"
                class="flex w-[150px] justify-center rounded-md bg-[#4341C0] px-3 py-1.5 text-sm font-semibold leading-6 text-white
                shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-indigo-600">
          Envoyer
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>

.flex-grow {
  margin-left: 20px;
}
</style>

<script setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import {manageChatCommand} from "@/utils/chat-command";
import SideBar from "@/components/cards/SideBar.vue";
import SocketService from "@/socket";

const generalMessageContainer = ref(null);
const messages = ref([]);
const newMessage = ref('');

const currentUser = computed(() => {
  return JSON.parse(localStorage.getItem('user'));
});


const isMessageFromCurrentUser = (messageUserId) => {
  return messageUserId === currentUser.value.id;
};

SocketService.socket?.on('receiveMessage', message => {
  messages.value.push(message);
});

async function loadMessages() {
  try {
    const response = await fetch('http://localhost:3001/general-messages');
    if (response.ok) {
      const data = await response.json();
      messages.value = data.data;
    } else {
      console.error('Failed to load messages:', response.statusText);
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}


watch(messages, () => {
  nextTick(() => {
    if (generalMessageContainer.value) {
      generalMessageContainer.value.scrollTop = generalMessageContainer.value.scrollHeight;
    }
  });
}, { deep: true });


onMounted(loadMessages);

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    if (newMessage.value[0] === '/') {
      // Utilisez manageChatCommand pour traiter la commande
      manageChatCommand(newMessage.value, 'none', (channels) => {
        // Convertissez les canaux en un message système et affichez-le
        const systemMessage = {
          id: Date.now(), // Générez un ID unique pour le message
          user: { id: 'system', username: 'Système' },
          text: `Canaux disponibles: ${channels.map(channel => channel.name).join(', ')}`,
          timestamp: new Date().toISOString()
        };
        messages.value.push(systemMessage);
      });
      newMessage.value = ''; // Réinitialiser le champ de texte après l'envoi
      return;
    }
    const messagePayload = {
      user: currentUser.value,
      text: newMessage.value,
      timestamp: Date.now()
    };


    // Envoyer le message au serveur Socket.IO
    SocketService.socket?.emit('sendMessage', messagePayload);

    try {
      const response = await fetch('http://localhost:3001/general-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // Message de succès
      } else {
        console.error("Erreur lors de l'envoi du message.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
    newMessage.value = '';
  }
};
</script>
