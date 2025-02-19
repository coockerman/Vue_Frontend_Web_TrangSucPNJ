<template>
  <div class="product-card">
    <!-- Hình ảnh sản phẩm -->
    <div class="image-container">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <span v-if="product.discount" class="discount-badge">-{{ product.discount }}%</span>
    </div>

    <!-- Tên sản phẩm -->
    <h3 class="product-name">{{ product.name }}</h3>

    <!-- Đánh giá -->
    <div class="rating">
      <span class="stars">
        <span v-for="star in Math.floor(product.rating)" :key="star">⭐</span>
        <span v-if="product.rating % 1 !== 0">☆</span>
      </span>
      <span class="rating-score">{{ product.rating }}/5</span>
    </div>

    <!-- Giá sản phẩm -->
    <div class="price-container">
      <span v-if="product.oldPrice" class="old-price">{{ formatPrice(product.oldPrice) }}</span>
      <span class="price">{{ formatPrice(product.price) }}</span>
    </div>
  </div>
</template>
  
  <script setup>
defineProps({
  product: Object,
})

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
</script>
  
  <style scoped>
.product-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  background: white;
  width: 240px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* Hình ảnh và giảm giá */
.image-container {
  position: relative;
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: red;
  color: white;
  font-size: 12px;
  padding: 4px 6px;
  border-radius: 4px;
}

/* Tên sản phẩm */
.product-name {
  font-size: 14px;
  font-weight: bold;
  margin: 8px 0;
}

/* Đánh giá */
.rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12px;
}

.rating-score {
  color: gray;
}

/* Giá sản phẩm */
.price-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.old-price {
  text-decoration: line-through;
  color: gray;
  font-size: 14px;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #d9534f;
}
</style>
  