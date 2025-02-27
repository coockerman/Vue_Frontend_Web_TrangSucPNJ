<template>
  <div class="admin-settings">
    <h2>Chỉnh sửa thông tin cửa hàng</h2>

    <form @submit.prevent="saveData">
      <label>Tên cửa hàng:</label>
      <input v-model="formData.nameShop" required />

      <label>Viết tắt:</label>
      <input v-model="formData.acronym" required />

      <label>Mã số kinh doanh:</label>
      <input v-model="formData.business" required />

      <label>Địa chỉ:</label>
      <input v-model="formData.address" required />

      <label>Điện thoại:</label>
      <input v-model="formData.numberPhone" required />

      <label>Fax:</label>
      <input v-model="formData.fax" required />

      <label>Hotline Mua hàng:</label>
      <input v-model="formData.buy" required />

      <label>Hotline Khiếu nại:</label>
      <input v-model="formData.complaint" required />

      <button type="submit">Lưu thay đổi</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      formData: {
        id: '',
        business: '',
        numberPhone: '',
        nameShop: '',
        complaint: '',
        acronym: '',
        address: '',
        fax: '',
        buy: '',
      },
    }
  },
  async created() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const res = await axios.get('http://localhost:5121/api/admin-titles/all')
        this.formData = res.data[0] // Giả sử API trả về mảng
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error)
      }
    },
    async saveData() {
      try {
        await axios.post('http://localhost:5121/api/admin-titles/create-or-update', this.formData)
        alert('Cập nhật thành công!')
      } catch (error) {
        console.error('Lỗi khi lưu dữ liệu:', error)
      }
    },
  },
}
</script>

<style scoped>
.admin-settings {
  max-width: 500px;
  margin: auto;
}
label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  margin-top: 15px;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
button:hover {
  background: #0056b3;
}
</style>
