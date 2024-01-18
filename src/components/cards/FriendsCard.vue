<template>
  <div v-for="user in users" :key="user.id" class="user-image-container">
    <img :src="user.image" @click="selectUser(user)" />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import SideBar from "@/components/cards/SideBar.vue";
import ChatCard from "@/components/cards/ChatCard.vue";

const users = [
  // Remplacez ceci par vos données utilisateur
  { id: 1, name: 'User 1', image: 'path/to/image1.jpg' },
  { id: 2, name: 'User 2', image: 'path/to/image2.jpg' }
];

const selectedUser = ref(null);

function selectUser(user) {
  selectedUser.value = user;
}
</script>