<template>
  <div class="cart-container">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <router-link to="/user-home">Home</router-link>
      <span> > </span>
      <span>Giỏ hàng</span>
    </nav>

    <h1 class="cart-title">Giỏ hàng của bạn</h1>

    <div class="cart-content">
      <!-- Bên trái: Danh sách sản phẩm -->
      <div class="cart-items">
        <div v-if="cartItems.length > 0">
          <div v-for="item in cartItems" :key="item.idProduct" class="cart-item">
            <div v-if="products[item.idProduct]" class="cart-item-info">
              <!-- Ảnh sản phẩm -->
              <img :src="products[item.idProduct].productImg[0]" class="cart-item-image" />

              <!-- Thông tin sản phẩm -->
              <div class="cart-item-details">
                <h3 class="text-lg font-semibold">{{ products[item.idProduct].nameProduct }}</h3>
                <p class="text-gray-600 text-sm">Size: {{ item.size }}</p>
                <p class="text-gray-600 text-sm">Karat: {{ products[item.idProduct].karat }}</p>
                <p class="text-red-500 font-bold text-xl">
                  {{ formatPrice(getPrice(products[item.idProduct], item.size)) }}đ
                </p>
              </div>
            </div>

            <!-- Điều chỉnh số lượng + Nút xóa -->
            <div class="cart-item-actions">
              <button @click="decreaseQuantity(item)" class="quantity-btn">−</button>
              <span class="text-lg font-semibold">{{ item.stock }}</span>
              <button @click="increaseQuantity(item)" class="quantity-btn">+</button>

              <button @click="removeFromCart(item)" class="remove-btn">🗑</button>
            </div>
          </div>
        </div>

        <div v-else class="cart-empty">Giỏ hàng của bạn đang trống.</div>
      </div>

      <!-- Bên phải: Thông tin đơn hàng -->
      <div class="cart-summary">
        <h2 class="summary-title">Tóm tắt đơn hàng</h2>
        <div class="summary-item">
          <span>Tổng giá trị</span>
          <span class="summary-price">{{ formatPrice(totalPrice) }}đ</span>
        </div>
        <div class="summary-item">
          <span>Phí vận chuyển</span>
          <span class="summary-price">Miễn phí</span>
        </div>
        <div class="summary-item summary-total">
          <span>Tổng cộng</span>
          <span>{{ formatPrice(totalPrice) }}đ</span>
        </div>

        <!-- Nhập mã giảm giá -->
        <div class="promo-code">
          <input type="text" placeholder="Nhập mã giảm giá" />
          <button>Áp dụng</button>
        </div>

        <!-- Nút Thanh toán -->
        <router-link class="text-normal" :to="'/user-home/payment'">
          <button class="checkout-btn">Thanh toán ngay →</button></router-link
        >
      </div>
    </div>
  </div>
  <Footer />
</template>
  
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Footer from '@/components/HomeUser/BodyHomeUser/FooterForm.vue'

const cartItems = ref([])
const products = ref({})

// Lấy giỏ hàng từ API
const fetchCart = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5121/api/users/${localStorage.getItem('uid')}/shopping-cart`
    )
    cartItems.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Lỗi lấy giỏ hàng:', error)
  }
}

// Lấy thông tin sản phẩm
const fetchProduct = async (idProduct) => {
  if (!products.value[idProduct]) {
    try {
      const response = await axios.get(`http://localhost:5121/api/products/detail/${idProduct}`)
      products.value[idProduct] = response.data
    } catch (error) {
      console.error(`Lỗi lấy sản phẩm ${idProduct}:`, error)
    }
  }
}
const updateProductShoppingCart = async (idCart, idProduct, size, stock) => {
  try {
    const updateData = {
      id: idCart,
      idProduct: idProduct,
      size: size,
      stock: stock,
    }
    console.log('Sending data:', updateData)
    const link = `http://localhost:5121/api/users/${localStorage.getItem(
      'uid'
    )}/shopping-cart/update/${idCart}`
    console.log(link)
    const response = await fetch(link, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })
    if (!response.ok) throw new Error('Lỗi khi cập nhật dữ liệu')

    alert('Cập nhật thành công!')
  } catch (error) {
    console.error(error)
    alert('Có lỗi xảy ra, vui lòng thử lại.')
  }
}
const deleteProductShoppingCart = async (idCart, size) => {
  try {
    const link = `http://localhost:5121/api/users/${localStorage.getItem(
      'uid'
    )}/shopping-cart/remove/${idCart}/${size}`

    const response = await fetch(link, { method: 'DELETE' })

    if (!response.ok) throw new Error('Lỗi khi xoá dữ liệu')
  } catch (error) {
    console.error(error)
    alert('Có lỗi xảy ra, vui lòng thử lại.')
  }
}

// Gọi API khi load trang
onMounted(async () => {
  await fetchCart()
  cartItems.value.forEach((item) => fetchProduct(item.idProduct))
})

// Tính giá theo size
const getPrice = (product, size) => {
  return product?.sizePrice?.find((sp) => sp.size === size)?.price || 0
}

// Định dạng giá tiền
const formatPrice = (price) => {
  return price.toLocaleString('vi-VN')
}

// Tăng số lượng
let timeoutId = null

const increaseQuantity = (item) => {
  item.stock++
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    updateProductShoppingCart(item.id, item.idProduct, item.size, item.stock)
  }, 500)
}

const decreaseQuantity = (item) => {
  if (item.stock > 1) {
    item.stock--
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      updateProductShoppingCart(item.id, item.idProduct, item.size, item.stock)
    }, 500)
  }
}

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = (item) => {
  cartItems.value = cartItems.value.filter((cartItem) => cartItem !== item)
  deleteProductShoppingCart(item.id, item.size)
}

// Tổng tiền giỏ hàng
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    const product = products.value[item.idProduct]
    return total + getPrice(product, item.size) * item.stock
  }, 0)
})
</script>
  
  <style scoped>
.cart-container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: left;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 768px) {
  .cart-content {
    flex-direction: row;
  }
}

.cart-items {
  flex: 2;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: flex;
  align-items: center; /* Canh giữa theo chiều dọc */
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #ddd; /* Viền ngăn cách từng item */
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  background-color: #efefef;
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-info {
  display: flex; /* Xếp ảnh và nội dung theo hàng ngang */
  align-items: center; /* Canh giữa theo chiều dọc */
  flex: 1; /* Cho phép phần này mở rộng */
  gap: 15px; /* Tạo khoảng cách giữa ảnh và nội dung */
}

.cart-item-name {
  font-size: 1rem;
  font-weight: bold;
}

.cart-item-desc {
  color: gray;
  font-size: 0.9rem;
}

.cart-item-price {
  color: red;
  font-weight: bold;
  font-size: 1.2rem;
}
.cart-item-details {
  display: flex;
  flex-direction: column; /* Sắp xếp text theo chiều dọc */
  gap: 5px; /* Khoảng cách giữa các dòng chữ */
}
.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-item-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  background: white;
}

.cart-item-controls button:hover {
  background: #f0f0f0;
}

.cart-item-quantity {
  font-size: 1rem;
  font-weight: bold;
}

.cart-item-remove {
  color: red;
  font-size: 1.2rem;
  cursor: pointer;
}

.cart-empty {
  text-align: center;
  color: gray;
  font-size: 1rem;
}

.cart-summary {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.summary-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
}
.quantity-btn {
  margin: 3px 6px;
}
.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.summary-price {
  font-weight: bold;
}

.summary-total {
  font-size: 1.2rem;
}

.promo-code {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.promo-code input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.promo-code button {
  padding: 10px 15px;
  background: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.promo-code button:hover {
  background: darkred;
}

.checkout-btn {
  width: 100%;
  background: red;
  color: white;
  padding: 12px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
  border: none;
}

.checkout-btn:hover {
  background: darkred;
}
.remove-btn {
  background: none;
  border: none;
  color: #ff4d4d; /* Màu đỏ nổi bật */
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
}

.remove-btn:hover {
  color: #d63031; /* Màu đỏ đậm hơn khi hover */
  transform: scale(1.2); /* Hiệu ứng phóng to nhẹ khi hover */
}

.remove-btn:active {
  transform: scale(1); /* Quay về kích thước bình thường khi bấm */
}
.text-lg {
  font-size: 1.15rem; /* Kích thước lớn hơn mặc định (20px) */
  font-weight: bold; /* Chữ in đậm */
}
.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-top: 15px;
  width: 80%; /* Đảm bảo breadcrumb trải dài toàn bộ chiều ngang */
  justify-content: flex-start; /* Căn về bên trái */
  padding-left: 5px; /* Tạo khoảng cách với mép trái */
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
  