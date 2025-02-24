<template>
  <div class="productPage">
    <div class="imgCollection">
      <img :src="urlImage" alt="PNJ Banner" class="banner-img" />
    </div>
    <div class="product-list">
      <ProductList :products="products" :category="collectionName" />
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ProductList from '@/components/HomeUser/BodyListProduct/ProductList.vue'

const route = useRoute()
const collectionId = ref(route.query.id || '') // Lấy ID bộ sưu tập từ query
const products = ref([])
const collectionName = ref('') // Thêm biến để lưu tên bộ sưu tập
const urlImage = ref('')

const fetchProductsByCollection = async () => {
  if (!collectionId.value) {
    console.warn('Không có collection ID!')
    return
  }

  try {
    // 1️⃣ Gọi API lấy danh sách sản phẩm từ bộ sưu tập
    const collectionResponse = await axios.get(
      `https://localhost:7241/api/collections/detail/${collectionId.value}`
    )
    urlImage.value = collectionResponse.data.urlImage
    collectionName.value = collectionResponse.data.name // Lưu tên bộ sưu tập
    const productIds = collectionResponse.data.listProduct // Mảng ID sản phẩm

    if (!productIds || productIds.length === 0) {
      console.warn('Không có sản phẩm nào trong bộ sưu tập:', collectionId.value)
      return
    }

    // 2️⃣ Gọi API lấy chi tiết sản phẩm theo list ID
    const productsResponse = await axios.post(
      'https://localhost:7241/api/products/list-by-ids',
      productIds
    )

    // 3️⃣ Chuẩn hóa dữ liệu sản phẩm
    products.value = productsResponse.data.map((product) => ({
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
    console.error('Lỗi khi lấy sản phẩm từ bộ sưu tập:', error)
  }
}

// Gọi API khi component được mount
onMounted(() => {
  fetchProductsByCollection()
})
</script>

  
<style scoped>
.productPage {
  display: flex;
  flex-direction: column;
  align-items: center; /* Căn giữa theo chiều ngang */
  gap: 20px;
  max-width: 100%; /* Giới hạn chiều rộng */
  margin: 0 auto; /* Căn giữa theo chiều ngang */
  padding: 0px 50px; /* Cách hai bên một khoảng nhỏ */
  background-color: rgb(252, 199, 218);
}

.imgCollection {
  width: 100%;
  display: flex;
  justify-content: center; /* Căn giữa ảnh */
}

.banner-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-list {
  width: 100%;
  max-width: 1000px; /* Giới hạn chiều rộng tối đa */
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Căn giữa danh sách sản phẩm */
  gap: 15px; /* Khoảng cách giữa các sản phẩm */
  font-family: 'Inter', sans-serif;
}
</style>

  