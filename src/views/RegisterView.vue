<template>
  <link href='https://fonts.googleapis.com/css?family=Fredoka+One' rel='stylesheet'>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="font-fredoka font-semibold grid justify-items-center text-[#4341C0] text-4xl">
        EchoConnect
      </h2>
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Créer votre compte</h2>
      <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
            class="space-y-6"
            @submit.prevent="handleSubmit"
        >
          <div>
            <label for="username" class="block text-sm font-semibold leading-6 text-gray-900">
              Nom d'utilisateur
            </label>
            <div class="mt-1">
              <input v-model="values.username"
                     id="username"
                     type="text"
                     autocomplete="username"
                     required
                     class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">Email</label>
            <div class="mt-1">
              <input v-model="values.email" id="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-semibold leading-6 text-gray-900">Mot de passe</label>
            <div class="mt-1">
              <input v-model="values.password" id="password" type="password" autocomplete="current-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4341C0] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Créer mon compte
          </button>

        </form>
        <p class="mt-4 text-center text-sm text-gray-500">
          Vous avez déjà un compte?
          <router-link :to="{name: 'login'}" class="font-semibold leading-6 text-[#4341C0] hover:text-indigo-500">
            Se connecter
          </router-link>
        </p>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ref} from "vue";
import axios from "axios";
import router from "@/router";

/* REFS */
const values = ref({
  username: '',
  email: '',
  password: '',
});

/* METHODS */
const handleSubmit = async () => {
  try {
    await axios.post('http://localhost:3001/users/create', values.value);
    try {
      const loginResponse = await axios.post('http://localhost:3001/login', {
        email: values.value.email,
        password: values.value.password
      });
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      await router.push({ name: 'home' });
    } catch (e) {
      console.error("Échec de la connexion: " + (e.response?.data?.message || "Erreur inconnue"));
      await router.push({ name: 'login' });
    }
  } catch (error) {
    alert("Échec de la connexion: " + (error.response?.data?.message || "Erreur inconnue"));
  }
}
</script>