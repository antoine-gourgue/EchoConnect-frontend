<template>
  <div class="flex h-screen">
    <SideBar />
    <div class="flex flex-col h-screen w-full">
      <!-- Zone d'affichage des messages -->
      <div class="flex-grow overflow-auto p-4 space-y-4" :ref="messageContainerRef">
        <div v-for="message in messages" :key="message.timestamp" class="flex" :class="{'justify-end': isMessageFromCurrentUser(message.senderId), 'justify-start': !isMessageFromCurrentUser(message.senderId)}">
          <div :class="{
                'bg-indigo-500 text-white': isMessageFromCurrentUser(message.senderId),
                'bg-gray-200 text-black': !isMessageFromCurrentUser(message.senderId)
              }" class="max-w-[60%] rounded-lg p-2">
            <div class="font-bold">{{ message.senderUsername || 'Anonyme' }}</div>
            <div class="break-words">{{ message.text }}</div>
            <div class="timestamp text-xs text-right mt-2">{{ formatDate(message.timestamp) }}</div>
          </div>
        </div>
      </div>

      <!-- Zone de saisie des messages -->
      <div class="p-4">
        <div class="flex space-x-2">
          <input v-model="newMessage" type="text" placeholder="Écrire un message..." class="border-gray-600 focus:border-indigo-700 outline-none block w-full rounded-md border-2 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 pl-[14px] sm:text-sm sm:leading-6" @keyup.enter="sendMessage"/>
          <button @click="sendMessage" class="flex w-[150px] justify-center rounded-md bg-[#4341C0] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Envoyer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import SocketService from '@/socket';
import SideBar from "@/components/cards/SideBar.vue";

const route = useRoute();
const messageContainerRef = ref(null);
const messages = ref([]);
const newMessage = ref('');

// Récupération de l'utilisateur actuel depuis localStorage
const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'));

const channelName = computed(() => route.params.channelName);
const channelId = computed(() => route.params.id);

const isMessageFromCurrentUser = (senderId) => {
  return senderId === currentUser.value.id;
};

const sendMessage = () => {
  if (newMessage.value.trim()) {
    const message = {
      channelId: channelId.value,
      senderId: currentUser.value.id,
      senderUsername: currentUser.value.username,
      text: newMessage.value,
      timestamp: new Date().toISOString(),
    };

    SocketService.socket.emit('sendChannelMessage', message);

    messages.value.push(message);
    newMessage.value = '';

    nextTick(() => {
      if (messageContainerRef.value) {
        messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight;
      }
    });
  }
};

SocketService.socket.on('receiveChannelMessage', (message) => {
  if (message.channelId === channelId.value) {
    messages.value.push(message);

    nextTick(() => {
      if (messageContainerRef.value) {
        messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight;
      }
    });
  }
});

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

onMounted(() => {
  SocketService.socket.emit('joinChannel', { channelId: channelId.value, userId: currentUser.value.id });
});
</script>