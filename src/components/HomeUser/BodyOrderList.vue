<template>
  <div class="order-list">
    <h1 class="text-2xl font-bold mb-4 text-center">Danh sách đơn hàng</h1>

    <div class="flex gap-4 justify-center">
      <!-- Cột Pending -->
      <div class="order-column">
        <h2 class="text-lg font-semibold bg-yellow-300 p-2 text-center">⏳ Đang chuẩn bị</h2>
        <ul>
          <li
            v-for="order in pendingOrders"
            :key="order.id"
            @click="selectOrder(order)"
            class="order-item bg-yellow-100"
          >
            Đơn hàng #{{ order.id }}
          </li>
        </ul>
      </div>

      <!-- Cột Confirmed -->
      <div class="order-column">
        <h2 class="text-lg font-semibold bg-blue-300 p-2 text-center">✔️ Đang giao</h2>
        <ul>
          <li
            v-for="order in confirmedOrders"
            :key="order.id"
            @click="selectOrder(order)"
            class="order-item bg-blue-100"
          >
            Đơn hàng #{{ order.id }}
          </li>
        </ul>
      </div>

      <!-- Cột Completed -->
      <div class="order-column">
        <h2 class="text-lg font-semibold bg-green-300 p-2 text-center">✅ Hoàn thành</h2>
        <ul>
          <li
            v-for="order in completedOrders"
            :key="order.id"
            @click="selectOrder(order)"
            class="order-item bg-green-100"
          >
            Đơn hàng #{{ order.id }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Popup hiển thị chi tiết đơn hàng -->
    <div v-if="selectedOrder" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2 class="text-xl font-bold">Chi tiết đơn hàng #{{ selectedOrder.id }}</h2>
        <p><strong>Trạng thái:</strong> {{ selectedOrder.status }}</p>
        <p><strong>Ngày đặt hàng:</strong> {{ formatDate(selectedOrder.timeOrder) }}</p>
        <p><strong>Người nhận:</strong> {{ selectedOrder.nameUserGet }}</p>
        <p><strong>Email:</strong> {{ selectedOrder.emailUserGet }}</p>
        <p><strong>SĐT:</strong> {{ selectedOrder.phoneUserGet }}</p>
        <p><strong>Địa chỉ:</strong> {{ selectedOrder.addressUserGet }}</p>
        <p><strong>Phương thức thanh toán:</strong> {{ selectedOrder.typePayment }}</p>

        <p><strong>Sản phẩm:</strong></p>
        <ul>
          <li v-for="item in selectedOrder.productItems" :key="item.idProductNow">
            {{ item.name }} size {{ item.size }} số lượng {{ item.stock }} x
            {{ item.price.toLocaleString() }}đ
          </li>
        </ul>

        <p><strong>Tổng tiền:</strong> {{ selectedOrder.totalAmount.toLocaleString() }}đ</p>
        <button @click="closeModal" class="close-btn">Đóng</button>
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
    }
  },
  computed: {
    pendingOrders() {
      return this.orders.filter((order) => order.status === 'pending')
    },
    confirmedOrders() {
      return this.orders.filter((order) => order.status === 'confirmed')
    },
    completedOrders() {
      return this.orders.filter((order) => order.status === 'completed')
    },
  },
  methods: {
    async fetchOrders() {
      try {
        const userId = localStorage.getItem('uid') // Lấy id user từ localStorage
        const response = await axios.get(`http://localhost:5121/api/orders/user/${userId}`)
        this.orders = response.data
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error)
      }
    },
    selectOrder(order) {
      this.selectedOrder = order
    },
    closeModal() {
      this.selectedOrder = null
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },
  },
  mounted() {
    this.fetchOrders()
  },
}
</script>
    
  <style scoped>
.order-list {
  max-width: 1200px;
  min-height: 100vh;
  margin: auto;
}

.order-column {
  flex: 1;
  min-width: 250px;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  background: #fff;
}

.order-item {
  padding: 8px;
  margin: 4px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}
.order-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Modal overlay */
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

/* Modal content */
.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 650px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* Close button */
.close-btn {
  margin-top: 10px;
  padding: 8px 12px;
  background: red;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.close-btn:hover {
  background: darkred;
}
</style>
  