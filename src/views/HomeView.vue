<template>
  <div class="flex">
    <SideBar
        :users="users"
        @logout="onLogout"
    />
    <div class="flex-1">
      <div class="flex items-center justify-between p-4 bg-gray-100 h-[4.5rem]">
        <h2 class="text-2xl font-semibold">Bienvenue, {{ currentUser.username }}</h2>
        <p class="text-gray-600">Vous êtes connecté en tant que {{ currentUser.username }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import { io } from 'socket.io-client';
import SideBar from "@/components/cards/SideBar.vue";
import router from "@/router/index";

const users = ref([]);

const socket = io('http://localhost:3001');


const currentUser = computed(() => {
  return JSON.parse(localStorage.getItem('user'));
});

onMounted(() => {
  socket.on('updateUserList', (updatedUsers) => {
    console.log("passe")
    users.value = updatedUsers.map(user => ({
      id: user.userId, // Assurez-vous que cela correspond à ce que le serveur envoie
      socketId: user.socketId,
      name: user.username,
      image: user.image,
      isOnline: user.isOnline
    }));
  });
});

const onLogout = () => {
  const userConnected = JSON.parse(localStorage.getItem('user'));

  console.log('PASSE', userConnected)
  if(userConnected){
    console.log('emit logout', userConnected.id)
    socket.emit('logout', userConnected.id);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push({ name: 'login' });
  }
};
</script>
