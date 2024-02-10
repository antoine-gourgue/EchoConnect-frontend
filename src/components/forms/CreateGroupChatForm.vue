<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-semibold leading-6 text-gray-900">Nom du groupe</label>
      <div class="mt-1">
        <input v-model="name" id="name" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
    </div>
    <div>
      <label for="description" class="block text-sm font-semibold leading-6 text-gray-900">Description</label>
      <div class="mt-1">
        <textarea v-model="description" id="description" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
    </div>
    <div>
      <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4341C0] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Créer un groupe
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const name = ref<string>('');
const description = ref<string>('');
const router = useRouter();

const handleSubmit = async (): Promise<void> => {
  try {
    const response = await axios.post('http://localhost:3001/groups', {
      name: name.value,
      description: description.value,
    });
    router.push({ name: 'home' });
  } catch (error) {
    alert("Échec de la création du groupe: " + (error.response?.data?.message || "Erreur inconnue"));
  }
};
</script>