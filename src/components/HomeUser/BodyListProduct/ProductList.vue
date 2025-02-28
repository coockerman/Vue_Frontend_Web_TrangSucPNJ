<template>
  <div class="product-container">
    <!-- Tiêu đề danh mục -->
    <h2 class="category-title">{{ category }}</h2>

    <!-- Thanh thông tin danh sách -->
    <div class="product-header">
      <span
        >Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ validProducts.length }} Products</span
      >
      <span>
        Sort by:
        <select v-model="sortBy">
          <option value="popular">Most Popular</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </span>
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="product-list">
      <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" />
    </div>

    <!-- Phân trang -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="prevPage">← Previous</button>
      <span
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </span>
      <button :disabled="currentPage === totalPages" @click="nextPage">Next →</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import ProductCard from '@/components/HomeUser/BodyListProduct/ProductCard.vue'

// Định nghĩa props
const props = defineProps({
  products: Array,
  category: String,
  itemsPerPage: {
    type: Number,
    default: 6, // Mặc định hiển thị 6 sản phẩm trên mỗi trang
  },
})

// Đảm bảo dữ liệu hợp lệ
const validProducts = computed(() => (Array.isArray(props.products) ? props.products : []))

// Biến lưu trạng thái trang hiện tại
const currentPage = ref(1)

// Tính tổng số trang
const totalPages = computed(() => Math.ceil(validProducts.value.length / props.itemsPerPage))

// Xác định chỉ mục bắt đầu và kết thúc của danh sách sản phẩm hiển thị trên trang hiện tại
const startIndex = computed(() => (currentPage.value - 1) * props.itemsPerPage)
const endIndex = computed(() =>
  Math.min(startIndex.value + props.itemsPerPage, validProducts.value.length)
)

// Trạng thái sắp xếp
const sortBy = ref('popular')

// Hàm trả về danh sách sản phẩm đã sắp xếp
const sortedProducts = computed(() => {
  let sorted = [...validProducts.value] // Tạo bản sao để không sửa props trực tiếp
  if (sortBy.value === 'priceLow') {
    sorted.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'priceHigh') {
    sorted.sort((a, b) => b.price - a.price)
  }
  return sorted
})

// Lọc sản phẩm theo trang
const paginatedProducts = computed(() =>
  sortedProducts.value.slice(startIndex.value, endIndex.value)
)

// Chuyển trang
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
const prevPage = () => changePage(currentPage.value - 1)
const nextPage = () => changePage(currentPage.value + 1)
</script>

<style scoped>
.product-container {
  padding: 20px;
}

.category-title {
  font-size: 24px;
  font-weight: bold;
}

.product-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3, 2fr);
  gap: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination span {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
}

.pagination span.active {
  background-color: black;
  color: white;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
