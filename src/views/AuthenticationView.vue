<template>
  <div class="auth-container">
    <div class="logo-section">
      <img src="@/assets/Img/Logo.png" alt="PNJ Logo" class="logo" />
    </div>
    <div class="form-section">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Đảm bảo toàn màn hình */
  width: 100vw;
  background-color: #ffffff;
  padding: 0 10vw;
}

.logo-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
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
