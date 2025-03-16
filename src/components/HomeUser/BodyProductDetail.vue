<template>
  <div v-if="product" class="product-detail">
    <nav class="breadcrumb">
      <span><router-link class="user-home-text" to="/user-home">Home</router-link></span> >
      <span>
        <router-link
          class="type-text"
          :to="`/user-home/products?type=${encodeURIComponent(product.type)}`"
        >
          {{ product.type }}
        </router-link>
      </span>
      >
      <span class="current">{{ product.nameProduct }}</span>
    </nav>

    <div class="product-container">
      <div
        class="thumbnail-column"
        ref="thumbnailContainer"
        @mousedown="startDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @mousemove="onDrag"
      >
        <div class="thumbnail-column" ref="thumbnailContainer" @wheel="scrollThumbnails"></div>
        <img
          v-for="(thumb, index) in product.productImg"
          :key="index"
          :src="thumb"
          :class="{ active: thumb === mainImage }"
          @click="changeImage(thumb)"
          class="thumbnail"
        />
      </div>

      <div class="product-images">
        <transition name="slide-up">
          <img :src="mainImage" :alt="product.nameProduct" class="main-image" />
        </transition>
      </div>

      <div class="product-info">
        <h1 class="product-title">{{ product.nameProduct }}</h1>

        <div class="rating">
          <span class="stars">
            <span v-for="star in Math.floor(averageRating)" :key="star">⭐</span>
            <span v-if="averageRating % 1 !== 0">☆</span>
            <span v-for="star in 5 - Math.ceil(averageRating)" :key="'empty' + star">☆</span>
          </span>
          <span class="rating-score">{{ averageRating.toFixed(1) }}/5</span>
          <div class="title-container">
            <button @click="toggleFavorite" class="favorite-btn">
              <span :class="{ favorited: isFavorite }">❤</span>
            </button>
          </div>
        </div>

        <div class="price-section">
          <span class="old-price">{{ formatPrice(selectedSizePrice * 1.2) }}</span>
          <span class="discount">-20%</span>
          <span class="price">{{ formatPrice(selectedSizePrice) }}</span>
        </div>

        <p class="note">(Giá có thể thay đổi tùy vào chất liệu vàng và đá)</p>

        <div class="size-options">
          <p>*Vui lòng chọn size</p>
          <div class="size-buttons">
            <div v-for="size in product.sizePrice" :key="size.size" class="size-container">
              <button
                :class="{ selected: selectedSize === size.size, outOfStock: size.stock <= 0 }"
                @click="selectSize(size.size, size.price)"
                :disabled="size.stock <= 0"
              >
                {{ size.size }}
              </button>
              <span class="stock-info">
                {{ size.stock > 0 ? `Còn ${size.stock}` : 'Hết hàng' }}
              </span>
            </div>
          </div>
        </div>

        <div class="add-to-cart">
          <button @click="decreaseQuantity">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQuantity">+</button>
          <div @click="addToCard" class="cart-btn">Thêm vào giỏ hàng</div>
        </div>
      </div>
    </div>

    <div class="product-tabs">
      <span
        class="tab-button"
        :class="{ active: activeTab === 'description' }"
        @click="activeTab = 'description'"
        >Mô tả sản phẩm</span
      >
      <span
        class="tab-button"
        :class="{ active: activeTab === 'comments' }"
        @click="activeTab = 'comments'"
        >Bình luận</span
      >
      <span
        class="tab-button"
        :class="{ active: activeTab === 'reviews' }"
        @click="activeTab = 'reviews'"
        >Đánh giá</span
      >
    </div>
    <!-- Nội dung tab được hiển thị -->
    <div class="tab-content">
      <div v-if="activeTab === 'description'">
        <ProductTitle
          :name="product.nameProduct"
          :type="product.type"
          :material="product.material"
          :karat="product.karat"
          :gender="product.gender"
          :description="product.description"
        />
      </div>

      <div v-if="activeTab === 'comments'">
        <CommentList :productId="product.id" />
      </div>

      <div v-if="activeTab === 'reviews'">
        <EvaluationList
          :evaluationIds="product.listEvaluation"
          :productId="product.id"
          :productName="product.nameProduct"
          @reloadProduct="fetchProduct"
        />
      </div>
    </div>
  </div>

  <div v-else class="loading">Đang tải sản phẩm...</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ProductTitle from './BodyProductDetail/ProductTitle.vue'
import EvaluationList from './BodyProductDetail/EvaluationList.vue'
import CommentList from './BodyProductDetail/CommentList.vue'

const route = useRoute()
const product = ref(null)
const mainImage = ref('')
const selectedSize = ref(null)
const selectedSizePrice = ref(0)
const quantity = ref(1)
const activeTab = ref('description')
const reviews = ref([]) // Danh sách đánh giá từ API
const productId = ref(route.query.id)

const isFavorite = ref(false) // Trạng thái yêu thích sản phẩm
const userId = localStorage.getItem('uid') // ID user giả lập, có thể thay bằng user từ store hoặc auth
const reviewCount = computed(() => reviews.value.length)
const averageRating = computed(() => {
  if (reviewCount.value === 0) return 0
  return reviews.value.reduce((sum, review) => sum + (review.star || 0), 0) / reviewCount.value
})

const fetchProduct = async () => {
  const productId = route.query.id
  if (!productId) {
    console.error('Không tìm thấy ID sản phẩm!')
    return
  }

  try {
    const response = await axios.get(`http://localhost:5121/api/products/detail/${productId}`)
    product.value = response.data
    mainImage.value = product.value.productImg[0]

    if (product.value.sizePrice.length > 0) {
      selectedSize.value = product.value.sizePrice[0].size
      selectedSizePrice.value = product.value.sizePrice[0].price
    }

    // Gọi API lấy đánh giá
    fetchReviews()

    // Kiểm tra sản phẩm có trong danh sách yêu thích không
    checkFavoriteStatus(productId)
  } catch (error) {
    console.error('Lỗi tải sản phẩm:', error)
  }
}
const fetchReviews = async () => {
  if (
    !product.value ||
    !Array.isArray(product.value.listEvaluation) ||
    product.value.listEvaluation.length === 0
  ) {
    console.warn('⚠️ Không có ID đánh giá để tải.')
    return
  }

  try {
    console.log('📌 Gửi danh sách ID:', JSON.stringify(product.value.listEvaluation))

    const response = await axios.post(
      'http://localhost:5121/api/evaluations/list-by-ids',
      product.value.listEvaluation,
      { headers: { 'Content-Type': 'application/json' } }
    )

    reviews.value = response.data || []
  } catch (error) {
    console.error('❌ Lỗi khi lấy đánh giá:', error.response ? error.response.data : error.message)
  }
}
// Kiểm tra sản phẩm có trong danh sách yêu thích không
const checkFavoriteStatus = async (productId) => {
  if (!userId) {
    return
  }
  try {
    const response = await axios.get(`http://localhost:5121/api/users/${userId}/favourites`)
    isFavorite.value = response.data.includes(productId)
  } catch (error) {
    console.error('Lỗi khi kiểm tra sản phẩm yêu thích:', error)
  }
}

// Hàm thêm hoặc xoá sản phẩm khỏi danh sách yêu thích
const toggleFavorite = async () => {
  if (!userId) {
    alert('Bạn cần đăng nhập trước')
    return
  }
  if (!product.value) return

  try {
    if (isFavorite.value) {
      await axios.delete(
        `http://localhost:5121/api/users/${userId}/favourites/remove/${product.value.id}`
      )
      isFavorite.value = false
    } else {
      await axios.post(
        `http://localhost:5121/api/users/${userId}/favourites/add/${product.value.id}`
      )
      isFavorite.value = true
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm yêu thích:', error)
  }
}

// Hàm tải lại thông tin sản phẩm
const loadProduct = (id) => {
  console.log('Load product with ID:', id)
  // Gọi API lấy dữ liệu sản phẩm mới
  fetchProduct()
}

// Khi route.query.id thay đổi, cập nhật lại dữ liệu
watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      productId.value = newId
      loadProduct(newId)
    }
  }
)

// Gọi lần đầu khi component được tạo
loadProduct(productId.value)

onMounted(fetchProduct)

const changeImage = (newImage) => {
  mainImage.value = newImage
}

const selectSize = (size, price) => {
  selectedSize.value = size
  selectedSizePrice.value = price
}

const increaseQuantity = () => quantity.value++
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const scrollThumbnails = (event) => {
  event.preventDefault()
  const container = thumbnailContainer.value
  if (container) {
    container.scrollTop += event.deltaY
  }
}
const addToCard = async () => {
  try {
    if (!localStorage.getItem('uid')) {
      alert('Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.')
      return
    }

    const formData = {
      idProduct: route.query.id,
      size: selectedSize.value,
      stock: quantity.value, // Đảm bảo quantity.value có dữ liệu hợp lệ
    }

    const link = `http://localhost:5121/api/users/${localStorage.getItem('uid')}/shopping-cart/add` // Dùng backtick
    console.log(link) // Debug link

    const response = await fetch(link, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!response.ok) throw new Error('Lỗi khi thêm sản phẩm vào giỏ hàng')

    alert('Thêm sản phẩm vào giỏ hàng thành công!')
  } catch (error) {
    console.error(error)
    alert('Có lỗi xảy ra, vui lòng thử lại.')
  }
}
</script>


<style scoped>
.product-detail {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
}

/* Breadcrumb */
.breadcrumb {
  font-size: 14px;
  color: gray;
  margin-bottom: 10px;
}

.breadcrumb span {
  cursor: pointer;
}

.breadcrumb .current {
  font-weight: bold;
}

/* Container chính */
.product-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* Hình ảnh sản phẩm */
.thumbnail-column {
  max-height: 400px; /* Điều chỉnh chiều cao tối đa */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scroll-behavior: smooth; /* Cuộn mượt */
  scrollbar-width: thin; /* Ẩn thanh cuộn mặc định trên Firefox */
  scrollbar-color: #aaa transparent; /* Màu thanh cuộn */
}

.thumbnail-column::-webkit-scrollbar {
  width: 8px;
}

.thumbnail-column::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s;
}

.thumbnail.active {
  border: 2px solid #ff9800;
}

.thumbnail:hover,
.thumbnail.active {
  border: 2px solid black;
  transform: scale(1.1);
}

.product-images {
  width: 50%;
  display: flex;
  justify-content: center;
}

.main-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
}

/* Thông tin sản phẩm */
.product-info {
  flex: 1;
}

.product-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Đánh giá sao */
.rating {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 18px;
  margin-bottom: 10px;
}

.rating-score {
  font-size: 14px;
  color: gray;
}

/* Giá sản phẩm */
.price-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.old-price {
  text-decoration: line-through;
  color: gray;
  font-size: 18px;
}

.discount {
  color: red;
  font-weight: bold;
}

.price {
  font-size: 22px;
  font-weight: bold;
  color: red;
}

.note {
  font-size: 14px;
  color: gray;
  margin-bottom: 15px;
}

/* Vùng chọn size */
.size-options p {
  font-weight: bold;
  margin-bottom: 8px;
}

.size-buttons {
  display: flex;
  gap: 10px;
}

.size-buttons button {
  width: 40px;
  height: 40px;
  border: 1px solid gray;
  border-radius: 50%;
  background: white;
  color: black;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.size-buttons button.selected {
  background-color: #b71c1c;
  color: white;
  font-weight: bold;
  border: none;
}

.size-buttons button:hover {
  background-color: #e57373;
  color: white;
}

/* Nút bấm số lượng */
.add-to-cart {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.add-to-cart button {
  height: 40px;
  border: none;
  background: #f5f5f5;
  color: black;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.3s;
}

.add-to-cart button:hover {
  background: #e0e0e0;
}

.quantity {
  font-size: 18px;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

/* Nút "Thêm vào giỏ hàng" */
.cart-btn {
  background-color: #b71c1c;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  padding: 5px 50px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.cart-btn:hover {
  background-color: #d32f2f;
}

/* Nút tư vấn */
.contact-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.contact-buttons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: 1px solid gray;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.contact-buttons a img {
  width: 30px;
  height: 30px;
}

.contact-buttons a:hover {
  background: #e0e0e0;
}

/* Tabs (Mô tả, Bình luận, Đánh giá) */
.product-tabs {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 20px;
  border-bottom: 2px solid #e0e0e0;
  position: relative;
}

.tab-button {
  width: 30%;
  font-size: 16px;
  color: gray;
  padding: 10px;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease-in-out;

  /* Căn giữa nội dung */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.tab-button.active {
  color: black;
  font-weight: bold;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background-color: black;
}

/* Loading */
.loading {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}
.size-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
}

.stock-info {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.user-home-text {
  color: black;
  font-weight: bold;
}
.type-text {
  color: rgb(64, 64, 64);
  font-weight: bold;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: gray;
}
.favorited {
  color: red;
}
</style>

