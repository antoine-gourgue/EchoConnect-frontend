<template>
  <div class="flex">
    <SideBar :users="users" @selectUser="selectUser" :groups="groups" @selectGroup="selectGroup" />

    <div class="flex flex-col flex-1">
      <div class="flex-grow" v-if="selectedUser || selectedGroup">
        <ChatCard :selectedUser="selectedUser" :selectedGroup="selectedGroup"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SideBar from "@/components/cards/SideBar.vue";
import ChatCard from "@/components/cards/ChatCard.vue";

const users = [
  { id: 1, name: 'User 1', image: 'https://avatars.githubusercontent.com/u/35387401?v=4' },
  { id: 2, name: 'User 2', image: 'https://avatars.githubusercontent.com/u/35387401?v=4' }
];
const groups = [
  { id: 1, name: 'Group 1', image: 'https://avatars.githubusercontent.com/u/35387401?v=4' },
  { id: 2, name: 'Group 2', image: 'https://avatars.githubusercontent.com/u/35387401?v=4' }
];

const selectedUser = ref(null);

const selectedGroup = ref(null);
function selectUser(user) {
  selectedUser.value = user;
}
function selectGroup(group) {
  selectedGroup.value = group;
}
</script>
