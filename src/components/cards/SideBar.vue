<template>
  <div class="flex bg-gray-100 text-gray-900">
    <aside class="flex h-screen w-20 flex-col items-center border-r border-gray-200 bg-white">
      <div class="flex h-[4.5rem] w-full items-center justify-center border-b border-gray-200 p-2">
        <img src="/EchoConnectLogo.png" />
      </div>
      <nav class="flex flex-1 flex-col gap-y-4 pt-10">
        <button class="group relative rounded-xl bg-gray-100 p-2 text-gray-600 hover:text-indigo-600 " @click="toggleUsersDisplay">
          <i class="fa-solid fa-message"></i>
          <div class="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
            <div class="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
              <div class="absolute inset-0 -left-1 flex items-center">
                <div class="h-2 w-2 rotate-45 bg-white"></div>
              </div>
              Messages privés
            </div>
          </div>
        </button>
        <div v-if="true" class="user-list">
          <div v-for="user in users" :key="user.id" class="group mb-2 flex items-center relative">
            <img class="h-10 w-10 rounded-full" :src="user.image" :alt="user.name" />
            <span v-if="user.isOnline" class="ml-2 h-3 w-3 rounded-full bg-green-500 border-2 border-white absolute bottom-0 left-5"></span>
            <div class="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
              <div class="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                <div class="absolute inset-0 -left-1 flex items-center">
                  <div class="h-2 w-2 rotate-45 bg-white"></div>
                </div>
                {{ user.username}}
              </div>
            </div>
          </div>
        </div>
        <button class="group relative rounded-xl bg-gray-100 p-2 text-gray-600 hover:text-indigo-600" @click="toggleUsersDisplay">
          <i class="fa-solid fa-user-group"></i>
          <div class="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
            <div class="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
              <div class="absolute inset-0 -left-1 flex items-center">
                <div class="h-2 w-2 rotate-45 bg-white"></div>
              </div>
              Groupes
            </div>
          </div>
        </button>
<!--        <div v-if="showGroups" class="groups-list">-->
<!--          <div v-for="group in groups" :key="group.id" class="mb-2">-->
<!--            <button @click="$emit('selectGroup', group)" class="focus:outline-none">-->
<!--              <img class="h-10 w-10 rounded-full" :src="group.image" :alt="group.name" />-->
<!--            </button>-->
<!--          </div>-->
<!--        </div>-->
      </nav>

      <div class="flex flex-col items-center gap-y-4 py-10">
        <button
            class="group relative rounded-xl p-2 text-gray-600 hover:text-indigo-600"
            @click="onLogout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
        <button class="mt-2 rounded-full bg-gray-100" @click="toggleAvatarDisplay">
          <img class="h-10 w-10 rounded-full" src="https://avatars.githubusercontent.com/u/35387401?v=4" alt="" />
        </button>
      </div>

    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Assurez-vous que l'URL correspond à votre serveur Socket.IO
const users = ref([]); // Stocke les utilisateurs connectés
const showUsers = ref(false); // Contrôle l'affichage de la liste des utilisateurs
const emit = defineEmits(['logout'])

const currentUser = ref(JSON.parse(localStorage.getItem('user')));


// Écouter les mises à jour de la liste des utilisateurs connectés
onMounted(() => {
  socket.on('updateUserList', (updatedUsers) => {
    // S'assurer que l'on filtre en utilisant le bon champ d'identifiant pour les utilisateurs
    users.value = updatedUsers.filter(user => user.userId !== currentUser.value.id); // Assurez-vous que 'id' est le bon champ
    console.log("Liste des utilisateurs mise à jour sans l'utilisateur courant", users.value);
  });
});

// Nettoyer lors du démontage du composant
onUnmounted(() => {
  socket.off('updateUserList');
});

// Fonction pour basculer l'affichage des utilisateurs
function toggleUsersDisplay() {
  showUsers.value = !showUsers.value;
}

const onLogout = () => {
  emit('logout')
}
</script>


