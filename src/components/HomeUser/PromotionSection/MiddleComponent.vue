<template>
  <div class="middle-section">
    <div class="middle-content">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <button class="cta-button">{{ buttonText }}</button>
    </div>
  </div>
</template>
  
  <script>
export default {
  props: {
    title: String,
    description: String,
    backgroundImage: String, // Thêm prop để nhận ảnh nền
    buttonText: String,
  },
}
</script>
  
  <style scoped>
.middle-section {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Đẩy nội dung về bên trái */
  text-align: left;
  background-image: url('/src/assets/Promotion/promotionMiddle.png');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 60px 40px;
  border-radius: 8px;
  margin: 30px 60px;
  height: 500px;
  padding-left: 80px; /* Dịch nội dung sang phải một chút */
}

.middle-content {
  max-width: 45%;
}

h2 {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.cta-button {
  background-color: white;
  color: #4a0d0d;
  padding: 12px 24px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
  