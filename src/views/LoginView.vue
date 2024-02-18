<template>
  <link href='https://fonts.googleapis.com/css?family=Fredoka+One' rel='stylesheet'>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="font-fredoka font-semibold grid justify-items-center text-[#4341C0] text-4xl">
        EchoConnect
      </h2>
      <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Connectez-vous à votre compte
      </h2>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">Email</label>
          <div class="mt-1">
            <input v-model="email" id="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm font-semibold leading-6 text-gray-900">Mot de passe</label>
          <div class="mt-1">
            <input v-model="password" id="password" type="password" autocomplete="current-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4341C0] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Se connecter
          </button>
        </div>
      </form>
      <p class="mt-2 text-center text-sm text-gray-600">
        Vous n'avez pas de compte?
        <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
          Créer un compte
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref<string>('');
const password = ref<string>('');
const router = useRouter();

const handleSubmit = async (): Promise<void> => {
  try {
    const response = await axios.post('http://localhost:3001/login', {
      email: email.value,
      password: password.value,
    });
    // Supposons que votre API renvoie un token JWT en cas de succès
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    // Rediriger l'utilisateur vers la page d'accueil ou une autre page protégée
    router.push({ name: 'home' }); // Assurez-vous que le nom de la route 'home' est défini dans votre router
  } catch (error) {
    alert("Échec de la connexion: " + (error.response?.data?.message || "Erreur inconnue"));
  }
};
</script>

<style scoped>
.font-fredoka {
  font-family: 'Fredoka One', sans-serif;
}
</style>
