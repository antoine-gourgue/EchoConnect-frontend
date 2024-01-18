<template>
    <link href='https://fonts.googleapis.com/css?family=Fredoka+One' rel='stylesheet'>
    <div class="flex items-center justify-center">
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 sm:max-w-sm w-full">
        <h2 class="font-fredoka font-semibold grid justify-items-center text-[#4341C0] text-4xl">
          EchoConnect
        </h2>
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Créer votre compte</h2>
        <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="space-y-6" action="#" method="POST">
            <RegisterInput/>
            <button
                type="submit"
                class="flex w-full justify-center rounded-full bg-[#4341C0] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Créer un compte
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
    import RegisterInput from "@/components/common/RegisterInput.vue";

  </script>