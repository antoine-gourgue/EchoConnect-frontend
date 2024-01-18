<template>
  <div>
    <label for="email"
           class="block text-sm font-semibold leading-6 text-gray-900">Email</label>

    <div class="mt-2">
      <input id="email"
             name="email"
             type="email"
             autocomplete="email"
             required
             class= "border-gray-600 focus:border-indigo-700 outline-none block w-full rounded-md border-2 py-1.5 text-gray-900 shadow-sm
             placeholder:text-gray-400 pl-[14px] sm:text-sm sm:leading-6">
    </div>
  </div>

  <div>
    <div class="flex items-center justify-between">
      <label for="password"
             class="block text-sm font-semibold leading-6 text-gray-900">Mot de passe</label>
    </div>
    <div class="mt-2">
      <input id="password"
             name="password"
             type="password"
             autocomplete="current-password"
             required
             class= "border-gray-600 focus:border-indigo-700 outline-none block w-full rounded-md border-2 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 pl-[14px] sm:text-sm sm:leading-6">
    </div>
  </div>
</template>
<script setup lang="ts">
</script>