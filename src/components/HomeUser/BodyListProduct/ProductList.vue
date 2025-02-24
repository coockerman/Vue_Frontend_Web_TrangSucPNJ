<template>
  <div class="product-container">
    <!-- Tiêu đề danh mục -->
    <h2 class="category-title">{{ category }}</h2>

    <!-- Thanh thông tin danh sách -->
    <div class="product-header">
      <span>Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ products.length }} Products</span>
      <span>
        Sort by:
        <select v-model="sortBy" @change="sortProducts">
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

const props = defineProps({
  products: Array,
  category: String,
})

// Phân trang
const itemsPerPage = 9
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(props.products.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, props.products.length))

const paginatedProducts = computed(() => props.products.slice(startIndex.value, endIndex.value))

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const prevPage = () => changePage(currentPage.value - 1)
const nextPage = () => changePage(currentPage.value + 1)

// Sắp xếp sản phẩm
const sortBy = ref('popular')

const sortProducts = () => {
  if (sortBy.value === 'priceLow') {
    props.products.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'priceHigh') {
    props.products.sort((a, b) => b.price - a.price)
  }
}
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
