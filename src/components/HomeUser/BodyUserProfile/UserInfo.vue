<template>
  <div class="user-info">
    <h2>Thông tin tài khoản</h2>

    <div class="form-group">
      <div class="input-box">
        <label>Họ và tên</label>
        <input type="text" :value="user.fullName" readonly />
      </div>

      <div class="input-box">
        <label>Giới tính</label>
        <input type="text" :value="user.sex" readonly />
      </div>
    </div>

    <div class="input-box">
      <label>Email</label>
      <div class="email-container">
        <input type="text" :value="user.email" readonly />
        <span v-if="isValidEmail(user.email)" class="check-icon">✔</span>
      </div>
    </div>

    <div class="input-box">
      <label>Số điện thoại</label>
      <input type="text" :value="user.numberPhone" readonly />
    </div>
  </div>
</template>
  
  <script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const user = ref({})

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5121/api/users/detail/${localStorage.getItem('uid')}`
        )
        if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu')
        user.value = await response.json()
      } catch (error) {
        console.error(error)
      }
    }

    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    onMounted(fetchUserData)

    return { user, isValidEmail }
  },
}
</script>
  
  <style scoped>
.user-info {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.input-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 100%;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f8f8f8;
  font-size: 16px;
  outline: none;
}

input:focus {
  border-color: black;
}

.email-container {
  display: flex;
  align-items: center;
}

.check-icon {
  color: green;
  font-size: 20px;
  margin-left: 10px;
}

.avatar {
  text-align: center;
}

.avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #ccc;
}

.avatar p {
  font-weight: bold;
  margin-top: 5px;
}
</style>
  