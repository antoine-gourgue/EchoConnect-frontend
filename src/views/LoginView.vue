
<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-24 w-auto" src="/EchoConnectLogo.png" alt="EchoConnect">
      <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
    </div>
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">

        <LoginInput/>
        <LoginButton/>
        <div class="text-sm flex justify-center">
          <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginInput from '@/components/common/LoginInput.vue';
import LoginButton from "@/components/common/LoginButton.vue";

</script>