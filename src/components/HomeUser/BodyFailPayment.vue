<template>
  <div class="payment-success">
    <h1>Thanh toán không thành công!</h1>
    <p>Đơn hàng của bạn chưa thể thanh toán</p>
    <router-link to="/user-home">Quay lại trang chủ</router-link>
  </div>
</template>
    
<script>
export default {
  data() {
    return {
      orderId: null,
      loading: true,
      error: null,
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
    