<template>
  <div class="payment-success">
    <div class="content">
      <h1>Thanh toán thành công!</h1>
      <p>Đơn hàng của bạn đã được xử lý.</p>
      <p>Cảm ơn bạn đã mua sắm!</p>

      <router-link to="/user-home" class="home-button">🏠 Quay lại trang chủ</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      orderId: null,
      loading: true,
      error: null,
    }
  },
  async created() {
    const query = new URLSearchParams(window.location.search)
    const paymentId = query.get('paymentId')
    const PayerID = query.get('PayerID')

    if (!paymentId || !PayerID) {
      this.error = 'Thiếu thông tin thanh toán!'
      this.loading = false
      return
    }

    try {
      const response = await axios.get(
        `http://localhost:5121/api/paypal/payment-success?paymentId=${paymentId}&PayerID=${PayerID}`
      )
      this.orderId = response.data.orderId
    } catch (err) {
      this.error = 'Thanh toán thất bại hoặc có lỗi xảy ra!'
    } finally {
      this.loading = false
    }
  },
}
</script>

<style scoped>
.payment-success {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Chiếm toàn bộ chiều cao màn hình */
  background: linear-gradient(135deg, #ffffff, #f5f5f5);
  color: rgb(0, 0, 0);
  text-align: center;
}

.content {
  background: rgba(255, 255, 255, 0.2);
  padding: 30px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(63, 49, 49, 0.2);
  width: 400px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  margin: 10px 0;
  color: #555;
}

.error-message {
  color: #ff4d4f;
  font-weight: bold;
}

.loading-spinner {
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.home-button {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background: white;
  color: #1a805e;
  font-weight: bold;
  border-radius: 5px;
  text-decoration: none;
  transition: 0.3s;
}

.home-button:hover {
  background: #ddd;
}
</style>
