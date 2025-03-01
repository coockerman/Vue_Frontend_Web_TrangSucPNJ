<template>
  <div class="edit-user">
    <h2>Sửa thông tin tài khoản</h2>

    <div class="form-group">
      <div class="input-box">
        <label>Họ và tên</label>
        <input type="text" v-model="user.fullName" />
      </div>

      <div class="input-box">
        <label>Giới tính</label>
        <select v-model="user.sex">
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="">Trống</option>
        </select>
      </div>
    </div>

    <div class="input-box">
      <label>Email</label>
      <div class="email-container">
        <input type="email" v-model="user.email" readonly />
        <span v-if="isValidEmail(user.email)" class="check-icon">✔</span>
      </div>
    </div>

    <div class="input-box">
      <label>Số điện thoại</label>
      <input type="text" v-model="user.numberPhone" />
    </div>

    <button @click="updateUser">Lưu thay đổi</button>
  </div>
</template>
  
  <script>
import { useUserStore } from '@/stores/user'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const userStore = useUserStore()
    const user = ref({})

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5121/api/users/detail/${userStore.uid}`)
        if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu')
        user.value = await response.json()
      } catch (error) {
        console.error(error)
      }
    }

    // Validate email
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    // Update user data
    const updateUser = async () => {
      try {
        const updateData = {
          fullName: user.value.fullName,
          sex: user.value.sex,
          numberPhone: user.value.numberPhone,
        }

        const response = await fetch(
          `http://localhost:5121/api/users/update-info/${userStore.uid}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
          }
        )
        if (!response.ok) throw new Error('Lỗi khi cập nhật dữ liệu')

        alert('Cập nhật thành công!')
      } catch (error) {
        console.error(error)
        alert('Có lỗi xảy ra, vui lòng thử lại.')
      }
    }

    onMounted(fetchUserData)

    return { user, isValidEmail, updateUser }
  },
}
</script>
  
  <style scoped>
.edit-user {
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

input,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f8f8f8;
  font-size: 16px;
  outline: none;
}

input:focus,
select:focus {
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

button {
  background: #4caf50;
  color: white;
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}
</style>
  