<template>
  <div v-for="user in users" :key="user.id" class="user-image-container">
    <img :src="user.image" @click="selectUser(user)"  alt={{user.name}}/>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SocketService from "@/socket";
 // Assurez-vous que l'URL correspond à votre configuration serveur
const users = ref([]);

const selectedUser = ref(null);

function selectUser(user) {
  selectedUser.value = user;
}

// Écouter les mises à jour de la liste des utilisateurs connectés
onMounted(() => {
  SocketService.socket?.on('updateUserList', (updatedUsers) => {
    console.log("Utilisateurs mis à jour reçus:", updatedUsers);
    users.value = updatedUsers.map(user => ({
      id: user.userId,
      name: user.username,
      image: 'https://avatars.githubusercontent.com/u/35387401?v=4'
    }));
  });
});

// Nettoyer en se déconnectant
onUnmounted(() => {
  SocketService.socket?.off('updateUserList');
});

</script>
