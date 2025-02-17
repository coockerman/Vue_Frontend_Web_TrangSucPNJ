<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AuthenticationViewVue from './views/AuthenticationView.vue'
</script>

<template>
  <div class="full-screen">
    <router-view />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prata&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
.full-screen {
  width: 100vw; /* Chiếm toàn bộ chiều rộng */
  justify-content: center;
  align-items: center;
  background-color: #ffffff; /* Đảm bảo nền trắng */
}
</style>

