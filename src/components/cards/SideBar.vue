<template>
  <link href='https://fonts.googleapis.com/css?family=Fredoka+One' rel='stylesheet'>
  <div class="flex bg-gray-100 text-gray-900">
    <aside class="flex h-screen w-20 flex-col items-center border-r border-gray-200 bg-white">
      <div class="flex h-[4.5rem] w-full items-center justify-center border-b border-gray-200 p-2">
        <router-link to="/home" class="text-2xl font-fredoka text-indigo-600 no-underline">
          <h1>E.C</h1>
        </router-link>

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
        <div v-if="showUsers" class="user-list">
          <div v-for="user in users" :key="user.id" class="group mb-2 flex items-center relative cursor-pointer" @click="goToPrivateMessage(user.username, user.userId)">
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
        <button class="group relative rounded-xl bg-gray-100 p-2 text-gray-600 hover:text-indigo-600" @click="toggleChannelsDisplay">
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

        <div v-if="showChannels" class="user-list">
          <RouterLink
              v-for="channel in channels"
              :key="channel.id"
              class="group mb-2 flex items-center relative cursor-pointer"
              :to="{ name: 'Channel', params: { channelName: channel.name, channelId: channel.id } }"
          >
            <p class="h-10 w-10 rounded-full border flex justify-center items-center bg-gray-200 text-gray-800 font-semibold">
              {{ channel.name.charAt(0).toUpperCase() }}
            </p>
            <div class="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
              <div class="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                <div class="absolute inset-0 -left-1 flex items-center">
                  <div class="h-2 w-2 rotate-45 bg-white"></div>
                </div>
                {{ channel.name}}
              </div>
            </div>
          </RouterLink>
        </div>

        <button @click="createChannel" class="group relative rounded-xl bg-gray-100 p-2 text-gray-600 hover:text-indigo-600">
          <i class="fa-solid fa-plus"></i>
          <div class="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
            <div class="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
              <div class="absolute inset-0 -left-1 flex items-center">
                <div class="h-2 w-2 rotate-45 bg-white"></div>
              </div>
              Création de groupe
            </div>
          </div>
        </button>

        <button @click="goToCreateGroupChat" class="group relative rounded-xl bg-gray-100 p-2 text-gray-600 hover:text-indigo-600">
          <i class="fa-solid fa-comments"></i>
          <div class="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
            <div class="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
              <div class="absolute inset-0 -left-1 flex items-center">
                <div class="h-2 w-2 rotate-45 bg-white"></div>
              </div>
              Groupe géneral
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
          <img class="h-10 w-10 rounded-full" :src="currentUser.image" :alt="currentUser.name" />
        </button>
      </div>

    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import router from "@/router/index";
import SocketService from "@/socket";
import axios from "axios"; // Assurez-vous que l'URL correspond à votre serveur Socket.IO
const channels = ref([]);
const users = ref([]); // Stocke les utilisateurs connectés
const showUsers = ref(false); // Contrôle l'affichage de la liste des utilisateurs
const showChannels = ref(false);
const emit = defineEmits(['logout'])

const currentUser = ref(JSON.parse(localStorage.getItem('user'|| '{}')));
console.log('currentUser', currentUser.value)


// Écouter les mises à jour de la liste des utilisateurs connectés
onMounted(() => {
  SocketService.socket?.on('updateUserList', (updatedUsers) => {
    // S'assurer que l'on filtre en utilisant le bon champ d'identifiant pour les utilisateurs
    users.value = updatedUsers.filter(user => user.userId !== currentUser.value.id); // Assurez-vous que 'id' est le bon champ
    // console.log("Liste des utilisateurs mise à jour sans l'utilisateur courant", users.value);
  });

  fetchUserChannels();

});

// Nettoyer lors du démontage du composant
onUnmounted(() => {
  SocketService.socket?.off('updateUserList');


});

// Fonction pour basculer l'affichage des utilisateurs
function toggleUsersDisplay() {
  showUsers.value = !showUsers.value;
}

function toggleChannelsDisplay() {
  showChannels.value = !showChannels.value;
}

const onLogout = () => {
  emit('logout')
}


const goToPrivateMessage = (username,userId) => {
  router.push({ name: 'PrivateMessage', params: { username, userId } });
};


const createChannel = async () => {
  const { value: channelName } = await Swal.fire({
    title: 'Entrez le nom du nouveau canal',
    input: 'text',
    inputPlaceholder: 'Nom du canal',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return 'Vous devez entrer un nom !';
      }
    }
  });

  if (channelName) {
    try {
      const response = await axios.post('http://localhost:3001/channels/create', {
        name: channelName,
        createdBy: currentUser.value.id,
        members: [currentUser.value.id],
        imageUrl: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`
      });
      channels.value.push(response.data); // Assumer que l'API renvoie le canal créé
      await Swal.fire('Créé !', `Canal créé : ${response.data.name}`, 'success');
    } catch (error) {
      console.error('Erreur lors de la création du canal:', error);
      await Swal.fire('Erreur !', `Erreur lors de la création du canal: ${error.message}`, 'error');
    }
  }
};


// Écouter la réponse de la création du canal
SocketService.socket?.on('channelCreated', (data) => {
  channels.value.push(data);
  console.log('channels', channels.value)
  Swal.fire('Nouveau canal !', `Un nouveau canal a été créé: ${data.name}`, 'info');
});

SocketService.socket?.on('channelCreationError', (error) => {
  Swal.fire('Erreur de canal', `Erreur lors de la création d'un canal: ${error}`, 'error');});


const fetchUserChannels = async () => {
  try {
    const { data } = await axios.get(`http://localhost:3001/channels/user/${currentUser.value.id}`);
    channels.value = data;
  } catch (error) {
    console.error("Erreur lors de la récupération des canaux de l'utilisateur", error);
  }
};
const goToCreateGroupChat = () => {
  router.push({ name: 'GeneralChat' });

};
</script>


