<template>
  <div class="flex h-screen">
    <SideBar :users="users" />

    <div class="flex flex-col flex-1" v-if="selectedUser">
      <ChatCard :key="selectedUser.id" :selectedUser="selectedUser" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import { io } from 'socket.io-client';
import { useRoute } from 'vue-router';
import SideBar from '@/components/cards/SideBar.vue';
import ChatCard from '@/components/cards/ChatCard.vue';

interface User {
  id: string;
  name: string;
  image: string;
}

const route = useRoute();
const selectedUser = ref<User | null>(null);
const users = ref<User[]>([]);
const socket = io('http://localhost:3001');

onMounted(() => {
  socket.on('updateUserList', (updatedUsers: any[]) => {
    users.value = updatedUsers.map(user => ({
      id: user.socketId,
      name: user.username,
      image: 'https://avatars.githubusercontent.com/u/35387401?v=4'
    }));
  });

  watch(() => route.params.userId, (newUserId) => {
    selectedUser.value = users.value.find(user => user.name === newUserId) || null;
  }, { immediate: true });
});

onUnmounted(() => {
  socket.disconnect();
});
</script>

