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
        v-model="couponCode"
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
          <li v-for="coupon in availableDiscounts" :key="coupon.id" @click="selectDiscount(coupon)">
            <div v-if="coupon.stock > 0">
              <strong>{{ coupon.name }}</strong> - Giảm {{ coupon.discount }} đ
            </div>
          </li>
        </ul>
        <button @click="closeDiscountModal">Đóng</button>
      </div>
    </div>

    <!--User-->
    <div class="user-container">
      <h2>Thông tin người nhận hàng</h2>

      <div>
        <div class="form-group">
          <label>Họ và Tên: </label>
          <input v-model="nameUserGet" type="text" />
        </div>

        <div class="form-group">
          <label>Email thông báo: </label>
          <input v-model="emailUserGet" type="email" />
        </div>

        <div class="form-group">
          <label>Số điện thoại người nhận: </label>
          <input v-model="phoneUserGet" type="text" />
        </div>
      </div>
    </div>

    <!--Địa chỉ-->
    <div>
      <div class="address-selection">
        <button @click="showAddressModal = true">Chọn địa chỉ nhận hàng</button>
        <p v-if="selectedAddress">Địa chỉ đã chọn: {{ addressUserGet }}</p>
      </div>

      <!-- Modal hiển thị danh sách địa chỉ -->
      <div v-if="showAddressModal" class="modal">
        <div class="modal-content">
          <h3>Chọn địa chỉ</h3>
          <ul>
            <li v-for="address in addresses" :key="address.id" @click="selectAddress(address)">
              {{ address.street }}, {{ address.city }}, {{ address.country }}
            </li>
          </ul>
          <button @click="showAddressModal = false">Đóng</button>
        </div>
      </div>
    </div>

    <!-- Tổng tiền -->
    <div class="summary">
      <h2>Thanh toán</h2>
      <p>
        Tạm tính: <span>{{ formatCurrency(subTotal) }} đ</span>
      </p>
      <p>Giao hàng: <span>Miễn phí</span></p>
      <p>
        Giảm giá: <span>- {{ formatCurrency(coupon.discount) }} đ</span>
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

    <!-- Phương thức thanh toán -->
    <div class="checkout-container-payment">
      <!-- Đồng ý điều khoản -->
      <div class="agreement">
        <input type="checkbox" id="agreeTerms" v-model="agreeTerms" />
        <label for="agreeTerms">
          Tôi đồng ý cho PNJ thu thập, xử lý dữ liệu cá nhân của tôi theo quy định tại
          <a href="#">Thông báo này</a> và theo quy định của pháp luật
        </label>
      </div>

      <!-- Phương thức thanh toán -->
      <div v-if="deliveryMethod === 'home'" class="payment-methods">
        <h3>Phương thức thanh toán</h3>
        <div v-for="method in paymentMethods" :key="method.id" class="payment-option">
          <input type="radio" :id="method.id" v-model="selectedPayment" :value="method.id" />
          <label :for="method.id">
            <img v-if="method.icon" :src="method.icon" class="icon" />
            {{ method.name }}
            <span v-if="method.description" class="description">({{ method.description }})</span>
          </label>
        </div>
      </div>

      <!-- Ghi chú đơn hàng -->
      <div class="order-note">
        <h3>Ghi chú đơn hàng <span class="optional">(Không bắt buộc)</span></h3>
        <textarea
          v-model="orderNote"
          placeholder="*Vui lòng ghi chú thêm để PNJ có thể phục vụ bạn một cách tốt nhất."
        ></textarea>
      </div>

      <!-- Nút đặt hàng -->
      <button class="order-button" @click="placeOrder">Đặt hàng</button>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const cartItems = ref([])
const products = ref({})
const couponCode = ref('')

const user = ref({
  fullName: '',
  email: '',
  numberPhone: '',
})
const selectedAddress = ref(null)
const nameUserGet = ref('')
const emailUserGet = ref('')
const phoneUserGet = ref('')
const addressUserGet = ref('')

const showDiscountModal = ref(false)
const coupon = ref({
  id: '',
  discount: 0,
  name: '',
  stock: 0,
})
const deliveryMethod = ref('home')
const addresses = ref([])

const showAddressModal = ref(false)
const userId = localStorage.getItem('uid')

const agreeTerms = ref(false)
const selectedPayment = ref('cod')
const orderNote = ref('')

const paymentMethods = ref([
  { id: 'cod', name: 'Thanh toán tiền mặt khi nhận hàng (COD)', icon: 'cod-icon.png' },
  { id: 'bank', name: 'Thanh toán chuyển khoản', icon: 'bank-icon.png' },
  {
    id: 'visa',
    name: 'Thanh toán thẻ quốc tế',
    description: 'VISA, Master, JCB',
    icon: 'visa-icon.png',
  },
  { id: 'credit', name: 'Trả góp thẻ tín dụng 0%', icon: 'credit-icon.png' },
  { id: 'vnpay', name: 'Thanh toán VNPAY', icon: 'vnpay-icon.png' },
  { id: 'momo', name: 'Thanh toán bằng ví MoMo', icon: 'momo-icon.png' },
  { id: 'qr', name: 'Quét mã QR', icon: 'qr-icon.png' },
  { id: 'zalopay', name: 'Thanh toán Zalopay - QR đa năng', icon: 'zalopay-icon.png' },
])

// Danh sách mã giảm giá (giả lập)
const availableDiscounts = ref([])

const fetchCoupon = async () => {
  try {
    const response = await axios.get(`http://localhost:5121/api/coupons/all`)
    availableDiscounts.value = response.data.filter((coupon) => coupon.stock > 0)
  } catch (error) {
    console.error('Lỗi lấy mã giảm giá:', error)
  }
}

const fetchUser = async () => {
  try {
    const response = await axios.get(`http://localhost:5121/api/users/detail/${userId}`)
    user.value = response.data
    nameUserGet.value = user.value.fullName
    emailUserGet.value = user.value.email
    phoneUserGet.value = user.value.numberPhone
  } catch (error) {
    console.error('Lỗi lấy mã giảm giá:', error)
  }
}

const fetchAddresses = async () => {
  try {
    const response = await axios.get(`http://localhost:5121/api/users/${userId}/addAddress`)
    addresses.value = Array.isArray(response.data) ? response.data : []
    selectedAddress.value = addresses.value[0]
    addressUserGet.value = selectedAddress.value
      ? `${selectedAddress.value.street}, ${selectedAddress.value.city}, ${selectedAddress.value.country}`
      : ''
  } catch (error) {
    console.error('Lỗi lấy danh sách địa chỉ:', error)
  }
}

const fetpayment = async () => {
  try {
    if (!localStorage.getItem('uid')) {
      alert('Bạn cần đăng nhập trước khi thanh toán')
      return
    }

    const formData = {
      id: '', // ID đơn hàng, có thể để trống vì BE sẽ tự sinh
      productItems: [], // Danh sách sản phẩm, hiện tại có thể để trống
      status: 'process', // Trạng thái đơn hàng
      typePayment: 'paypal', // Chỉnh sửa để khớp với backend
      paymentId: '',
      couponId: coupon.value.id,
      nameUserGet: nameUserGet.value,
      emailUserGet: emailUserGet.value,
      phoneUserGet: phoneUserGet.value,
      addressUserGet: addressUserGet.value,
      totalAmount: totalPrice.value, // Tổng tiền
      idUserOrder: userId, // ID của người đặt hàng
      couponDiscount: coupon.value.discount, // Giảm giá từ mã coupon
      timeOrder: new Date().toISOString(), // Thời gian đặt hàng
    }

    console.log('Sending Data:', JSON.stringify(formData, null, 2))

    const link = `http://localhost:5121/api/paypal/create-payment` // Kiểm tra đúng API chưa
    console.log('API Link:', link)

    const response = await fetch(link, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!response.ok) throw new Error('Lỗi khi gọi API thanh toán')

    const data = await response.json()
    console.log('Received Data:', data)

    // Kiểm tra nếu có URL thanh toán từ BE
    if (data.url) {
      console.log('Chuyển hướng đến:', data.url)
      window.location.href = data.url
      //window.open(data.url, '_blank') //⚡ Mở trong tab mới
    } else {
      throw new Error('Không nhận được URL thanh toán')
    }
  } catch (error) {
    console.error(error)
    alert('Có lỗi xảy ra, vui lòng thử lại.')
  }
}

const selectAddress = (address) => {
  selectedAddress.value = address
  showAddressModal.value = false
  addressUserGet.value = selectedAddress.value
    ? `${selectedAddress.value.street}, ${selectedAddress.value.city}, ${selectedAddress.value.country}`
    : ''
}
const openDiscountModal = () => {
  showDiscountModal.value = true
}

const closeDiscountModal = () => {
  showDiscountModal.value = false
}

const selectDiscount = (disc) => {
  coupon.value.discount = disc.discount
  coupon.value.id = disc.id
  couponCode.value = disc.name
  closeDiscountModal()
}

const fetchCart = async () => {
  try {
    const response = await axios.get(`http://localhost:5121/api/users/${userId}/shopping-cart`)
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
    }, 0) - coupon.value.discount
  )
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value)
}

const setDeliveryMethod = (method) => {
  deliveryMethod.value = method
}

const placeOrder = () => {
  if (!agreeTerms.value) {
    alert('Bạn cần đồng ý với điều khoản trước khi đặt hàng.')
    return
  }
  fetpayment()
  console.log('Đặt hàng với phương thức:', selectedPayment.value)
}

onMounted(async () => {
  await fetchCart()
  await fetchCoupon()
  await fetchAddresses()
  await fetchUser()
  cartItems.value.forEach((item) => fetchProduct(item.idProduct))
})
</script>
  
  
  <style scoped>
.checkout-container {
  width: 800px;
  margin: 20px 120px;
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
  align-items: center;
  margin-top: 10px;
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

.summary {
  position: fixed;
  width: 300px;
  top: 92px;
  bottom: 0;
  right: 20px;
  height: 100%;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 25px 30px;
  border-radius: 6px;
  text-align: center;
  font-size: 16px;
  border-top: 2px solid #ddd;
}

.summary p {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  font-weight: 500;
}

.summary .total {
  font-size: 18px;
  font-weight: bold;
  color: #a70c1b;
}

.summary span {
  font-weight: bold;
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
  top: 0px;
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
  padding: 8px 15px;
  border: none;
  background: #d32f2f;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}
/* Modal nền mờ */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Làm mờ nền */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Nội dung modal */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 500px;
  max-width: 90%;
  text-align: center;
}

/* Danh sách địa chỉ */
ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background 0.3s ease;
}

li:hover {
  background: #f0f0f0;
}
/* payment */
.checkout-container-payment {
  margin: 10px;
}

.agreement {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.payment-methods {
  margin-top: 20px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 5px;
  cursor: pointer;
}

.payment-option input {
  margin-right: 10px;
}

.icon {
  width: 24px;
  height: 24px;
}

.description {
  font-size: 12px;
  color: gray;
}

.order-note {
  margin-top: 20px;
}

.order-note textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
}

.order-button {
  width: 100%;
  background: #a70c1b;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}

.order-button:hover {
  background: #870915;
}

h2 {
  text-align: center;
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 12px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}
.form-group input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.address-selection {
  display: flex;
  align-items: center; /* Canh giữa theo chiều dọc */
  gap: 10px; /* Khoảng cách giữa nút và text */
}

.address-selection button {
  background: #007bff;
  color: white;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.address-selection p {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
</style>
  