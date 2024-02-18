<template>
  <div class="flex">
    <SideBar
        :openCreateChannelModal="openCreateChannelModal"
        :users="users"
        @logout="onLogout"
        @update:openCreateChannelModal="openCreateChannelModal = $event"
    />
    <div class="flex flex-col w-full">
      <div>
        <div class="flex items-center justify-between p-4 bg-gray-100 h-[4.5rem]">
          <h2 class="text-2xl font-semibold">Bienvenue, {{ currentUser.username }}</h2>
          <p class="text-gray-600">Vous êtes connecté en tant que {{ currentUser.username }}</p>
        </div>
      </div>
      <div class="grid justify-start items-center px-12 my-12 max-w-6xl">
        <!--   SITE WEB TITLE   -->
        <div class="flex flex-col lg:flex-row items-center gap-8">
          <div class="grid justify-start items-center flex-1">
            <h1 class="text-4xl mb-3 font-bold text-left text-gray-800">
              Bienvenue sur Echo Connect
            </h1>

            <h2 class="text-lg font-medium text-left text-gray-700">
              Votre Nouveau Hub de Communication en Temps Réel
            </h2>
          </div>

          <button
              @click="openCreateChannelModal = true"
              class="relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4341C0] hover:bg-indigo-700 focus:outline-none">
            Créer mon premier salon
          </button>
        </div>

        <hr class="my-6">


        <!--  WEBSITE DESCRIPTION  -->
        <p class="text-left text-gray-800">
          Echo Connect révolutionne la manière dont nous communiquons en ligne, en offrant une plateforme de chat dynamique et innovante. Conçue pour les esprits créatifs, les équipes de travail collaboratif, et les communautés vibrantes, notre application web est le lieu idéal pour rester connecté, partager des idées, et collaborer sans effort.
        </p>

        <hr class="my-6">

        <h3 class="text-2xl font-semibold text-left text-gray-800 mb-2">
          Fonctionnalités Principales
        </h3>

        <ul class="text-left text-gray-800 list-disc">
          <li class="my-3">
            <span class="font-semibold">Chat en Temps Réel:</span> Discutez avec vos amis, collègues, et membres de la communauté en temps réel.
          </li>
          <li class="my-3">
            <span class="font-semibold">Partage de Fichiers:</span> Envoyez et recevez des fichiers en toute simplicité.
          </li>
          <li class="my-3">
            <span class="font-semibold">Salons de Discussion:</span> Créez des salons de discussion pour des conversations thématiques.
          </li>
          <li class="my-3">
            <span class="font-semibold">Notifications en Temps Réel:</span> Recevez des notifications en temps réel pour rester informé.
          </li>
          <li class="my-3">
            <span class="font-semibold">Personnalisation:</span> Personnalisez votre profil et vos paramètres pour une expérience unique.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import { io } from 'socket.io-client';
import SideBar from "@/components/cards/SideBar.vue";
import router from "@/router/index";
import SocketService from "@/socket";

const users = ref([]);
const openCreateChannelModal = ref(false);

const socket = io('http://localhost:3001');

const currentUser = computed(() => {
  return JSON.parse(localStorage.getItem('user'));
});

onMounted(() => {
  SocketService.socket.on('updateUserList', (updatedUsers) => {
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
    SocketService.socket.emit('logout', userConnected.id);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push({ name: 'login' });
  }
};
</script>
