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
import { ref } from 'vue'
import FilterSidebar from '@/components/HomeUser/BodyListProduct/FilterSidebar.vue'
import ProductList from '@/components/HomeUser/BodyListProduct/ProductList.vue'

const allProducts = ref([
  {
    id: 1,
    name: 'Nhẫn Vàng Trắng Ý 24K Đính',
    price: 10999999,
    oldPrice: null,
    rating: 3.5,
    material: 'gold',
    image: '/src/assets/Img/Logo.png',
  },
  {
    id: 2,
    name: 'Nhẫn Vàng Trắng Tipping 24K',
    price: 31500000,
    oldPrice: null,
    rating: 4.5,
    material: 'gold',
    image: '/src/assets/Img/Logo.png',
  },
  {
    id: 3,
    name: 'Nhẫn Vàng Trắng 24K Striped',
    price: 40295000,
    oldPrice: 21000000,
    discount: 30,
    rating: 5.0,
    material: 'gold',
    image: '/src/assets/Img/Logo.png',
  },
  {
    id: 4,
    name: 'Nhẫn Vàng Trắng Ý 24K Đính',
    price: 27295000,
    oldPrice: 21000000,
    discount: 30,
    rating: 3.5,
    material: 'gold',
    image: '/src/assets/Img/Logo.png',
  },
  {
    id: 5,
    name: 'Nhẫn Vàng Trắng Ý 24K Đính',
    price: 15500000,
    oldPrice: null,
    rating: 4.5,
    material: 'gold',
    image: '/src/assets/Img/Logo.png',
  },
  {
    id: 6,
    name: 'Nhẫn Vàng Trắng 24K Đính',
    price: 250295000,
    oldPrice: 210000000,
    discount: 30,
    rating: 4.5,
    material: 'gold',
    image: '/src/assets/Img/Logo.png',
  },
  {
    id: 7,
    name: 'Nhẫn Vàng Trắng Ý 24K',
    price: 20295000,
    oldPrice: null,
    rating: 5.0,
    material: 'gold',
    image: '/src/assets/Img/Logo.png',
  },
  {
    id: 8,
    name: 'Nhẫn Vàng Trắng Ý 24K',
    price: 35500000,
    oldPrice: null,
    rating: 4.0,
    material: 'gold',
    image: '/src/assets/Img/Logo.png',
  },
  {
    id: 9,
    name: 'Nhẫn Vàng Trắng Ý 24K Đính',
    price: 29500000,
    oldPrice: null,
    rating: 3.0,
    material: 'gold',
    image: '/src/assets/Img/Logo.png',
  },
])

const filteredProducts = ref(allProducts.value)

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
  max-width: 1000px; /* Giới hạn chiều rộng để không tràn màn hình */
  margin: 0 auto; /* Căn giữa trang */
}

.sidebar {
  width: 20%;
}
</style>