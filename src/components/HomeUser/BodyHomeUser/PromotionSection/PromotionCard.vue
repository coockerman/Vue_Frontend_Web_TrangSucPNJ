<template>
  <div class="promotion-card" :class="{ 'reverse-layout': reverse }">
    <img :src="image" alt="promotion image" class="promotion-image" />
    <div class="promotion-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <div class="image-button-container">
        <img
          v-if="image_child"
          :src="image_child"
          alt="extra image"
          class="promotion-image-child"
        />
        <router-link :to="{ path: customRoute, query: { id: idCollection } }">
          <button class="cta-button">{{ buttonText }}</button>
        </router-link>
      </div>
    </div>
  </div>
</template>
        
  <script>
export default {
  props: {
    title: String,
    description: String,
    image: String,
    image_child: String, // Thêm prop mới
    buttonText: String,
    reverse: Boolean,
    idCollection: String,
    customRoute: {
      type: String,
      default: '/user-home/productsByCollection', // Đường dẫn mặc định
    },
  },
}
</script>
        
  <style scoped>
.promotion-card {
  display: flex;
  background-color: #fafafa;
  padding: 20px;
  margin: 10px 50px;
  border-radius: 5px;
  align-items: center;
  gap: 20px;
}

.promotion-card.reverse-layout {
  flex-direction: row-reverse;
}

.promotion-image {
  width: 60%;
  height: 350px;
  border-radius: 10px;
  object-fit: cover;
}

.promotion-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
}

h3 {
  font-size: 22px;
  font-family: 'Prata', serif;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  margin-bottom: 5px;
}

/* Chỉ căn giữa ảnh phụ và nút */
.image-button-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Căn giữa theo chiều ngang */
  margin-top: 10px;
}

.promotion-image-child {
  width: 180px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px; /* Tạo khoảng cách giữa ảnh và nút */
}

.cta-button {
  background-color: #a00;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
  