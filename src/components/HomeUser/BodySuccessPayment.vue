<template>
  <div class="payment-success">
    <h1>Thanh toán thành công!</h1>
    <p>Đơn hàng của bạn đã được xử lý. Cảm ơn bạn đã mua sắm!</p>
    <p><strong>Mã đơn hàng:</strong> {{ orderId }}</p>
    <router-link to="/user-home">Quay lại trang chủ</router-link>
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
  text-align: center;
  padding: 20px;
}
</style>
  