<template>
  <div class="flex h-screen bg-gray-100" v-if="currentUser">
    <SideBar
      :users="users"
      @logout="onLogout"
    />
    <div class="flex flex-1 flex-col overflow-hidden">
      <div class="p-4 overflow-y-auto">
        <div class="mb-8">
          <h2 class="text-2xl font-bold">Profile of {{ currentUsername }}</h2>
          <div class="mt-4 flex space-x-2">
            <button @click="editMode = !editMode" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Edit Profile
            </button>
            <button @click="deleteProfile" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Delete Profile
            </button>
          </div>
        </div>
        <div v-if="editMode" class="mb-8">
          <div class="grid gap-4">
            <input v-model="editData.email" placeholder="Email" class="input" />
            <button @click="updateEmail(currentUser.id)"  class="btn">Update Email</button>
            <div class="mt-4">
              <h3 class="text-lg ">Change Password</h3>
              <input v-model="passwordData.oldPassword" type="password" placeholder="Old Password" class="input mt-2" />
              <input v-model="passwordData.newPassword" type="password" placeholder="New Password" class="input mt-2" />
              <input v-model="passwordData.confirmNewPassword" type="password" placeholder="Confirm New Password" class="input mt-2" />
              <button @click="updatePassword(currentUser.id)" class="btn mt-2">Change Password</button>

            </div>
          </div>
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
    alert("Email mis à jour avec succès.");
  } catch (error) {
    console.error('Échec de la mise à jour de l/email:', error);
    alert("Échec de la mise à jour de l'email.");
  }
};

const updatePassword = async (userId) => {
  if (passwordData.value.newPassword !== passwordData.value.confirmNewPassword) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }
  try {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:3001/users/${userId}/password`, { password: passwordData.value.newPassword }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    alert("Mot de passe mis à jour avec succès.");
  } catch (error) {
    console.error('Échec de la mise à jour du mot de passe:', error);
    alert("Échec de la mise à jour du mot de passe.");
  }
};

const deleteProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:3001/users/${currentUser.value.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    alert("Profil supprimé avec succès.");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push({ name: 'login' });
  } catch (error) {
    console.error('Échec de la suppression du profil:', error);
    alert("Échec de la suppression du profil.");
  }
};

onMounted(() => {
  axios.get('http://localhost:3001/users', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => {
    users.value = response.data;
  }).catch(error => {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
  });
});

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
  background-color: #4CAF50;
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
