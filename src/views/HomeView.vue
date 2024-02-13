<template>
  <div class="flex">
    <SideBar
        :users="users"
        @logout="onLogout"
    />
    <div class="flex-1">
      <div class="flex items-center justify-between p-4 bg-gray-100">
        <h2 class="text-2xl font-semibold">Bienvenue, {{ currentUser.username }}</h2>
        <p class="text-gray-600">Vous êtes connecté en tant que {{ currentUser.username }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, computed, provide} from 'vue';
import { io } from 'socket.io-client';
import SideBar from "@/components/cards/SideBar.vue";
import router from "@/router/index";

const socket = io('http://localhost:3001');
const users = ref([]);

const currentUser = computed(() => {
  return JSON.parse(localStorage.getItem('user'));
});

onMounted(() => {
  socket.on('updateUserList', (updatedUsers) => {
    console.log("passe")
    users.value = updatedUsers.map(user => ({
      id: user.userId,
      socketId: user.socketId,
      name: user.username,
      image: user.image,
      isOnline: user.isOnline
    }));
  });
});

const onLogout = () => {
  const userConnected = JSON.parse(localStorage.getItem('user'));

  if(userConnected){
    socket.emit('logout', userConnected.id);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push({ name: 'login' });
  }
};

provide('currentUser', currentUser);
</script>
