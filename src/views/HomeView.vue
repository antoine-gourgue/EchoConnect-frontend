<template>
  <div class="flex">
    <SideBar :users="users" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import SideBar from "@/components/cards/SideBar.vue";

const users = ref([]);

const socket = io('http://localhost:3001');

onMounted(() => {
  socket.on('updateUserList', (updatedUsers) => {
    console.log("Updated users received:", updatedUsers);

    users.value = updatedUsers.map(user => ({
      id: user.socketId,
      name: user.username,
      image: 'https://avatars.githubusercontent.com/u/35387401?v=4'
    }));
  });
});

onUnmounted(() => {
  socket.disconnect();
});
</script>
