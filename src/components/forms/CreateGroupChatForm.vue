<template>
  <div class="flex flex-col h-screen">
    <div class="flex-grow overflow-auto">
      <div class="p-4 space-y-4 flex flex-col-reverse">
        <div v-for="message in messages" :key="message.id" :class="{'justify-end': isMessageFromCurrentUser(message.user.id), 'justify-start': !isMessageFromCurrentUser(message.user.id)}" class="flex">
          <div class="max-w-[60%] rounded-lg p-2" :class="{'bg-green-200': isMessageFromCurrentUser(message.user.id), 'bg-gray-200': !isMessageFromCurrentUser(message.user.id)}">
            <div class="font-bold">{{ message.user.username }}</div>
            <div>{{ message.text }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="flex space-x-2">
        <input v-model="newMessage" type="text" placeholder="Écrire un message..."  class= "border-gray-600 focus:border-indigo-700 outline-none block w-full rounded-md border-2 py-1.5 text-gray-900 shadow-sm
             placeholder:text-gray-400 pl-[14px] sm:text-sm sm:leading-6">
        <button @click="sendMessage" class="flex w-[150px] justify-center rounded-md bg-[#4341C0] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Envoyer
        </button>
      </div>
    </div>
  </div>
</template>



<script setup>
import {computed, ref} from 'vue';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');
const messages = ref([]);
const newMessage = ref('');

const currentUser = computed(() => {
  return JSON.parse(localStorage.getItem('user'));
});

const isMessageFromCurrentUser = (messageUserId) => {
  return messageUserId === currentUser.value.id;
};

socket.on('receiveMessage', message => {
  messages.value.push(message);
});

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    const messagePayload = {
      user: currentUser.value,
      text: newMessage.value,
      timestamp: Date.now()
    };
    socket.emit('sendMessage', messagePayload);
    newMessage.value = '';
  }
};
</script>

