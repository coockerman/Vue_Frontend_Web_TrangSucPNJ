<template>
  <div class="product-manager">
    <h2>Quản lý Sản phẩm</h2>

    <!-- Form thêm/sửa sản phẩm -->
    <form @submit.prevent="saveProduct">
      <label>Tên sản phẩm:</label>
      <input v-model="formData.nameProduct" required />

      <label>Loại:</label>
      <input v-model="formData.category" required />

      <label>Mô tả:</label>
      <textarea v-model="formData.description"></textarea>

      <label>Giới tính:</label>
      <select v-model="formData.gender" required>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Trẻ em">Trẻ em</option>
      </select>

      <label>Chất liệu:</label>
      <select v-model="formData.material" required>
        <option value="Bạc">Bạc</option>
        <option value="Vàng">Vàng</option>
        <option value="Vàng trắng">Vàng trắng</option>
      </select>

      <label>Karat:</label>
      <select v-model="formData.karat" required>
        <option value="10K">10K</option>
        <option value="14K">14K</option>
        <option value="18K">18K</option>
        <option value="24K">24K</option>
      </select>

      <!-- <label>Hình ảnh:</label>
      <input type="file" @change="uploadImage" multiple />
      <div v-for="(link, index) in formData.productImg" :key="index">
        <img :src="link" v-if="link" alt="Xem trước" class="preview-img" />
        <button type="button" @click="removeImage(index)">Xóa</button>
      </div> -->

      <label>Hình ảnh:</label>
      <input type="file" @change="uploadImage" multiple />

      <!-- Input để nhập link ảnh -->
      <input v-model="imageLink" type="text" placeholder="Nhập link ảnh..." />
      <button type="button" @click="addImageLink">Thêm</button>

      <!-- Hiển thị danh sách ảnh -->
      <div v-for="(link, index) in formData.productImg" :key="index">
        <img :src="link" v-if="link" alt="Xem trước" class="preview-img" />
        <button type="button" @click="removeImage(index)">Xóa</button>
      </div>

      <h3>Kích cỡ & Giá</h3>
      <div v-for="(sizeItem, index) in formData.sizePrice" :key="index" class="size-item">
        <label>Size:</label>
        <input v-model.number="sizeItem.size" type="number" required />

        <label>Giá:</label>
        <input v-model.number="sizeItem.price" type="number" required />

        <label>Tồn kho:</label>
        <input v-model.number="sizeItem.stock" type="number" required />

        <button type="button" @click="removeSize(index)" v-if="formData.sizePrice.length > 1">
          Xóa
        </button>
      </div>

      <button type="button" @click="addSize">+ Thêm Size</button>

      <button type="submit">{{ isEditing ? 'Cập nhật' : 'Thêm sản phẩm' }}</button>
      <button v-if="isEditing" type="button" @click="cancelEdit">Hủy</button>
    </form>

    <!-- Danh sách sản phẩm -->
    <table>
      <thead>
        <tr>
          <th>Tên sản phẩm</th>
          <th>Loại</th>
          <th>Giới tính</th>
          <th>Giá</th>
          <th>Tồn kho</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.nameProduct }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.gender }}</td>
          <td>
            <div v-for="(size, index) in product.sizePrice" :key="index">
              Size {{ size.size }}: {{ size.price.toLocaleString() }} VND
            </div>
          </td>
          <td>
            <div v-for="(size, index) in product.sizePrice" :key="index">
              Size {{ size.size }}: {{ size.stock }}
            </div>
          </td>
          <td>
            <button @click="editProduct(product)">Sửa</button>
            <button @click="deleteProduct(product.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  
<script>
import axios from 'axios'
import { storage } from '@/firebaseStorage' // Đảm bảo đường dẫn đúng
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default {
  data() {
    return {
      products: [],
      formData: {
        id: '',
        nameProduct: '',
        category: '',
        description: '',
        gender: '',
        material: '',
        karat: '',
        sizePrice: [{ size: 18, stock: 0, price: 0 }],
        productImg: [''], // Mảng link ảnh
      },
      imageLink: '', // Lưu link nhập vào
      isEditing: false,
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get('http://localhost:5121/api/products/all')
        this.products = res.data
      } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error)
      }
    },

    async saveProduct() {
      console.log('Dữ liệu gửi đi:', JSON.stringify(this.formData, null, 2)) // 📌 In ra console
      try {
        await axios.post('http://localhost:5121/api/products/create-or-update', this.formData)
        console.log(this.isEditing ? '✅ Đã cập nhật sản phẩm' : '✅ Đã thêm sản phẩm') // 📌 Log trạng thái
        this.fetchProducts()
        this.resetForm()
      } catch (error) {
        console.error('Lỗi khi lưu sản phẩm:', error)
      }
    },

    async deleteProduct(id) {
      if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        try {
          await axios.delete(`http://localhost:5121/api/products/delete/${id}`)
          console.log(`❌ Đã xóa sản phẩm có ID: ${id}`) // 📌 Log xóa sản phẩm
          this.fetchProducts()
        } catch (error) {
          console.error('Lỗi khi xóa sản phẩm:', error)
        }
      }
    },
    async uploadImage(event) {
      const files = event.target.files
      for (let file of files) {
        const storageRef = ref(storage, `flutter_pnj/newImage/${file.name}`)
        await uploadBytes(storageRef, file)
        const url = await getDownloadURL(storageRef)
        this.formData.productImg.push(url)
      }
    },
    addImageLink() {
      if (this.imageLink.trim()) {
        this.formData.productImg.push(this.imageLink.trim())
        this.imageLink = '' // Xóa input sau khi thêm
      }
    },
    removeImage(index) {
      this.formData.productImg.splice(index, 1)
    },
    editProduct(product) {
      this.formData = { ...product, sizePrice: [...product.sizePrice] }
      this.isEditing = true
      console.log('📝 Đang chỉnh sửa sản phẩm:', JSON.stringify(this.formData, null, 2)) // 📌 Log khi sửa
    },

    cancelEdit() {
      this.resetForm()
      console.log('🚫 Hủy chỉnh sửa') // 📌 Log hủy
    },

    resetForm() {
      this.formData = {
        id: '',
        nameProduct: '',
        category: '',
        description: '',
        gender: '',
        material: '',
        karat: '',
        sizePrice: [{ size: 18, stock: 0, price: 0 }],
      }
      this.isEditing = false
    },

    addSize() {
      this.formData.sizePrice.push({ size: 0, stock: 0, price: 0 })
      console.log('➕ Đã thêm size mới:', this.formData.sizePrice) // 📌 Log khi thêm size
    },

    removeSize(index) {
      console.log('❌ Đã xóa size:', this.formData.sizePrice[index]) // 📌 Log khi xóa size
      this.formData.sizePrice.splice(index, 1)
    },
    addImage() {
      this.formData.productImg.push('')
      console.log('➕ Đã thêm link ảnh:', this.formData.productImg)
    },

    removeImage(index) {
      console.log('❌ Đã xóa link ảnh:', this.formData.productImg[index])
      this.formData.productImg.splice(index, 1)
    },
  },

  mounted() {
    this.fetchProducts()
  },
}
</script>


  
  <style scoped>
.product-manager {
  max-width: 1500px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

/* Form nhập liệu */
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

textarea {
  resize: vertical;
}

.size-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

button[type='submit'] {
  background: #52b752;
  color: white;
  font-weight: bold;
}

button[type='submit']:hover {
  background: #4de24d;
}

button[type='button'] {
  background: #638575;
  color: white;
}

button[type='button']:hover {
  background: #3d5248;
}

button[type='button'].delete {
  background: #dc3545;
}

button[type='button'].delete:hover {
  background: #c82333;
}

/* Bảng danh sách sản phẩm */
table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 8px 2px;
  border: 1px solid #ddd;
  text-align: center;
}

th {
  background: #a78b5f;
  color: white;
}

tbody tr:nth-child(even) {
  background: #f2f2f2;
}

tbody tr:hover {
  background: #e9ecef;
}

.image-link-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.short-input {
  width: 200px;
}

.preview-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ddd;
}
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  appearance: none; /* Ẩn kiểu mặc định trên trình duyệt */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' fill='%23333'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

select:hover {
  border-color: #888;
}

select:focus {
  border-color: #52b752;
  outline: none;
  box-shadow: 0 0 5px rgba(82, 183, 82, 0.5);
}
</style>
  