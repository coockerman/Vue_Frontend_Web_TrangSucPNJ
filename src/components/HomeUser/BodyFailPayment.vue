<template>
  <div class="payment-failed">
    <div class="content">
      <h1>❌ Thanh toán không thành công!</h1>
      <p>Đơn hàng của bạn chưa thể thanh toán. Vui lòng thử lại sau.</p>

      <router-link to="/user-home" class="home-button">🏠 Quay lại trang chủ</router-link>
    </div>
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
.payment-failed {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Toàn màn hình */
  background: linear-gradient(135deg, #eed6d6, #7f615b); /* Màu đỏ gradient */
  color: white;
  text-align: center;
}

.content {
  background: rgba(255, 255, 255, 0.2);
  padding: 30px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 400px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 18px;
  margin: 10px 0;
}

.home-button {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background: white;
  color: #ff98b0;
  font-weight: bold;
  border-radius: 5px;
  text-decoration: none;
  transition: 0.3s;
}

.home-button:hover {
  background: #ddd;
}
</style>
