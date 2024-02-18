<template>
  <div class="flex h-screen bg-gray-100" v-if="currentUser">
    <SideBar
      :users="users"
      @logout="onLogout"
    />
    <div class="flex flex-1 flex-col overflow-hidden">
      <div class="p-4 overflow-y-auto">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-indigo-600">Que veux-tu changer, mon ami {{ currentUsername }} ?</h2>
          <div class="mt-4 flex space-x-2">
            <img
              v-if="currentUser.imageUrl"
              class="h-10 w-10 rounded-full border-2 border-indigo-600"
              :src="currentUser.imageUrl"
              :alt="currentUser.imageUrl"
            />
            <div class="flex space-x-4">
              <button @click="editMode = !editMode" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                Met à jour ton profil
              </button>
              <button @click="deleteProfile" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
               Ou sinon Supprime le ici :)
              </button>
            </div>
          </div>
        </div>
        <div v-if="editMode" class="mb-8">
          <div class="grid gap-4">
            <input v-model="editData.email" placeholder="Exemple : chachal@chacaux.hot" class="input" />
            <button @click="updateEmail(currentUser.id)" class="btn bg-indigo-600" :disabled="!isValidEmail(editData.email)">Valide ton nouvel e-mail</button>
            <div class="mt-4">
              <h3 class="text-lg ">Change ton mot de passe</h3>
              <input v-model="passwordData.oldPassword" type="password" placeholder="Ancien mot de passe"  class="input mt-2" />
              <input v-model="passwordData.newPassword" type="password" placeholder="Nouveau mot de passe" class="input mt-2" />
              <input v-model="passwordData.confirmNewPassword" type="password" placeholder="Confirme ton nouveau mot de passe chacal" class="input mt-2" />
              <button @click="updatePassword(currentUser.id)" class="btn mt-2 bg-indigo-600">Valide ton nouveau mot de passe</button>
            </div>
          </div>
        </div>
        <div v-for="message in userMessages" :key="message.id">
          <p>{{ message.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import SideBar from "@/components/cards/SideBar.vue";
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client'
import Swal from "sweetalert2";
const User = ref(JSON.parse(localStorage.getItem('user')));

const router = useRouter();
const users = ref([]);
const editMode = ref(false);
const editData = ref({ email: '' });
const passwordData = ref({ oldPassword: '', newPassword: '', confirmNewPassword: '' });

const currentUser = computed(() => {
  return JSON.parse(localStorage.getItem('user'));
});
const currentUsername = computed(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.username : null;
});
const updateEmail = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:3001/users/${userId}/email`, { email: editData.value.email }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    await Swal.fire("Succès", "Email mis à jour avec succès.", "success");
  } catch (error) {
    console.error("Échec de la mise à jour de l'email:", error);
    await Swal.fire("Erreur", "Échec de la mise à jour de l'email.", "error");
  }
};

const updatePassword = async (userId) => {
  if (passwordData.value.newPassword !== passwordData.value.confirmNewPassword) {
    await Swal.fire("Erreur", "Les mots de passe ne correspondent pas.", "error");
    return;
  }
  try {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:3001/users/${userId}/password`, { password: passwordData.value.newPassword }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    await Swal.fire("Succès", "Mot de passe mis à jour avec succès.", "success");
  } catch (error) {
    console.error('Échec de la mise à jour du mot de passe:', error);
    await Swal.fire("Erreur", "Échec de la mise à jour du mot de passe.", "error");
  }
};

const deleteProfile = async () => {
  Swal.fire({
    title: "Êtes-vous sûr?",
    text: "Mais non ! Es-tu sûr de vouloir nous quitter ??",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Oui, supprime-le!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3001/users/${currentUser.value.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        await Swal.fire("Supprimé!", "Profil supprimé avec succès.", "success");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        await router.push({name: 'login'});
      } catch (error) {
        console.error('Échec de la suppression du profil:', error);
        await Swal.fire("Erreur", "Échec de la suppression du profil.", "error");
      }
    }
  });
};

const socket = io('http://localhost:3001');
const onLogout = () => {
  const userConnected = JSON.parse(localStorage.getItem('user'));

  if(userConnected){
    socket.emit('logout', userConnected.id);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push({ name: 'login' });
  }
};
const fetchUserMessages = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3001/messages/user/${currentUser.value.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    userMessages.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages de l\'utilisateur:', error);
  }
};
const isValidEmail = (email) => {
  return email && email.includes('@');
};
</script>

<style scoped>
.input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  width: 100%;
}

.btn {
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.messages-box {
  max-height: 300px;
  overflow-y: auto;
}

.message {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #f9f9f9;
  border-radius: 0.25rem;
}
</style>
