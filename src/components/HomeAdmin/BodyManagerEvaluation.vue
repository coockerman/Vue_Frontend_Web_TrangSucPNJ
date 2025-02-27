<template>
  <div class="admin-form">
    <h2>Quản lý Thông Tin Admin</h2>
    <form @submit.prevent="updateAdminInfo">
      <div v-for="(value, key) in adminData" :key="key" class="form-group">
        <label :for="key">{{ key }}</label>
        <input v-model="adminData[key]" :id="key" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Lưu Thay Đổi</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const adminData = ref({})

// Lấy thông tin admin từ API
const fetchAdminInfo = async () => {
  try {
    const response = await axios.get('/api/admin-titles/all')
    adminData.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error)
  }
}

// Gửi dữ liệu cập nhật lên API
const updateAdminInfo = async () => {
  try {
    await axios.post('/api/admin-titles/create-or-update', adminData.value)
    alert('Cập nhật thành công!')
  } catch (error) {
    console.error('Lỗi khi cập nhật:', error)
  }
}

onMounted(fetchAdminInfo)
</script>

<style scoped>
.admin-form {
  max-width: 500px;
  margin: auto;
}
.form-group {
  margin-bottom: 10px;
}
label {
  display: block;
  font-weight: bold;
}
.form-control {
  width: 100%;
  padding: 5px;
  font-size: 14px;
}
.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}
</style>
