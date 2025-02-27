<template>
  <div class="order-list">
    <h2>Danh sách đơn hàng</h2>

    <table>
      <thead>
        <tr>
          <th>Mã đơn hàng</th>
          <th>Khách hàng</th>
          <th>Thanh toán</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.idUserOrder }}</td>
          <td>{{ order.typePayment }}</td>
          <td>{{ formatCurrency(order.totalAmount) }}</td>
          <td :class="getStatusClass(order.status)">{{ order.status }}</td>
          <td>
            <button v-if="order.status !== 'completed'" @click="updateStatus(order)">
              Chuyển trạng thái
            </button>
            <span v-else>✔ Hoàn thành</span>
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
      orders: [],
    }
  },
  async created() {
    await this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await axios.get('http://localhost:5121/api/orders/all')
        this.orders = res.data // Giả sử API trả về danh sách đơn hàng
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error)
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
          nextStatus, // Gửi newStatus dưới dạng plain text
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )

        if (res.status === 200) {
          order.status = nextStatus // Cập nhật trạng thái trên giao diện
          alert('Cập nhật trạng thái thành công!')
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error)
      }
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    },
    getStatusClass(status) {
      return {
        pending: 'status-pending',
        confirmed: 'status-confirmed',
        completed: 'status-completed',
      }[status]
    },
  },
}
</script>

<style scoped>
.order-list {
  max-width: 800px;
  margin: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
th {
  background-color: #f4f4f4;
}
.status-pending {
  color: orange;
  font-weight: bold;
}
.status-confirmed {
  color: blue;
  font-weight: bold;
}
.status-completed {
  color: green;
  font-weight: bold;
}
button {
  padding: 5px 10px;
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
