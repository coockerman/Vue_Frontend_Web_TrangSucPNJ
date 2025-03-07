<template>
  <div class="container">
    <h2 class="title">Danh sách sản phẩm đã mua</h2>

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
      userId: localStorage.getItem('uid'), // Thay thế bằng ID của người dùng hiện tại
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
      // Gọi API lấy danh sách ID sản phẩm đã mua
      const purchasedResponse = await axios.get(
        `http://localhost:5121/api/users/${this.userId}/purchased`
      )
      const productIds = Object.values(purchasedResponse.data)

      if (productIds.length > 0) {
        // Gọi API lấy thông tin chi tiết sản phẩm theo danh sách ID
        const productResponse = await axios.post(
          'http://localhost:5121/api/products/list-by-ids',
          productIds
        )
        this.products = productResponse.data
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm đã mua:', error)
    } finally {
      this.loading = false
    }
  },
}
</script>
  
<style scoped>
/* Căn giữa danh sách, mở rộng 2 bên */
.container {
  max-width: 800px; /* Tăng chiều rộng để tạo khoảng cách hai bên */
  margin: 0 auto;
  margin-bottom: 30px;
  padding: 0 50px;
}

/* Tiêu đề */
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

/* Hiển thị khi đang tải */
.loading {
  color: gray;
  text-align: center;
}

/* Thông báo khi không có sản phẩm */
.no-products {
  color: red;
  text-align: center;
}

/* Hiển thị sản phẩm theo từng hàng */
.product-list {
  display: flex;
  flex-direction: column; /* Hiển thị theo cột */
  gap: 20px; /* Khoảng cách giữa các sản phẩm */
}

/* Item sản phẩm */
.product-item {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  background: #fff;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}

/* Hover hiệu ứng */
.product-item:hover {
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2);
}

/* Ảnh sản phẩm */
.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}

/* Chi tiết sản phẩm */
.product-details {
  flex-grow: 1;
}

/* Tên sản phẩm */
.product-name {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
}

/* Thông tin sản phẩm */
.product-info {
  color: #555;
  font-size: 14px;
}
</style>
  