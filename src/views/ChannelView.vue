<template>
  <div class="flex h-screen">
    <SideBar/>
    <div class="flex flex-col h-screen w-full">
      <!-- Header du Canal avec bouton d'invitation -->
      <div class="flex h-[4.5rem] items-center justify-between w-full border-b border-gray-200 p-2">
        <h1 class="text-xl font-bold">
          {{ channelName }}
        </h1>
        <div class="flex">
          <button @click="addUser"
                  class="mr-2 justify-center rounded-md bg-[#4341C0] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <i class="fa-solid fa-user-plus"></i>
          </button>
          <button @click="deleteChannel"
                  class="justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>




      <!-- Zone d'affichage des messages -->
      <div class="flex-grow overflow-auto p-4 space-y-4" ref="messageContainerRef">
        <div v-for="message in messages" :key="message.timestamp" class="flex"
             :class="{'justify-end': isMessageFromCurrentUser(message.senderId), 'justify-start': !isMessageFromCurrentUser(message.senderId)}">
          <div :class="{
                'bg-indigo-500 text-white': isMessageFromCurrentUser(message.senderId),
                'bg-gray-200 text-black': !isMessageFromCurrentUser(message.senderId)
              }" class="max-w-[60%] rounded-lg p-2">
            <div class="font-bold">{{ message.senderUsername || 'Anonyme' }}</div>
            <div class="break-words">{{ message.text }}</div>
            <div class="timestamp text-xs text-right mt-2">{{ formatDate(message.timestamp) }}</div>
          </div>
        </div>
      </div>

      <!-- Zone de saisie des messages -->
      <div class="p-4">
        <div class="flex space-x-2">
          <input v-model="newMessage" type="text" placeholder="Écrire un message..."
                 class="border-gray-600 focus:border-indigo-700 outline-none block w-full rounded-md border-2 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 pl-[14px] sm:text-sm sm:leading-6"
                 @keyup.enter="sendMessage"/>
          <button @click="sendMessage"
                  class="flex w-[150px] justify-center rounded-md bg-[#4341C0] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch, computed } from 'vue';
import {useRoute} from 'vue-router';
import SocketService from '@/socket';
import SideBar from "@/components/cards/SideBar.vue";
import axios from "axios";
import Swal from "sweetalert2";
import type {ComputedRef, Ref} from "vue";

type Message = {
  channelId: string;
  senderId: string;
  senderUsername: string;
  text: string;
  timestamp: string;
};

/* HOOKS */
const route = useRoute();


/* REFS */
const messageContainerRef: Ref<HTMLElement | null> = ref(null)
const messages: Ref<Array<Message>> = ref([]);
const newMessage = ref('');

// Récupération de l'utilisateur actuel depuis localStorage
const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'));

const channelName = computed(() => {
  return route.params.channelName?.toString() || '';
})
const channelId: ComputedRef<string> = computed(() => {
  return route.params.channelId?.toString() || '';
})


/* METHODS */
const isMessageFromCurrentUser = (senderId) => {
  return senderId === currentUser.value.id;
};

const scrollToBottom = () => {
  const _messageContainerRef = messageContainerRef.value;
  if (_messageContainerRef) {
    _messageContainerRef.scrollTop = _messageContainerRef.scrollHeight;
    messageContainerRef.value = _messageContainerRef;
  }
};

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    const message = {
      channelId: channelId.value,
      senderId: currentUser.value.id,
      senderUsername: currentUser.value.username,
      text: newMessage.value,
      timestamp: new Date().toISOString(),
    };

    // Envoyer le message au serveur pour sauvegarde dans la DB
    try {
      await axios.post('http://localhost:3001/messages-channels/send', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // Émettre le message via Socket.io pour l'envoyer en temps réel
    if (SocketService.socket) {
      console.log('sendChannelMessage', message)
      SocketService.socket.emit('sendChannelMessage', message);
    }
    newMessage.value = '';

    await nextTick(() => {
      scrollToBottom()
    });
  }
};

const onReceiveChannelMessage = () => {
  if (SocketService.socket) {
    SocketService.socket.on('receiveChannelMessage', (message) => {
      console.log('receiveChannelMessage', message)
      messages.value.push(message);
      scrollToBottom();
    });
  }
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

const addUser = async () => {
  Swal.fire({
    title: 'Ajouter un utilisateur',
    input: 'text',
    inputLabel: 'Nom de l’utilisateur',
    inputPlaceholder: 'Entrez le nom de l’utilisateur à ajouter',
    showCancelButton: true,
    confirmButtonText: 'Ajouter',
    cancelButtonText: 'Annuler',
    inputValidator: (value) => {
      if (!value) {
        return 'Vous devez écrire un nom!'
      }
    }
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      // Récupérez le token du localStorage
      const token = localStorage.getItem('token');

      try {
        // Utilisez le token dans l'en-tête d'autorisation pour la recherche de l'utilisateur
        const userSearchResponse = await axios.get(`http://localhost:3001/users/search?name=${result.value}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userIdToAdd = userSearchResponse.data[0]?._id; // Prenez le premier utilisateur trouvé


        if (userIdToAdd) {
          // Utilisez également le token dans l'en-tête d'autorisation pour ajouter l'utilisateur au canal
          await axios.put(`http://localhost:3001/channels/${channelId.value}/addMember/${userIdToAdd}`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          await Swal.fire({
            title: 'Succès',
            text: "Utilisateur ajouté au canal avec succès",
            icon: 'success',
            confirmButtonText: 'Fermer'
          });
        } else {
          await Swal.fire({
            title: 'Erreur',
            text: "Utilisateur non trouvé",
            icon: 'error',
            confirmButtonText: 'Fermer'
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur au canal:", error);
        await Swal.fire({
          title: 'Erreur',
          text: "Un problème est survenu lors de l'ajout de l'utilisateur",
          icon: 'error',
          confirmButtonText: 'Fermer'
        });
      }
    }
  });
};

const deleteChannel = async () => {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: "Vous ne pourrez pas revenir en arrière!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimez-le!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:3001/channels/${channelId.value}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await Swal.fire(
            'Supprimé!',
            'Le canal a été supprimé.',
            'success'
        );
        // Redirection ou mise à jour de l'interface ici
      } catch (error) {
        console.error("Erreur lors de la suppression du canal:", error);
        await Swal.fire({
          title: 'Erreur',
          text: "Un problème est survenu lors de la suppression du canal",
          icon: 'error',
          confirmButtonText: 'Fermer'
        });
      }
    }
  });
};



/* WATCHERS */
watch(channelId, async (newChannelId: string) => {
  console.log('Channel ID changed:', newChannelId);
  if (SocketService.socket) {
    SocketService.socket.emit('joinChannel', {channelId: newChannelId, userId: currentUser.value.id});
  }

  try {
    const response = await axios.get(`http://localhost:3001/messages-channels/${newChannelId}`);
    messages.value = response.data;
  } catch (error) {
    console.error('Error loading messages:', error);
  }

  await nextTick(() => {
    scrollToBottom()
    onReceiveChannelMessage()
  });
}, {immediate: true})
</script>