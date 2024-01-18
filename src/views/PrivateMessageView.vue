<template>
  <div class="flex h-screen">
    <SideBar :users="users" />

    <div class="flex flex-col flex-1" v-if="selectedUser">
      <ChatCard :selectedUser="selectedUser" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import SideBar from '@/components/cards/SideBar.vue';
import ChatCard from '@/components/cards/ChatCard.vue';

interface User {
  id: number;
  name: string;
  image: string;
}

const route = useRoute();
const selectedUser = ref<User | null>(null);

const users: User[] = [
  { id: 1, name: 'User 1', image: 'https://avatars.githubusercontent.com/u/35387401?v=4' },
  { id: 2, name: 'User 2', image: 'https://avatars.githubusercontent.com/u/35387401?v=4' }
];

onMounted(() => {
  const userName = route.params.userName as string;
  selectedUser.value = users.find(user => user.name === userName) || null;
});
</script>
