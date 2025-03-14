<template>
  <div class="comment-container">
    <h2 class="comment-title">Bình luận ({{ comments.length }})</h2>

    <div v-if="loading" class="loading">Đang tải bình luận...</div>
    <div v-else-if="comments.length === 0" class="no-comments">Chưa có bình luận nào.</div>
    <div v-else class="comments-list">
      <div
        v-for="comment in comments"
        :key="comment.id"
        :class="['comment-card', { edited: comment.hasFix }]"
      >
        <div class="comment-header">
          <span class="comment-user">
            {{ comment.nameUser }}
            <span v-if="comment.hasFix" class="edited-text">(Đã chỉnh sửa)</span>
          </span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
        <div class="comment-footer">
          <span class="comment-time">🕒 {{ formatTime(comment.timeComment) }}</span>
          <button v-if="comment.idUser === userId && !comment.hasFix" @click="editComment(comment)">
            ✏️ Sửa
          </button>
          <button v-if="comment.idUser === userId" @click="deleteComment(comment.id)">
            🗑️ Xóa
          </button>
        </div>
      </div>
    </div>

    <div class="comment-input-container">
      <h3>Viết bình luận</h3>
      <textarea v-model="commentContent" placeholder="Nhập bình luận của bạn..."></textarea>
      <button :disabled="isSubmitting" @click="submitComment">
        {{ isSubmitting ? 'Đang gửi...' : editingComment ? 'Cập nhật' : 'Gửi bình luận' }}
      </button>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  productId: String,
})

const userStore = useUserStore()
const comments = ref([])
const loading = ref(false)
const commentContent = ref('')
const isSubmitting = ref(false)
const editingComment = ref(null)
const userId = localStorage.getItem('uid')
const hasFix = ref(false)
const fetchComments = async () => {
  loading.value = true
  try {
    const response = await axios.get(`http://localhost:5121/api/comment/product/${props.productId}`)
    comments.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải bình luận:', error)
  } finally {
    loading.value = false
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const submitComment = async () => {
  if (localStorage.getItem('userRole') !== 'user') {
    alert('Vui lòng đăng nhập trước')
    return
  }

  if (!commentContent.value) {
    alert('Vui lòng nhập nội dung bình luận!')
    return
  }

  isSubmitting.value = true
  try {
    if (editingComment.value) {
      console.log('🔄 Cập nhật bình luận:', editingComment.value.id)

      const updateData = {}
      if (commentContent.value) updateData.content = commentContent.value
      if (typeof hasFix.value !== 'undefined') updateData.hasFix = hasFix.value

      console.log('Dữ liệu gửi đi:', updateData)

      await axios.patch(
        `http://localhost:5121/api/comment/${editingComment.value.id}`,
        updateData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )

      alert('Bình luận đã được cập nhật.')
      editingComment.value = null
    } else {
      console.log('🆕 Thêm bình luận mới...')
      const userTitle = await axios.get(`http://localhost:5121/api/users/detail/${userId}`)

      const commentData = {
        id: '',
        content: commentContent.value,
        idProduct: props.productId,
        nameUser: userTitle.data.fullName,
        idUser: localStorage.getItem('uid'),
        timeComment: new Date().toISOString(),
        hasFix: false,
      }

      console.log('📤 Dữ liệu gửi lên API (tạo bình luận):', commentData)

      const response = await axios.post('http://localhost:5121/api/comment', commentData)

      console.log('✅ Phản hồi từ server khi thêm bình luận:', response.data)

      const commentIdSave = response.data.commentId // Lấy ID từ response

      console.log(`📤 Gửi ID bình luận (${commentIdSave}) đến sản phẩm ${props.productId}`)

      // 🔹 Sửa lỗi template string (dùng dấu `)
      await axios.post(
        `http://localhost:5121/api/products/${props.productId}/add-comment`,
        JSON.stringify(commentIdSave),
        { headers: { 'Content-Type': 'application/json' } }
      )

      alert('Bình luận đã được gửi!')
    }

    commentContent.value = ''
    fetchComments()
  } catch (error) {
    console.error('❌ Lỗi khi gửi bình luận:', error.response?.data || error.message)
    alert('Có lỗi xảy ra. Xem console để biết thêm chi tiết.')
  } finally {
    isSubmitting.value = false
  }
}

const editComment = (comment) => {
  commentContent.value = comment.content
  editingComment.value = comment
}

const deleteComment = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
    try {
      await axios.delete(`http://localhost:5121/api/comment/${id}`)
      fetchComments()
    } catch (error) {
      console.error('Lỗi khi xóa bình luận:', error)
      alert('Không thể xóa bình luận.')
    }
  }
}

onMounted(fetchComments)
</script>
  
  <style scoped>
.comment-container {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.comment-title {
  font-size: 22px;
  margin-bottom: 15px;
  font-weight: bold;
  color: #333;
}

.loading,
.no-comments {
  text-align: center;
  font-style: italic;
  color: gray;
}

.comments-list {
  margin-bottom: 20px;
}

.comment-card {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  margin-bottom: 12px;
  position: relative;
}

/* Bình luận của chính người dùng */
.comment-card.own-comment {
  border: 2px solid #007bff;
  background: #e9f5ff;
}

/* Bình luận đã chỉnh sửa */
.comment-card.edited {
  border-left: 4px solid orange;
  background-color: #fff8e1;
}

.comment-header {
  font-weight: bold;
  color: #333;
}

.comment-user {
  display: flex;
  align-items: center;
}

.edited-text {
  font-size: 12px;
  color: gray;
  margin-left: 5px;
  font-style: italic;
}

.comment-content {
  font-size: 14px;
  margin-top: 5px;
  color: #444;
  line-height: 1.4;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.comment-footer button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
}

.comment-footer button:hover {
  text-decoration: underline;
}

.comment-input-container {
  margin-top: 20px;
  background: #fff;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

textarea {
  width: 100%;
  height: 80px;
  margin-top: 5px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

button {
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .comment-container {
    max-width: 100%;
    padding: 15px;
  }
  .comment-card {
    padding: 10px;
  }
}
</style>
  