<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Quản lý mã giảm giá</h1>

    <!-- Form Thêm / Sửa Coupon -->
    <div class="mb-6 border p-6 rounded-lg bg-gray-100">
      <h2 class="text-lg font-semibold mb-2">
        {{ editingCoupon ? 'Cập nhật Coupon' : 'Thêm Coupon Mới' }}
      </h2>
      <input
        v-model="coupon.id"
        placeholder="Nhập ID Coupon"
        class="input"
        :disabled="editingCoupon"
      />
      <input v-model="coupon.name" placeholder="Tên Coupon" class="input" />
      <label class="block">Số tiền giảm giá:</label>
      <input
        v-model.number="coupon.discount"
        type="number"
        placeholder="Nhập số tiền giảm"
        class="input"
      />

      <label class="block">Số lượng mã giảm giá:</label>
      <input
        v-model.number="coupon.stock"
        type="number"
        placeholder="Nhập số lượng mã"
        class="input"
      />

      <button @click="saveCoupon" class="btn btn-primary">
        {{ editingCoupon ? 'Cập nhật' : 'Thêm' }}
      </button>
      <button v-if="editingCoupon" @click="cancelEdit" class="btn btn-secondary">Hủy</button>
    </div>

    <!-- Danh sách Coupons -->
    <table class="table-auto w-full border-collapse border">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">ID</th>
          <th class="border p-2">Tên</th>
          <th class="border p-2">Giảm Giá(VND)</th>
          <th class="border p-2">Số Lượng</th>
          <th class="border p-2">Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id" class="border">
          <td class="p-2">{{ item.id }}</td>
          <td class="p-2">{{ item.name }}</td>
          <td class="p-2">{{ item.discount }} vnd</td>
          <td class="p-2">{{ item.stock }}</td>
          <td class="p-2">
            <button @click="editCoupon(item)" class="btn btn-warning">Sửa</button>
            <button @click="deleteCoupon(item.id)" class="btn btn-danger">Xoá</button>
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
      coupons: [],
      coupon: { id: '', name: '', discount: 0, stock: 0 },
      editingCoupon: null,
    }
  },
  methods: {
    async fetchCoupons() {
      const res = await axios.get('http://localhost:5121/api/coupons/all')
      this.coupons = res.data
    },
    async saveCoupon() {
      if (!this.coupon.id) {
        alert('ID không được để trống!')
        return
      }
      if (this.editingCoupon) {
        await axios.patch(`http://localhost:5121/api/coupons/update/${this.coupon.id}`, {
          name: this.coupon.name,
          discount: this.coupon.discount,
          stock: this.coupon.stock,
        })
      } else {
        await axios.post('http://localhost:5121/api/coupons/create-or-update', this.coupon)
      }
      this.resetForm()
      this.fetchCoupons()
    },
    editCoupon(coupon) {
      this.coupon = { ...coupon }
      this.editingCoupon = coupon
    },
    cancelEdit() {
      this.resetForm()
    },
    async deleteCoupon(id) {
      if (confirm('Bạn có chắc muốn xóa Coupon này?')) {
        await axios.delete(`http://localhost:5121/api/coupons/delete/${id}`)
        this.fetchCoupons()
      }
    },
    async decreaseStock(id) {
      await axios.patch(`http://localhost:5121/api/coupons/decrease-stock/${id}`, 1)
      this.fetchCoupons()
    },
    resetForm() {
      this.coupon = { id: '', name: '', discount: 0, stock: 0 }
      this.editingCoupon = null
    },
  },
  mounted() {
    this.fetchCoupons()
  },
}
</script>
  
  <style>
.input {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

.btn {
  padding: 8px 15px;
  margin-right: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-warning {
  background-color: #ffc107;
  color: black;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.table-auto {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.table-auto th,
.table-auto td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.table-auto th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.p-6 {
  padding: 24px;
}

.mb-6 {
  margin-bottom: 24px;
}

.border {
  border: 1px solid #ddd;
  border-radius: 8px;
}

.rounded-lg {
  border-radius: 10px;
}

.bg-gray-100 {
  background-color: #f8f9fa;
}

.bg-gray-200 {
  background-color: #e9ecef;
}

.text-2xl {
  font-size: 28px;
}

.text-lg {
  font-size: 20px;
}

.font-semibold {
  font-weight: 600;
}

.p-2 {
  padding: 12px;
}
</style>
  