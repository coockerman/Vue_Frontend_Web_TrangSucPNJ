<template>
  <div class="pageMain">
    <div class="product-page">
      <div class="sidebar">
        <FilterSidebar @updateFilters="applyFilters" />
      </div>
      <div class="product-list">
        <ProductList
          :products="filteredProducts"
          :category="route.query.type || 'Tất cả sản phẩm'"
          :itemsPerPage="route.query.type ? 6 : 12"
        />
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Footer from '@/components/HomeUser/BodyHomeUser/FooterForm.vue'
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

const fetchProductsByType = async (type) => {
  try {
    const response = await axios.get(`http://localhost:5121/api/products/by-type/${type}`)

    return response.data
      .filter((product) => product.show !== 'false') // 🔹 Lọc bỏ sản phẩm có show = 'false'
      .map((product) => {
        console.log('📌 Kiểm tra listEvaluation:', product.listEvaluation)

        return {
          id: product.id || null,
          nameProduct: product.nameProduct || 'Sản phẩm chưa có tên',
          price:
            Array.isArray(product.sizePrice) && product.sizePrice.length > 0
              ? product.sizePrice[0].price
              : 0,
          oldPrice: product.oldPrice || null,
          discount: product.discount || 0,
          listEvaluationIds: Array.isArray(product.listEvaluation)
            ? product.listEvaluation.map((ev) => (typeof ev === 'string' ? ev : ev.id))
            : [],
          material: product.material || 'Không xác định',
          karat: product.karat || 'Không có',
          gender: product.gender || 'Unisex',
          image:
            Array.isArray(product.productImg) && product.productImg.length > 0
              ? product.productImg[0]
              : '/src/assets/Img/Logo.png',
        }
      })
  } catch (error) {
    console.error('❌ Lỗi khi lấy sản phẩm theo loại:', error)
    return []
  }
}

const fetchProducts = async () => {
  const type = route.query.type || null // Nếu không có type, đặt là null

  if (type) {
    allProducts.value = await fetchProductsByType(type)
  } else {
    try {
      const response = await axios.get('http://localhost:5121/api/products/all')
      allProducts.value = response.data
        .filter((product) => product.show !== 'false')
        .map((product) => ({
          id: product.id || null,
          nameProduct: product.nameProduct || 'Sản phẩm chưa có tên',
          price:
            Array.isArray(product.sizePrice) && product.sizePrice.length > 0
              ? product.sizePrice[0].price
              : 0,
          oldPrice: product.oldPrice || null,
          discount: product.discount || 0,
          listEvaluationIds: Array.isArray(product.listEvaluation)
            ? product.listEvaluation.map((ev) => (typeof ev === 'string' ? ev : ev.id))
            : [],
          material: product.material || 'Không xác định',
          karat: product.karat || 'Không có',
          gender: product.gender || 'Unisex',
          image:
            Array.isArray(product.productImg) && product.productImg.length > 0
              ? product.productImg[0]
              : '/src/assets/Img/Logo.png',
        }))
    } catch (error) {
      console.error('❌ Lỗi khi lấy tất cả sản phẩm:', error)
      allProducts.value = []
    }
  }

  filteredProducts.value = allProducts.value
}

onMounted(() => {
  fetchProducts()
  window.scrollTo(0, 0)
})
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
