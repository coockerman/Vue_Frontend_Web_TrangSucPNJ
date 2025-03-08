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
import { ref, watch, defineEmits, computed, onMounted, watchEffect } from 'vue'
import { useUserStore } from '@/stores/user'
import axios from 'axios'

const hasPurchased = ref(false)
// Nhận các props từ component cha
const props = defineProps({
  evaluationIds: Array, // Danh sách ID các đánh giá của sản phẩm
  productId: String, // ID sản phẩm cần đánh giá
  productName: String, // Tên sản phẩm
})

// Khai báo emit để có thể báo về component cha khi cần reload dữ liệu sản phẩm
const emit = defineEmits(['reloadProduct'])

// Danh sách đánh giá của sản phẩm
const evaluations = ref([])
// Trạng thái loading khi tải dữ liệu đánh giá
const loading = ref(false)
const userTitle = ref({})

// Nội dung đánh giá và số sao được chọn
const reviewContent = ref('')
const reviewStar = ref(0)
const hoverStar = ref(0)

// Trạng thái đang gửi đánh giá
const isSubmitting = ref(false)

// Lấy ID user từ localStorage
const userId = localStorage.getItem('uid')

// Kiểm tra xem người dùng hiện tại đã đánh giá sản phẩm này chưa
const hasReviewed = computed(() => {
  const test = evaluations.value.some((evaluation) => evaluation.idUser === userId)
  console.log(test)
  return test
})

// Hàm tải danh sách đánh giá dựa trên danh sách ID đánh giá từ props
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

// Theo dõi sự thay đổi của evaluationIds để tự động tải đánh giá mới
watch(() => props.evaluationIds, fetchEvaluations, { immediate: true })

// Hàm định dạng thời gian đánh giá
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

watchEffect(async () => {
  try {
    const response = await axios.get(`http://localhost:5121/api/users/detail/${userId}`)
    userTitle.value = response.data // ✅ Gán dữ liệu vào `ref`

    hasPurchased.value = userTitle.value.purchasedCart?.includes(props.productId) || false
    console.log('📌 Kiểm tra sản phẩm đã mua:', props.productId, '->', hasPurchased.value)
  } catch (error) {
    console.error('❌ Lỗi khi lấy dữ liệu user:', error)
  }
})

// Hàm gửi đánh giá mới hoặc cập nhật đánh giá
const submitReview = async () => {
  if (!reviewContent.value || reviewStar.value === 0) {
    alert('Vui lòng nhập nội dung và chọn số sao!')
    return
  }

  isSubmitting.value = true
  try {
    // Gửi dữ liệu đánh giá lên API
    const response = await axios.post('http://localhost:5121/api/evaluations/create-or-update', {
      id: '',
      content: reviewContent.value,
      idProduct: props.productId,
      nameUser: userTitle.value.fullName,
      emailUser: userTitle.value.email,
      idUser: userId,
      nameProduct: props.productName,
      timeEvaluation: new Date().toISOString(),
      star: reviewStar.value,
    })

    // Lấy ID của đánh giá vừa tạo từ phản hồi API
    const newEvaluationId = response.data.id

    // Nếu đánh giá mới có ID hợp lệ, thêm vào danh sách đánh giá của sản phẩm
    if (newEvaluationId) {
      await axios.post(
        `http://localhost:5121/api/products/${props.productId}/add-evaluation`,
        JSON.stringify(newEvaluationId),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    alert('Đánh giá đã được gửi!')
    // Reset nội dung đánh giá sau khi gửi thành công
    reviewContent.value = ''
    reviewStar.value = 0
    hoverStar.value = 0

    // Tải lại danh sách đánh giá
    fetchEvaluations()
  } catch (error) {
    console.error('Lỗi khi gửi đánh giá:', error)
    alert('Có lỗi xảy ra khi gửi đánh giá.')
  } finally {
    // Gửi sự kiện reload dữ liệu sản phẩm về component cha
    emit('reloadProduct')
    isSubmitting.value = false
  }
}

// Khi component được mounted, kiểm tra và lấy thông tin user nếu chưa có
onMounted(() => {})
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
  