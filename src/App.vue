<script setup>
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'

const router = useRouter()

// Kiểm tra trạng thái đăng nhập ngay khi ứng dụng khởi chạy
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Nếu chưa đăng nhập, chuyển về trang login
    router.push('/authentication')
  } else {
    console.log('User is logged in:', user.email)
    // Bạn có thể kiểm tra vai trò người dùng ở đây nếu cần
  }
})
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
