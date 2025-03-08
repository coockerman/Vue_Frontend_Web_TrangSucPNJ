<template>
  <div class="container">
    <h2 class="title">Sản phẩm yêu thích</h2>

    <div v-if="loading" class="loading">Đang tải...</div>

    <div v-else-if="products.length === 0" class="no-products">Không có sản phẩm nào.</div>

    <div v-else class="product-list">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-item"
        @click="goToProductDetail(product.id)"
      >
        <img :src="product.productImg[0]" alt="Sản phẩm" class="product-img" />
        <div class="product-details">
          <h3 class="product-name">{{ product.nameProduct }}</h3>
          <p class="product-info">Loại: {{ product.type }}</p>
          <p class="product-info">Giới tính: {{ product.gender }}</p>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
  
  <script>
import axios from 'axios'
import Footer from '@/components/HomeUser/BodyHomeUser/FooterForm.vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    Footer,
  },
  data() {
    return {
      userId: localStorage.getItem('uid'),
      products: [],
      loading: true,
    }
  },
  methods: {
    goToProductDetail(idProduct) {
      console.log(idProduct) // Kiểm tra ID trước khi chuyển trang
      this.$router.push({
        name: 'productDetail',
        query: { id: idProduct },
      })
    },
  },
  async created() {
    try {
      // Gọi API lấy danh sách ID sản phẩm yêu thích
      const favoriteResponse = await axios.get(
        `http://localhost:5121/api/users/${this.userId}/favourites`
      )
      const productIds = Object.values(favoriteResponse.data)

      if (productIds.length > 0) {
        // Gọi API lấy thông tin chi tiết sản phẩm theo danh sách ID
        const productResponse = await axios.post(
          'http://localhost:5121/api/products/list-by-ids',
          productIds
        )
        this.products = productResponse.data
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm yêu thích:', error)
    } finally {
      this.loading = false
    }
  },
}
</script>
  
  <style scoped>
/* Căn giữa danh sách, mở rộng 2 bên */
/* Căn giữa danh sách, mở rộng 2 bên */
.container {
  max-width: 850px;
  margin: 0 auto;
  margin-bottom: 40px;
  padding: 20px;
  background-color: #f9f9f9; /* Màu nền nhẹ hơn */
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề */
.title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 25px;
  text-align: center;
  color: #333;
}

/* Hiển thị khi đang tải */
.loading {
  color: #666;
  font-style: italic;
  text-align: center;
}

/* Thông báo khi không có sản phẩm */
.no-products {
  color: #d9534f;
  font-weight: bold;
  text-align: center;
}

/* Hiển thị sản phẩm theo từng hàng */
.product-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Item sản phẩm */
.product-item {
  display: flex;
  align-items: center;
  border: 2px solid #ccc; /* Viền rõ hơn */
  border-radius: 12px;
  padding: 18px;
  background: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* Hover hiệu ứng */
.product-item:hover {
  transform: scale(1.03);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Ảnh sản phẩm */
.product-img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #ddd;
  margin-right: 18px;
}

/* Chi tiết sản phẩm */
.product-details {
  flex-grow: 1;
}

/* Tên sản phẩm */
.product-name {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 8px;
  color: #222;
}

/* Thông tin sản phẩm */
.product-info {
  color: #555;
  font-size: 15px;
  font-style: italic;
}
</style>
  