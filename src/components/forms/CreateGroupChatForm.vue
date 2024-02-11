<template>
  <div class="chat-container">
    <div class="messages-container">
      <div v-for="message in messages" :key="message.id" class="message">
<!--        <img :src="message.user.userImage" class="user-image" alt="User Image">-->
        <div class="message-content">
          <div class="username">{{ message.user.username }}</div>
          <div class="text">{{ message.text }}</div>
        </div>
      </div>
    </div>
    <div class="message-input">
      <input v-model="newMessage" type="text" placeholder="Écrire un message..." />
      <button @click="sendMessage">Envoyer</button>
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

