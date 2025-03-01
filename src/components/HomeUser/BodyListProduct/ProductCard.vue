<template>
  <div class="product-card" v-if="product.show !== 'false'" @click="goToProductDetail">
    <!-- Hình ảnh sản phẩm -->
    <div class="image-container">
      <img :src="product.image" :alt="product.nameProduct" class="product-image" />
      <span v-if="product.discount" class="discount-badge">-{{ product.discount }}%</span>
    </div>

    <!-- Tên sản phẩm -->
    <h3 class="product-name">{{ product.nameProduct }}</h3>

    <!-- Đánh giá -->
    <div class="rating">
      <span class="stars">
        <span v-for="star in Math.floor(averageRating)" :key="star">⭐</span>
        <span v-if="averageRating % 1 !== 0">☆</span>
      </span>
      <span class="rating-score">
        {{
          reviewCount > 0
            ? `${averageRating.toFixed(1)}/5 (${reviewCount} đánh giá)`
            : 'Chưa có đánh giá'
        }}
      </span>
    </div>

    <!-- Giá sản phẩm -->
    <div class="discount-container">
      <span class="old-price">{{ formatPrice(product.price * 1.2) }}</span>
      <span class="discount-text">Giảm 20%</span>
    </div>
    <div class="price-container">
      <span v-if="product.oldPrice" class="old-price">{{ formatPrice(product.oldPrice) }}</span>
      <span class="price">{{ formatPrice(product.price) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  product: Object,
})

const router = useRouter()

const goToProductDetail = () => {
  console.log(props.product.id) // Kiểm tra ID trước khi chuyển trang
  router.push({
    name: 'productDetail',
    query: { id: props.product.id },
  })
}

const reviews = ref([])
const reviewCount = computed(() => reviews.value.length)
const averageRating = computed(() => {
  if (reviewCount.value === 0) return 0
  return reviews.value.reduce((sum, review) => sum + (review.star || 0), 0) / reviewCount.value
})

const fetchReviews = async () => {
  if (!props.product.listEvaluationIds.length) return

  try {
    console.log('📌 Danh sách ID gửi đi:', JSON.stringify(props.product.listEvaluationIds))

    const response = await axios.post(
      'http://localhost:5121/api/evaluations/list-by-ids',
      props.product.listEvaluationIds,
      { headers: { 'Content-Type': 'application/json' } }
    )

    reviews.value = response.data
  } catch (error) {
    console.error('❌ Lỗi khi lấy đánh giá:', error.response ? error.response.data : error.message)
  }
}

onMounted(fetchReviews)

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
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.product-card:hover {
  transform: scale(1.05);
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

/* Giá gốc bị gạch */
.discount-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 4px;
}

.old-price {
  text-decoration: line-through;
  color: gray;
  font-size: 14px;
}

.discount-text {
  color: red;
  font-size: 14px;
  font-weight: bold;
}
</style>
