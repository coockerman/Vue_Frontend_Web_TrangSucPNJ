<template>
  <div class="product-page">
    <div class="sidebar">
      <FilterSidebar @updateFilters="updateFilters" />
    </div>
    <div class="product-list">
      <ProductList :products="filteredProducts" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import FilterSidebar from '@/components/HomeUser/BodyListProduct/FilterSidebar.vue'
import ProductList from '@/components/HomeUser/BodyListProduct/ProductList.vue'

const allProducts = ref([])
const filteredProducts = ref([])

// Hàm lấy dữ liệu từ API
const fetchProducts = async () => {
  try {
    const response = await axios.get('https://localhost:7241/api/products/all')

    // Chuyển đổi dữ liệu từ API sang đúng format cần dùng
    allProducts.value = response.data.map((product) => ({
      id: product.id,
      name: product.nameProduct,
      price: product.sizePrice.length > 0 ? product.sizePrice[0].price : 0, // Lấy giá của size đầu tiên
      oldPrice: null, // Nếu có oldPrice thì cần cập nhật lại
      rating:
        product.listEvaluation.length > 0
          ? product.listEvaluation.reduce((sum, e) => sum + e.rating, 0) /
            product.listEvaluation.length
          : 0, // Tính trung bình rating
      material: product.material,
      image: product.productImg.length > 0 ? product.productImg[0] : '/src/assets/Img/Logo.png',
    }))

    filteredProducts.value = allProducts.value // Gán dữ liệu ban đầu
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ API:', error)
  }
}

// Gọi API khi component được tạo
onMounted(fetchProducts)

const updateFilters = (filters) => {
  filteredProducts.value = allProducts.value.filter(
    (p) => p.material === filters.material || filters.material === 'all'
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
  width: 20%;
}
</style>
