<template>
  <div class="flex bg-gray-100 text-gray-900">
    <aside class="flex h-screen w-20 flex-col items-center border-r border-gray-200 bg-white">
      <div class="flex h-[4.5rem] w-full items-center justify-center border-b border-gray-200 p-2">
        <img src="/EchoConnectLogo.png" />
      </div>
      <nav class="flex flex-1 flex-col gap-y-4 pt-10">
        <button class="group relative rounded-xl bg-gray-100 p-2 text-gray-600 hover:text-indigo-600 " @click="toggleUsersDisplay">
          <svg class="h-6 w-6 stroke-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15a2 2 0 002-2V5a2 2 0 00-2-2H3a2 2 0 00-2 2v8a2 2 0 002 2h6l4 4 4-4h4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
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
          {{users?.length}}
          <div v-for="user in users" :key="user.id" class="mb-2 flex items-center">
            <img class="h-10 w-10 rounded-full" :src="user.image" :alt="user.name" />
            <span v-if="user.isOnline" class="ml-2 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
            <span class="ml-4">{{ user.name }}</span>
          </div>
        </div>
        <button class="group relative rounded-xl bg-gray-100 p-2 text-gray-600 hover:text-indigo-600" @click="toggleUsersDisplay">
          <svg class="h-6 w-6 stroke-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>


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
          D
        </button>


        <button class="group relative rounded-xl p-2 text-gray-600 hover:text-indigo-600" @click="toggleSettingsDisplay">
          <div class="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
            <div class="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
              <div class="absolute inset-0 -left-1 flex items-center">
                <div class="h-2 w-2 rotate-45 bg-white"></div>
              </div>
              Paramètres
            </div>
          </div>
          <svg class="h-6 w-6 stroke-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15.4c-1.87 0-3.4-1.53-3.4-3.4s1.53-3.4 3.4-3.4 3.4 1.53 3.4 3.4-1.53 3.4-3.4 3.4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.07 12.93v-1.86l1.43-1.10a1 1 0 00.25-1.26l-1.36-2.35a1 1 0 00-1.26-.25l-1.69 1.30a7.38 7.38 0 00-1.65-.96l-.25-1.98a1 1 0 00-.99-.74h-2.72a1 1 0 00-.99.74l-.25 1.98c-.57.20-1.10.45-1.65.96l-1.69-1.30a1 1 0 00-1.26.25l-1.36 2.35a1 1 0 00.25 1.26l1.43 1.10v1.86l-1.43 1.10a1 1 0 00-.25 1.26l1.36 2.35a1 1 0 001.26.25l1.69-1.30c.55.50 1.08.86 1.65.96l.25 1.98a1 1 0 00.99.74h2.72a1 1 0 00.99-.74l.25-1.98c.57-.10 1.10-.45 1.65-.96l1.69 1.30a1 1 0 001.26-.25l1.36-2.35a1 1 0 00-.25-1.26l-1.43-1.10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

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

// Écouter les mises à jour de la liste des utilisateurs connectés
onMounted(() => {
  socket.on('updateUserList', (updatedUsers) => {
    users.value = updatedUsers;
    console.log("Liste des utilisateurs mise à jour", users.value);
    // Pour s'assurer que la liste est visible dès réception des données
    showUsers.value = true;
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


