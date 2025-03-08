<template>
  <div class="container">
    <h2>Quản lý Quảng Cáo</h2>

    <!-- Form nhập quảng cáo -->
    <div class="form">
      <label>ID:</label>
      <input v-model="advertisement.id" placeholder="Nhập ID" class="input" />

      <label>Tên quảng cáo:</label>
      <input v-model="advertisement.name" placeholder="Nhập tên" class="input" />

      <label>URL hình ảnh:</label>
      <input
        v-model="advertisement.urlImage"
        placeholder="Nhập URL hình ảnh"
        class="input"
        @input="previewImage"
      />

      <div v-if="advertisement.urlImage">
        <p>Xem trước ảnh:</p>
        <img :src="advertisement.urlImage" class="preview-img" />
      </div>

      <button @click="saveAdvertisement" class="btn">Lưu quảng cáo</button>
    </div>

    <h3>Danh sách Quảng Cáo</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Hình ảnh</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in advertisements" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td><img :src="item.urlImage" class="list-img" /></td>
          <td>
            <button @click="editAdvertisement(item)" class="btn edit">Sửa</button>
            <button @click="deleteAdvertisement(item.id)" class="btn delete">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  <script>
import axios from 'axios'

export default {
  data() {
    return {
      advertisements: [],
      advertisement: {
        id: '',
        name: '',
        urlImage: '',
      },
    }
  },
  methods: {
    // Tải danh sách quảng cáo
    async fetchAdvertisements() {
      try {
        const res = await axios.get('http://localhost:5121/api/advertisements/all')
        this.advertisements = res.data
      } catch (error) {
        console.error('Lỗi khi tải quảng cáo', error)
      }
    },

    // Lưu quảng cáo (thêm hoặc cập nhật)
    async saveAdvertisement() {
      try {
        await axios.post(
          'http://localhost:5121/api/advertisements/create-or-update',
          this.advertisement
        )
        this.fetchAdvertisements() // Cập nhật danh sách
        this.resetForm()
      } catch (error) {
        console.error('Lỗi khi lưu quảng cáo', error)
      }
    },

    // Xóa quảng cáo
    async deleteAdvertisement(id) {
      if (confirm('Bạn có chắc muốn xóa quảng cáo này?')) {
        try {
          await axios.delete(`http://localhost:5121/api/advertisements/delete/${id}`)
          this.fetchAdvertisements()
        } catch (error) {
          console.error('Lỗi khi xóa quảng cáo', error)
        }
      }
    },

    // Chỉnh sửa quảng cáo
    editAdvertisement(item) {
      this.advertisement = { ...item }
    },

    // Xem trước hình ảnh khi nhập URL
    previewImage() {
      // Không cần làm gì, vì Vue sẽ tự động cập nhật ảnh thông qua v-model
    },

    // Reset form
    resetForm() {
      this.advertisement = { id: '', name: '', urlImage: '' }
    },
  },
  mounted() {
    this.fetchAdvertisements()
  },
}
</script>
  
  <style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
h2,
h3 {
  text-align: center;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.btn {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}
.btn.edit {
  background-color: #ffc107;
}
.btn.delete {
  background-color: #dc3545;
  color: white;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th,
td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}
.preview-img {
  max-width: 200px;
  display: block;
  margin-top: 10px;
}
.list-img {
  max-width: 80px;
}
</style>
  