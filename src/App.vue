<script setup>
import { useRouter } from 'vue-router'
import { auth } from '@/firebaseAuth'

const router = useRouter()
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
  width: 100vw;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
</style>
