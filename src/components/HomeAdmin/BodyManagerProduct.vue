<template>
  <div class="product-manager">
    <h2>Quản lý Sản phẩm</h2>

    <!-- Form thêm/sửa sản phẩm -->
    <form @submit.prevent="saveProduct">
      <label>Tên sản phẩm:</label>
      <input v-model="formData.nameProduct" required />

      <label>Loại:</label>
      <select v-model="formData.type" required>
        <option value="Bông tai">Bông tai</option>
        <option value="Vòng lắc">Vòng lắc</option>
        <option value="Nhẫn">Nhẫn</option>
        <option value="Dây chuyền">Dây chuyền</option>
        <option value="Kiềng">Kiềng</option>
        <option value="Nhẫn cầu hôn">Nhẫn cầu hôn</option>
        <option value="Nhẫn cặp">Nhẫn cặp</option>
        <option value="Nhẫn cưới">Nhẫn cưới</option>
      </select>

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
        <option value=" ">null</option>
        <option value="10K">10K</option>
        <option value="14K">14K</option>
        <option value="18K">18K</option>
        <option value="24K">24K</option>
      </select>

      <label>Hiển thị:</label>
      <select v-model="formData.show" required>
        <option value="true">Hiển thị</option>
        <option value="false">Ẩn</option>
      </select>

      <label>Hình ảnh:</label>
      <input type="file" @change="uploadImage" multiple />

      <!-- Input để nhập link ảnh -->
      <input
        v-model="imageLink"
        type="text"
        placeholder="Nhập link ảnh..."
        @keyup.enter.prevent="addImageLink"
      />
      <button type="button" @click="addImageLink">Thêm ảnh từ url</button>

      <!-- Hiển thị danh sách ảnh -->
      <div v-for="(link, index) in formData.productImg" :key="index">
        <img :src="link" v-if="link" alt="Xem trước" class="preview-img" />
        <button type="button" @click="removeImage(index)">Xóa</button>
      </div>

      <h3>Kích cỡ & Giá</h3>
      <div v-for="(sizeItem, index) in formData.sizePrice" :key="index" class="size-item">
        <label>Size:</label>
        <input v-model.number="sizeItem.size" type="number" min="0" required />

        <label>Giá:</label>
        <input v-model.number="sizeItem.price" min="0" type="number" required />

        <label>Tồn kho:</label>
        <input v-model.number="sizeItem.stock" min="0" type="number" required />

        <button type="button" @click="removeSize(index)" v-if="formData.sizePrice.length > 1">
          Xóa
        </button>
      </div>

      <button type="button" @click="addSize">+ Thêm Size</button>

      <button type="submit">{{ isEditing ? 'Cập nhật' : 'Thêm sản phẩm' }}</button>
      <button v-if="isEditing" type="button" @click="cancelEdit">Hủy</button>
    </form>

    <div>
      <!-- Bộ lọc -->
      <div class="filter-container">
        <label for="filter">Lọc theo loại: </label>
        <select v-model="selectedType">
          <option value="">Tất cả</option>
          <option v-for="type in uniqueTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>

      <!-- Bảng sản phẩm -->
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
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>{{ product.nameProduct }}</td>
            <td>{{ product.type }}</td>
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
  </div>
</template>
  
  
<script>
import axios from 'axios'
import { storage } from '@/firebaseStorage'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { nextTick } from 'vue'

export default {
  data() {
    return {
      products: [],
      selectedType: '', // Lọc theo loại sản phẩm
      formData: {
        id: '',
        nameProduct: '',
        type: '',
        description: '',
        gender: '',
        material: '',
        karat: '',
        sizePrice: [{ size: 18, stock: 0, price: 0 }],
        productImg: [], // Loại bỏ giá trị rỗng
        show: '',
      },
      imageLink: '',
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
      try {
        await axios.post('http://localhost:5121/api/products/create-or-update', this.formData)
        console.log(this.isEditing ? '✅ Đã cập nhật sản phẩm' : '✅ Đã thêm sản phẩm')
        this.resetForm()
        this.fetchProducts() // Gọi API sau khi lưu thành công
      } catch (error) {
        console.error('Lỗi khi lưu sản phẩm:', error)
      }
    },

    async deleteProduct(id) {
      if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        try {
          await axios.delete(`http://localhost:5121/api/products/delete/${id}`)
          console.log(`❌ Đã xóa sản phẩm có ID: ${id}`)
          this.fetchProducts() // Chỉ gọi nếu thành công
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
      if (!this.imageLink.trim()) {
        alert('Vui lòng nhập link ảnh hợp lệ!')
        return
      }
      this.formData.productImg.push(this.imageLink.trim())
      this.imageLink = ''
    },

    removeImage(index) {
      console.log('❌ Xóa ảnh:', this.formData.productImg[index])
      this.formData.productImg.splice(index, 1)
    },

    editProduct(product) {
      this.formData = { ...product, sizePrice: [...product.sizePrice] }
      this.isEditing = true
      nextTick(() => {
        setTimeout(() => {
          document.querySelector('.page-content')?.scrollTo({ top: 0, behavior: 'smooth' })
        }, 200)
      })
    },
    cancelEdit() {
      this.resetForm()
    },

    resetForm() {
      this.formData = {
        id: '',
        nameProduct: '',
        type: '',
        description: '',
        gender: '',
        material: '',
        karat: '',
        sizePrice: [{ size: 18, stock: 0, price: 0 }],
        productImg: [],
        show: '',
      }
      this.isEditing = false
    },

    addSize() {
      this.formData.sizePrice.push({ size: 0, stock: 0, price: 0 })
    },

    removeSize(index) {
      this.formData.sizePrice.splice(index, 1)
    },
  },

  mounted() {
    this.fetchProducts()
  },
  computed: {
    filteredProducts() {
      if (!this.selectedType) return this.products
      return this.products.filter((product) => product.type === this.selectedType)
    },
    uniqueTypes() {
      return [...new Set(this.products.map((p) => p.type))]
    },
  },
}
</script>



  
  <style scoped>
.product-manager {
  max-width: 1500px;
  overflow-y: auto;
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
  overflow: auto !important;
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
td button {
  background-color: #4caf50; /* Màu xanh lá */
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.3s, transform 0.1s;
  border-radius: 5px;
  margin-right: 5px;
}

td button:hover {
  background-color: #45a049; /* Màu xanh đậm hơn khi hover */
}

td button:active {
  transform: scale(0.95); /* Nhấn vào thì thu nhỏ nhẹ */
}

td button:nth-child(2) {
  background-color: #e74c3c; /* Màu đỏ cho nút Xóa */
}

td button:nth-child(2):hover {
  background-color: #c0392b;
}

.filter-container {
  margin: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-container label {
  font-weight: bold;
  color: #333;
}

.filter-container select {
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.filter-container select:hover {
  border-color: #007bff;
}

.filter-container select:focus {
  outline: none;
  border-color: #0056b3;
  box-shadow: 0 0 5px rgba(0, 91, 187, 0.5);
}
</style>
  