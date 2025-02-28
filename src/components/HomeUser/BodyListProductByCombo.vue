<template>
  <div class="productPage">
    <nav class="breadcrumb">
      <router-link to="/user-home">Home</router-link>
      <span> > </span>
      <span>Combo</span>
    </nav>
    <div class="imgCollection">
      <img :src="urlImage" alt="PNJ Banner" class="banner-img" />
    </div>
    <div class="product-list">
      <ProductList :products="products" :category="collectionName" :itemsPerPage="3" />
    </div>
  </div>
  <Footer />
</template>
    
  <script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ProductList from '@/components/HomeUser/BodyListProduct/ProductList.vue'
import Footer from '@/components/HomeUser/BodyHomeUser/FooterForm.vue'

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
      `http://localhost:5121/api/collections/detail/${collectionId.value}`
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
      'http://localhost:5121/api/products/list-by-ids',
      productIds
    )

    // 3️⃣ Chuẩn hóa dữ liệu sản phẩm
    products.value = productsResponse.data.map((product) => ({
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
        : [], // 🔹 Đảm bảo chỉ lấy ID nếu là mảng đối tượng
      material: product.material || 'Không xác định',
      karat: product.karat || 'Không có',
      gender: product.gender || 'Unisex',
      image:
        Array.isArray(product.productImg) && product.productImg.length > 0
          ? product.productImg[0]
          : '/src/assets/Img/Logo.png',
    }))
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm từ bộ sưu tập:', error)
  }
}

// Gọi API khi component được mount
onMounted(() => {
  window.scrollTo(0, 0)
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
  background-color: rgb(248, 227, 170);
}

.imgCollection {
  width: 100%;
  display: flex;
  justify-content: center; /* Căn giữa ảnh */
}

.banner-img {
  width: 80%; /* Chiều ngang luôn đầy đủ */
  height: 300px; /* Cố định chiều cao (tuỳ chỉnh theo nhu cầu) */
  object-fit: cover; /* Cắt ảnh để vừa khung mà không méo */
  object-position: center; /* Giữ trọng tâm của ảnh */
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

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-top: 15px;
  width: 80%; /* Đảm bảo breadcrumb trải dài toàn bộ chiều ngang */
  justify-content: flex-start; /* Căn về bên trái */
  padding-left: 5px; /* Tạo khoảng cách với mép trái */
  font-family: 'Inter', sans-serif;
}

.breadcrumb a {
  text-decoration: none;
  color: rgb(20, 20, 20);
  font-weight: bold;
}

.breadcrumb span {
  margin: 0 5px;
  color: gray;
}

.breadcrumb a:hover {
  text-decoration: underline;
}
</style>
  
    