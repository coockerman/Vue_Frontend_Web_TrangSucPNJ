<template>
  <div class="product-page">
    <div class="sidebar">
      <FilterSidebar @updateFilters="applyFilters" />
    </div>
    <div class="product-list">
      <ProductList :products="filteredProducts" :category="route.query.type || 'Tất cả sản phẩm'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import FilterSidebar from '@/components/HomeUser/BodyListProduct/FilterSidebar.vue'
import ProductList from '@/components/HomeUser/BodyListProduct/ProductList.vue'

const route = useRoute()

const allProducts = ref([])
const filteredProducts = ref([])
const activeFilters = ref({
  price: 354299000,
  material: 'all',
  karat: 'all',
  gender: 'all',
})

// Hàm lấy danh sách sản phẩm theo type
const fetchProductsByType = async (type) => {
  try {
    const response = await axios.get(`https://localhost:7241/api/products/by-type/${type}`)
    return response.data.map((product) => ({
      id: product.id,
      name: product.nameProduct,
      price: product.sizePrice.length > 0 ? product.sizePrice[0].price : 0,
      rating:
        product.listEvaluation.length > 0
          ? product.listEvaluation.reduce((sum, e) => sum + e.rating, 0) /
            product.listEvaluation.length
          : 0,
      material: product.material,
      karat: product.karat,
      gender: product.gender,
      image: product.productImg.length > 0 ? product.productImg[0] : '/src/assets/Img/Logo.png',
    }))
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm theo loại:', error)
    return []
  }
}

// Gọi API khi component được mount hoặc type thay đổi
const fetchProducts = async () => {
  const type = route.query.type || 'all'
  allProducts.value = await fetchProductsByType(type)
  filteredProducts.value = allProducts.value
}

onMounted(fetchProducts)
watch(() => route.query.type, fetchProducts) // Theo dõi nếu type thay đổi

// Áp dụng bộ lọc khi người dùng tìm kiếm
const applyFilters = (filters) => {
  activeFilters.value = filters
  filteredProducts.value = allProducts.value.filter(
    (p) =>
      (filters.material === 'all' || p.material === filters.material) &&
      (filters.karat === 'all' || p.karat === filters.karat) &&
      (filters.gender === 'all' || p.gender === filters.gender) &&
      p.price <= filters.price
  )
}
</script>

<style scoped>
.product-page {
  display: flex;
  gap: 10px;
  max-width: 1000px;
  margin: 0 auto;
}

.sidebar {
  width: 25%;
}
</style>
