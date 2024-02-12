<template>
  <div class="flex h-screen bg-gray-100">
    <SideBar/>
    <div class="flex flex-1 flex-col overflow-hidden">
      <div class="p-4 overflow-y-auto">
        <div class="mb-8">
          <h2 class="text-2xl font-bold">Profile of {{ userProfile.name }}</h2>
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
            <input v-model="editData.name" placeholder="Name" class="input" />
            <input v-model="editData.email" placeholder="Email" class="input" />
            <div class="mt-4">
              <h3 class="text-lg font-semibold">Change Password</h3>
              <input v-model="passwordData.oldPassword" type="password" placeholder="Old Password" class="input mt-2" />
              <input v-model="passwordData.newPassword" type="password" placeholder="New Password" class="input mt-2" />
              <input v-model="passwordData.confirmNewPassword" type="password" placeholder="Confirm New Password" class="input mt-2" />
              <button @click="updatePassword" class="btn mt-2">Change Password</button>
            </div>
            <button @click="updateProfile" class="btn">Save Changes</button>
          </div>
        </div>
        <div class="mt-10">
          <h3 class="text-lg font-semibold">Your Messages</h3>
          <div class="messages-box">
            <div v-for="message in userMessages" :key="message.id" class="message">
              <p>{{ message.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import router from '@/router';
import SideBar from '@/components/cards/SideBar.vue';

const userProfile = ref({});
const editMode = ref(false);
const userMessages = ref([]);
const editData = reactive({
  name: '',
  email: '',
});
const passwordData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

const userId = 'userIdFromLocalStorageOrRoute';

onMounted(async () => {
  await fetchUserProfile();
  await fetchUserMessages();
});

async function fetchUserProfile() {
  try {
    const response = await axios.get(`http://localhost:3001/users/${userId}`);
    userProfile.value = response.data;
    Object.assign(editData, response.data);
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  }
}

async function fetchUserMessages() {
  try {
    const response = await axios.get(`http://localhost:3001/messages/from/${userId}`);
    userMessages.value = response.data;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
}

async function updateProfile() {
  try {
    await axios.put(`http://localhost:3001/users/${userId}`, editData);
    editMode.value = false;
    alert("Profile successfully updated.");
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert("Failed to update profile.");
  }
}

async function updatePassword() {
  if (passwordData.newPassword !== passwordData.confirmNewPassword) {
    alert("New passwords do not match.");
    return;
  }
  try {
    await axios.put(`http://localhost:3001/users/${userId}/password`, {
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    });
    alert("Password successfully updated.");
    passwordData.oldPassword = '';
    passwordData.newPassword = '';
    passwordData.confirmNewPassword = '';
  } catch (error) {
    console.error('Failed to update password:', error);
    alert("Failed to update password.");
  }
}

async function deleteProfile() {
  if (confirm("Are you sure you want to delete your profile? This cannot be undone.")) {
    try {
      await axios.delete(`http://localhost:3001/users/${userId}`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push({ name: 'login' });
    } catch (error) {
      console.error('Failed to delete profile:', error);
    }
  }
}
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
