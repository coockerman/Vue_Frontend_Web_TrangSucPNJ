<template>
  <div class="checkout-container">
    <h2 class="title">Thông tin đặt hàng</h2>

    <!-- Danh sách sản phẩm trong giỏ hàng -->
    <div class="product-list" v-if="cartItems.length > 0">
      <div v-for="item in cartItems" :key="item.id" class="product-info">
        <img
          class="product-img"
          v-if="products[item.idProduct]"
          :src="products[item.idProduct].productImg[0]"
          alt="Product Image"
        />
        <div>
          <p class="product-name">{{ products[item.idProduct]?.nameProduct }}</p>
          <p class="product-code">Size: {{ item.size }}</p>
        </div>
        <p class="quantity">Số lượng: {{ item.stock }}</p>
        <p class="price">{{ formatPrice(getPrice(products[item.idProduct], item.size)) }}đ</p>
      </div>
    </div>

    <!-- Nhập mã ưu đãi -->
    <div class="discount-section">
      <input
        type="text"
        v-model="discountCode"
        placeholder="Chọn mã ưu đãi"
        readonly
        @click="openDiscountModal"
      />
      <button @click="openDiscountModal">Chọn</button>
    </div>

    <!-- Modal chọn mã giảm giá -->
    <div v-if="showDiscountModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Chọn mã ưu đãi</h3>
        <ul>
          <li
            v-for="discount in availableDiscounts"
            :key="discount.id"
            @click="selectDiscount(discount)"
          >
            <strong>{{ discount.code }}</strong> - Giảm {{ discount.value }} đ
          </li>
        </ul>
        <button @click="closeDiscountModal">Đóng</button>
      </div>
    </div>

    <!-- Tổng tiền -->
    <div class="summary">
      <p>
        Tạm tính: <span>{{ formatCurrency(subTotal) }} đ</span>
      </p>
      <p>Giao hàng: <span>Miễn phí</span></p>
      <p>
        Giảm giá: <span>- {{ formatCurrency(discount) }} đ</span>
      </p>
      <p class="total">
        Tổng tiền: <span>{{ formatCurrency(totalPrice) }} đ</span>
      </p>
    </div>

    <!-- Phương thức nhận hàng -->
    <div class="delivery-options">
      <button :class="{ active: deliveryMethod === 'home' }" @click="setDeliveryMethod('home')">
        🚚 Giao hàng tận nơi
      </button>
      <button :class="{ active: deliveryMethod === 'store' }" @click="setDeliveryMethod('store')">
        🏬 Nhận tại cửa hàng
      </button>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const cartItems = ref([])
const products = ref({})
const discountCode = ref('')
const showDiscountModal = ref(false)
const discount = ref(0)
const deliveryMethod = ref('home')

// Danh sách mã giảm giá (giả lập)
const availableDiscounts = ref([
  { id: 1, code: 'SALE50', value: 50000 },
  { id: 2, code: 'FREESHIP', value: 30000 },
  { id: 3, code: 'VIP100', value: 100000 },
])

const openDiscountModal = () => {
  showDiscountModal.value = true
}

const closeDiscountModal = () => {
  showDiscountModal.value = false
}

const selectDiscount = (disc) => {
  discount.value = disc.value
  discountCode.value = disc.code
  closeDiscountModal()
}

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
// Tính giá theo size
const getPrice = (product, size) => {
  return product?.sizePrice?.find((sp) => sp.size === size)?.price || 0
}
// Định dạng giá tiền
const formatPrice = (price) => {
  return price.toLocaleString('vi-VN')
}
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

const subTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    const product = products.value[item.idProduct]
    return total + getPrice(product, item.size) * item.stock
  }, 0)
})

const totalPrice = computed(() => {
  return (
    cartItems.value.reduce((total, item) => {
      const product = products.value[item.idProduct]
      return total + getPrice(product, item.size) * item.stock
    }, 0) - discount.value
  )
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value)
}

const setDeliveryMethod = (method) => {
  deliveryMethod.value = method
}

onMounted(async () => {
  await fetchCart()
  cartItems.value.forEach((item) => fetchProduct(item.idProduct))
})
</script>
  
  
  <style scoped>
.checkout-container {
  width: 800px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background: white;
}

.title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.product-info {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.product-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
}

.product-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-code {
  font-size: 14px;
  color: gray;
}

.quantity,
.price {
  text-align: right;
  font-weight: bold;
}

.price {
  color: #d32f2f;
}

.quantity-selector {
  display: flex;
  align-items: center;
}

.quantity-selector button {
  width: 30px;
  height: 30px;
  border: none;
  background: #ddd;
  cursor: pointer;
}

.quantity-selector input {
  width: 40px;
  text-align: center;
  border: none;
}

.discount-section {
  display: flex;
  margin-bottom: 10px;
}

.discount-section input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ddd;
}

.discount-section button {
  background: #333;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.summary p {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}

.summary .total {
  font-weight: bold;
  font-size: 18px;
  color: #d32f2f;
}

.buyer-info {
  margin: 10px 0;
}

.buyer-info input {
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 8px;
  border: 1px solid #ddd;
}

.delivery-options {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.delivery-options button {
  flex: 1;
  padding: 10px;
  border: none;
  cursor: pointer;
  background: #f4f4f4;
}

.delivery-options .active {
  background: #d32f2f;
  color: white;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.modal-content ul {
  list-style: none;
  padding: 0;
}

.modal-content li {
  padding: 10px;
  border: 1px solid #ddd;
  margin: 5px 0;
  cursor: pointer;
}

.modal-content li:hover {
  background: #f4f4f4;
}

button {
  margin-top: 10px;
  padding: 8px 15px;
  border: none;
  background: #d32f2f;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}
</style>
  