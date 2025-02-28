<template>
  <div class="review-container">
    <h2 class="review-title">All Reviews ({{ evaluations.length }})</h2>
    <div v-if="loading" class="loading">Đang tải đánh giá...</div>
    <div v-else-if="evaluations.length === 0" class="no-reviews">Không có đánh giá nào.</div>
    <div v-else class="reviews-grid">
      <div v-for="evaluation in evaluations" :key="evaluation.id" class="review-card">
        <div class="review-header">
          <span class="review-name">{{ evaluation.nameUser }} ✅</span>
        </div>
        <div class="review-stars">
          <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= evaluation.star }"
            >★</span
          >
          <span class="rating-text">({{ evaluation.star }}/5)</span>
        </div>
        <p class="review-content">"{{ evaluation.content }}"</p>
        <div class="review-date">🕒 {{ formatTime(evaluation.timeEvaluation) }}</div>
      </div>
    </div>

    <div v-if="hasPurchased">
      <div v-if="hasReviewed" class="review-message">✅ Bạn đã đánh giá sản phẩm này.</div>
      <div v-else class="review-input-container">
        <h3>Viết đánh giá của bạn</h3>
        <div class="rating">
          <span
            v-for="n in 5"
            :key="n"
            @mouseover="hoverStar = n"
            @mouseleave="hoverStar = reviewStar"
            @click="reviewStar = n"
            class="star"
            :class="{ filled: n <= (hoverStar || reviewStar) }"
          >
            ★
          </span>
        </div>
        <textarea v-model="reviewContent" placeholder="Nhập đánh giá của bạn..."></textarea>
        <button :disabled="isSubmitting" @click="submitReview">
          {{ isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, watch, defineEmits, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import axios from 'axios'

const props = defineProps({
  evaluationIds: Array,
  productId: String,
  productName: String,
})
const emit = defineEmits(['reloadProduct'])

const evaluations = ref([])
const loading = ref(false)
const userStore = useUserStore()
const reviewContent = ref('')
const reviewStar = ref(0)
const hoverStar = ref(0)
const isSubmitting = ref(false)
const hasReviewed = computed(() => {
  return evaluations.value.some((evaluation) => evaluation.idUser === userStore.uid)
})

const fetchEvaluations = async () => {
  if (!props.evaluationIds || props.evaluationIds.length === 0) {
    evaluations.value = []
    return
  }

  loading.value = true
  try {
    const response = await axios.post(
      'http://localhost:5121/api/evaluations/list-by-ids',
      props.evaluationIds
    )
    evaluations.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá:', error)
    evaluations.value = []
  } finally {
    loading.value = false
  }
}

watch(() => props.evaluationIds, fetchEvaluations, { immediate: true })

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const hasPurchased = computed(() => userStore.userInfo?.purchasedCart?.includes(props.productId))

const submitReview = async () => {
  if (!reviewContent.value || reviewStar.value === 0) {
    alert('Vui lòng nhập nội dung và chọn số sao!')
    return
  }

  isSubmitting.value = true
  try {
    const response = await axios.post('http://localhost:5121/api/evaluations/create-or-update', {
      id: '',
      content: reviewContent.value,
      idProduct: props.productId,
      nameUser: `${userStore.userInfo?.firstName} ${userStore.userInfo?.lastName}`,
      emailUser: userStore.userInfo?.email,
      idUser: userStore.uid,
      nameProduct: props.productName,
      timeEvaluation: new Date().toISOString(),
      star: reviewStar.value,
    })

    const newEvaluationId = response.data.id

    if (newEvaluationId) {
      await axios.post(
        `http://localhost:5121/api/products/${props.productId}/add-evaluation`,
        JSON.stringify(newEvaluationId),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    alert('Đánh giá đã được gửi!')
    reviewContent.value = ''
    reviewStar.value = 0
    hoverStar.value = 0
    fetchEvaluations()
  } catch (error) {
    console.error('Lỗi khi gửi đánh giá:', error)
    alert('Có lỗi xảy ra khi gửi đánh giá.')
  } finally {
    emit('reloadProduct')
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (!userStore.userInfo) {
    userStore.fetchUserInfo()
  }
})
</script>
  
  <style scoped>
.review-container {
  padding: 16px;
  background: #fff;
}

.review-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

.loading,
.no-reviews {
  text-align: center;
  font-size: 14px;
  color: gray;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.review-card {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-header {
  font-weight: bold;
  margin-bottom: 4px;
}

.review-name {
  color: #333;
}

.review-stars {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #ffcc00;
  font-weight: bold;
  margin: 5px 0;
}

.star {
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  color: lightgray;
}

.star.filled {
  color: #ffcc00;
}

.rating-text {
  font-size: 14px;
  margin-left: 8px;
  color: #333;
}

.review-content {
  font-size: 14px;
  color: #444;
}

.review-date {
  font-size: 12px;
  color: gray;
  margin-top: 8px;
}

.review-input-container {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

textarea {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: none;
}

button {
  margin-top: 12px;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

button:disabled {
  background: gray;
  cursor: not-allowed;
}

.review-message {
  margin: 15px;
  font-size: 16px;
  color: green;
  font-weight: bold;
  text-align: center; /* Căn giữa theo chiều ngang */
}
</style>
  