<template>
  <div class="order-list">
    <h2>Quản lý đơn hàng</h2>

    <div class="filter-section">
      <label for="statusFilter">Lọc theo trạng thái:</label>
      <select v-model="selectedStatus" @change="filterOrders">
        <option value="all">Tất cả</option>
        <option value="pending">Chờ xác nhận</option>
        <option value="confirmed">Đang giao</option>
        <option value="completed">Hoàn thành</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>Mã đơn hàng</th>
          <th>Khách hàng</th>
          <th>SĐT</th>
          <th>Địa chỉ</th>
          <th>Ngày đặt hàng</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in filteredOrders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.nameUserGet }}</td>
          <td>{{ order.phoneUserGet }}</td>
          <td>{{ order.addressUserGet }}</td>
          <td>{{ formatDate(order.timeOrder) }}</td>
          <td>{{ formatCurrency(order.totalAmount) }}</td>
          <td :class="getStatusClass(order.status)">{{ order.status }}</td>
          <td>
            <button @click="selectOrder(order)">Xem</button>
            <button v-if="order.status !== 'completed'" @click="updateStatus(order)">
              Cập nhật
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Popup chi tiết đơn hàng -->
    <div v-if="selectedOrder" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>Chi tiết đơn hàng #{{ selectedOrder.id }}</h2>
        <p><strong>Người nhận:</strong> {{ selectedOrder.nameUserGet }}</p>
        <p><strong>Email:</strong> {{ selectedOrder.emailUserGet }}</p>
        <p><strong>SĐT:</strong> {{ selectedOrder.phoneUserGet }}</p>
        <p><strong>Địa chỉ:</strong> {{ selectedOrder.addressUserGet }}</p>
        <p><strong>Ngày đặt hàng:</strong> {{ formatDate(selectedOrder.timeOrder) }}</p>
        <p><strong>Phương thức thanh toán:</strong> {{ selectedOrder.typePayment }}</p>
        <p><strong>Sản phẩm:</strong></p>
        <ul>
          <li v-for="item in selectedOrder.productItems" :key="item.idProductNow">
            {{ item.name }} size {{ item.size }} số lượng {{ item.stock }} x
            {{ item.price.toLocaleString() }}đ
          </li>
        </ul>
        <p><strong>Tổng tiền:</strong> {{ selectedOrder.totalAmount.toLocaleString() }}đ</p>
        <button @click="closeModal">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      orders: [],
      selectedOrder: null,
      filteredOrders: [],
      selectedStatus: 'all',
    }
  },
  async created() {
    await this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await axios.get('http://localhost:5121/api/orders/all')
        // Loại bỏ các đơn hàng có trạng thái "process"
        this.orders = res.data.filter((order) => order.status !== 'process')
        this.filteredOrders = this.orders // Cập nhật danh sách hiển thị
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error)
      }
    },
    filterOrders() {
      if (this.selectedStatus === 'all') {
        this.filteredOrders = this.orders
      } else {
        this.filteredOrders = this.orders.filter((order) => order.status === this.selectedStatus)
      }
    },
    async updateStatus(order) {
      let nextStatus = ''
      if (order.status === 'pending') {
        nextStatus = 'confirmed'
      } else if (order.status === 'confirmed') {
        nextStatus = 'completed'
      } else {
        return
      }

      try {
        const res = await axios.patch(
          `http://localhost:5121/api/orders/update-status/${order.id}`,
          nextStatus,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )

        if (res.status === 200) {
          order.status = nextStatus
          alert('Cập nhật trạng thái thành công!')
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error)
      }
    },
    selectOrder(order) {
      this.selectedOrder = order
    },
    closeModal() {
      this.selectedOrder = null
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },
    getStatusClass(status) {
      return {
        pending: 'status-pending',
        confirmed: 'status-confirmed',
        completed: 'status-completed',
      }[status]
    },
    watch: {
      selectedStatus() {
        this.filterOrders()
      },
    },
  },
}
</script>

<style scoped>
.order-list {
  max-width: 1000px;
  margin: auto;
}

/* Bộ lọc */
.filter-section {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.filter-section label {
  font-weight: bold;
}
select {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* Bảng */
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
  word-wrap: break-word;
}
th {
  background-color: #f4f4f4;
  font-weight: bold;
}

/* Trạng thái đơn hàng */
.status-pending {
  color: orange;
  font-weight: bold;
}
.status-confirmed {
  color: rgb(93, 120, 67);
  font-weight: bold;
}
.status-completed {
  color: rgb(2, 176, 2);
  font-weight: bold;
}

/* Nút bấm */
button {
  padding: 8px 12px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: background 0.3s, transform 0.2s;
}
button:hover {
  background: #0056b3;
  transform: scale(1.05);
}
button:active {
  transform: scale(0.95);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
</style>
