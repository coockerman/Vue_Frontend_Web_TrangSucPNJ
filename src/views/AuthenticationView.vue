<template>
  <div class="auth-container">
    <router-link :to="'/user-home'" class="logo-section">
      <h2>Trang chủ</h2>
      <div>
        <img src="@/assets/Img/Logo.png" alt="PNJ Logo" class="logo" />
      </div>
    </router-link>

    <LoginForm v-if="isLogin" @toggle-form="toggleForm" />
    <RegisterForm v-else @toggle-form="toggleForm" />
  </div>
</template>

<script>
import LoginForm from '@/components/Authentication/LoginForm.vue'
import RegisterForm from '@/components/Authentication/RegisterForm.vue'
import { ref } from 'vue'

export default {
  components: { LoginForm, RegisterForm },
  setup() {
    const isLogin = ref(true)

    const toggleForm = () => {
      isLogin.value = !isLogin.value
    }

    return { isLogin, toggleForm }
  },
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Đảm bảo toàn màn hình */
  width: 100vw;
  background-color: #ffffff;
  padding: 0 15vw;
}

.logo-section {
  flex: 1;
  justify-content: center;
  align-items: center;
}

.logo-section:hover {
  background-color: #efefef;
}

.logo {
  max-width: 400px;
  width: 100%;
  height: auto;
}

.form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
