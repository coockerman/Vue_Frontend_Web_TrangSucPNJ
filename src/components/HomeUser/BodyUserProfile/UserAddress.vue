<template>
  <div class="address-container">
    <h2>Quản lý địa chỉ nhận hàng</h2>

    <!-- Form thêm địa chỉ -->
    <div class="form">
      <input v-model="newAddress.city" placeholder="Thành phố" />
      <input v-model="newAddress.country" placeholder="Quốc gia" />
      <input v-model="newAddress.street" placeholder="Đường" />
      <button @click="addAddress">Thêm Địa Chỉ</button>
    </div>

    <hr />

    <!-- Danh sách địa chỉ -->
    <table v-if="addresses.length">
      <thead>
        <tr>
          <th>Đường</th>
          <th>Thành phố</th>
          <th>Quốc gia</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="address in addresses" :key="address.id">
          <td>
            <span class="tooltip">{{ address.street }}</span>
          </td>
          <td>
            <span class="tooltip">{{ address.city }}</span>
          </td>
          <td>
            <span class="tooltip">{{ address.country }}</span>
          </td>
          <td>
            <button @click="startEditing(address)">✏️</button>
            <button @click="deleteAddress(address.id)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Chưa có địa chỉ nào.</p>

    <!-- Form chỉnh sửa địa chỉ -->
    <div v-if="editingAddress" class="edit-form">
      <h3>Chỉnh sửa địa chỉ</h3>
      <input v-model="editingAddress.city" placeholder="Thành phố" />
      <input v-model="editingAddress.country" placeholder="Quốc gia" />
      <input v-model="editingAddress.street" placeholder="Đường" />
      <button @click="updateAddress">Lưu</button>
      <button @click="editingAddress = null">Hủy</button>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userId = userStore.uid // Lấy UID từ store
const addresses = ref([])
const newAddress = ref({ city: '', country: '', street: '' })
const editingAddress = ref(null) // Địa chỉ đang chỉnh sửa

// ✅ Lấy danh sách địa chỉ
const fetchAddresses = async () => {
  try {
    const res = await axios.get(`http://localhost:5121/api/users/${userId}/addAddress`)
    addresses.value = res.data
  } catch (error) {
    console.error('Lỗi khi lấy địa chỉ:', error)
    addresses.value = []
  }
}

// ✅ Thêm địa chỉ mới (ID tự sinh)
const addAddress = async () => {
  try {
    const res = await axios.post(
      `http://localhost:5121/api/users/${userId}/addAddress`,
      newAddress.value
    )
    addresses.value.push({ ...newAddress.value, id: res.data.addressId })
    newAddress.value = { city: '', country: '', street: '' }
  } catch (error) {
    console.error('Lỗi khi thêm địa chỉ:', error)
  }
}

// ✅ Xóa địa chỉ
const deleteAddress = async (addressId) => {
  if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return

  try {
    const apiUrl = `http://localhost:5121/api/users/${userId}/addAddress/${addressId}`
    console.log('Gọi API DELETE:', apiUrl) // In ra URL API trước khi gọi

    await axios.delete(apiUrl)
    addresses.value = addresses.value.filter((a) => a.id !== addressId)

    console.log('Xóa thành công:', addressId) // Log sau khi xóa
  } catch (error) {
    console.error('Lỗi khi xóa địa chỉ:', error)
  }
}

// ✅ Chỉnh sửa địa chỉ
const startEditing = (address) => {
  editingAddress.value = { ...address }
}

const updateAddress = async () => {
  try {
    await axios.put(
      `http://localhost:5121/api/users/${userId}/addAddress/${editingAddress.value.id}`,
      editingAddress.value
    )
    const index = addresses.value.findIndex((a) => a.id === editingAddress.value.id)
    addresses.value[index] = { ...editingAddress.value }
    editingAddress.value = null
  } catch (error) {
    console.error('Lỗi khi cập nhật địa chỉ:', error)
  }
}

onMounted(fetchAddresses)
</script>



<style scoped>
.address-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2,
h3 {
  color: #333;
}

.form,
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  opacity: 0.8;
}

button:nth-child(1) {
  background: #28a745;
  color: white;
}

button:nth-child(2) {
  background: #007bff;
  color: white;
}

button:nth-child(3) {
  background: #dc3545;
  color: white;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ddd;
}
table {
  width: 100%;
  table-layout: fixed; /* Giữ kích thước cột cố định */
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap; /* Không xuống dòng */
  overflow: hidden;
  text-overflow: ellipsis; /* Cắt bớt nội dung dài */
  max-width: 150px; /* Giới hạn độ rộng của cột */
}

td span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

th {
  background: #f4f4f4;
  font-weight: bold;
}

tr:hover {
  background: #f9f9f9;
}

td button {
  border: none;
  padding: 5px 8px;
  margin: 0 3px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

td button:first-child {
  background: #1f9ac3;
  color: white;
}

td button:last-child {
  background: #f75465;
  color: white;
}

td button:hover {
  opacity: 0.8;
}

.tooltip {
  display: block;
  max-width: 200px; /* Giới hạn độ rộng */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}

.tooltip:hover::after {
  content: attr(title); /* Lấy nội dung từ chính thẻ */
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
  bottom: 120%;
  z-index: 10;
  visibility: visible;
  opacity: 1;
}

.tooltip:hover {
  overflow: visible;
  white-space: normal;
}

.tooltip::after {
  content: '';
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s;
}
</style>
