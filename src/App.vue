<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AuthenticationViewVue from './views/AuthenticationView.vue'
</script>

<template>
  <div class="full-screen">
    <AuthenticationViewVue />
  </div>
</template>

<style scoped>
.full-screen {
  width: 100vw; /* Chiếm toàn bộ chiều rộng */
  height: 100vh; /* Chiếm toàn bộ chiều cao */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff; /* Đảm bảo nền trắng */
}
</style>

