<template>
  <keep-alive>
    <nav class="navbar">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/user-home">
          <img src="/src/assets/Img/logo.png" alt="PNJ" />
        </router-link>
      </div>

      <!-- Search Bar -->
      <div class="search-container">
        <input
          type="text"
          v-model="searchKeyword"
          @input="searchProducts"
          @click="showSearchResults = true"
          placeholder="Tìm kiếm sản phẩm..."
          class="search-bar"
        />
        <!-- Dropdown kết quả -->
        <ul v-if="showSearchResults && searchResults.length" class="search-results">
          <li v-for="product in searchResults" :key="product.id" @click="goToProduct(product.id)">
            {{ product.nameProduct }}
          </li>
        </ul>
      </div>

      <!-- Menu Items -->
      <div class="menu">
        <router-link :to="`/user-home/products`"> TRANG SỨC </router-link>
        <router-link :to="`/user-home/listFavourite`">YÊU THÍCH</router-link>
        <router-link to="#">SALE</router-link>

        <!-- Nút giỏ hàng -->
        <div class="icon-wrapper">
          <router-link :to="`/user-home/cartView`">
            <img src="/src/assets/Img/shopping-cart.png" alt="Cart" />
          </router-link>
        </div>

        <!-- Nút tài khoản -->
        <div class="icon-wrapper" @mouseenter="handleHover">
          <img src="/src/assets/Img/AuthIcon.png" alt="Account" />
          <!-- Bảng chọn -->
          <div class="dropdown">
            <template v-if="isLoggedIn">
              <button class="text-normal" @click="goToProfile">Thông tin cá nhân</button>
              <button @click="goToPurchased">Sản phẩm đã mua</button>
              <button @click="goToOrderList">Xem đơn hàng</button>
              <button @click="logout">Đăng xuất</button>
            </template>
            <template v-else>
              <button @click="goToLogin">Đăng nhập</button>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </keep-alive>
</template>



<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const dropdownOpen = ref(false)
const isLoggedIn = ref(false)

// Dữ liệu cho thanh tìm kiếm
const searchKeyword = ref('')
const searchResults = ref([])
const showSearchResults = ref(false) // Điều khiển hiển thị danh sách tìm kiếm
// Kiểm tra token khi component được tạo
onMounted(() => {
  console.log(localStorage.getItem('userRole'))
  console.log(localStorage.getItem('userToken'))
  console.log(localStorage.getItem('uid'))
  isLoggedIn.value = localStorage.getItem('userRole') === 'user'
})
const handleHover = () => {
  isLoggedIn.value = localStorage.getItem('userRole') === 'user'
}
// API Search
const searchProducts = async () => {
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    showSearchResults.value = false
    return
  }

  try {
    const response = await axios.get(
      `http://localhost:5121/api/products/search?name=${searchKeyword.value}`
    )
    searchResults.value = response.data
    showSearchResults.value = searchResults.value.length > 0
  } catch (error) {
    searchResults.value = []
    showSearchResults.value = false
  }
}

const goToProduct = (idGet) => {
  console.log(idGet) // Đảm bảo ID hợp lệ trước khi chuyển trang
  router.push({
    name: 'productDetail',
    query: { id: idGet },
  })
  searchResults.value = [] // Ẩn danh sách tìm kiếm sau khi nhấp vào sản phẩm
}

// Xử lý khi nhấn ra ngoài
const handleClickOutside = (event) => {
  if (!event.target.closest('.search-container')) {
    showSearchResults.value = false
  }
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const goToProfile = () => {
  router.push('/user-home/userProfile') // Chuyển hướng đến trang thông tin cá nhân
  dropdownOpen.value = false
}
const goToPurchased = () => {
  router.push('/user-home/listPurchased') // Chuyển hướng đến trang thông tin cá nhân
  dropdownOpen.value = false
}

const goToOrderList = () => {
  router.push('/user-home/listOrder') // Chuyển hướng đến trang thông tin cá nhân
  dropdownOpen.value = false
}
const logout = () => {
  localStorage.removeItem('userToken') // Xóa token đăng nhập
  localStorage.removeItem('userRole')
  localStorage.removeItem('uid')
  isLoggedIn.value = false
  router.push('/authentication') // Quay về trang đăng nhập
  dropdownOpen.value = false
}

const goToLogin = () => {
  router.push('/authentication')
  dropdownOpen.value = false
}

// Gắn và gỡ bỏ sự kiện khi component mount/unmount
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>




<style scoped>
/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 50px;
  background: white;
  border-bottom: 1px solid #ddd;
}

/* Logo */
.logo img {
  width: 120px;
}

/* Menu */
.menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu a {
  text-decoration: none;
  color: black;
  font-weight: bold;
  font-size: 16px;
  transition: color 0.2s ease-in-out;
}

.menu a:hover {
  color: #b71c1c; /* Màu đỏ trầm */
}

/* Icons - Giỏ hàng & Tài khoản */
.icon-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: transparent;
  border: none; /* Xóa viền nếu có */
  transition: background 0.2s ease-in-out;
  cursor: pointer;
}

/* Khi hover vào icon-wrapper, không có border */
.icon-wrapper:hover {
  background: rgba(0, 0, 0, 0.1); /* Tạo hiệu ứng hover nhẹ */
}

/* Loại bỏ viền khi focus vào button */
.icon-button {
  background: none;
  border: none; /* Xóa viền của button */
  outline: none; /* Xóa viền focus */
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Kích thước icon */
.icon-button img {
  width: 24px;
  height: 24px;
}

/* Khi hover vào icon-wrapper thì hiển thị dropdown */
.icon-wrapper:hover .dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Dropdown menu */
.dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Ẩn dropdown mặc định */
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out, visibility 0.2s;
}

/* Dropdown items */
.dropdown button {
  padding: 12px 15px;
  text-align: left;
  background: white;
  border: none;
  width: 100%;
  text-decoration: none;
  color: black;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease-in-out;
}

.dropdown button:hover {
  background: #f5f5f5;
}
.text-normal {
  font-weight: bold;
  font-size: 12px;
  color: black;
}

.search-container {
  position: relative;
  width: 100%; /* Chiếm hết chiều ngang */
  max-width: 600px; /* Độ dài tối đa */
}

.search-bar {
  width: 95%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

.search-bar:focus {
  border-color: #007bff;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 95%;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.search-results li {
  padding: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-results li:hover {
  background: #f0f0f0;
}
/* Xóa màu xanh của router-link */
.router-link-active,
.router-link-exact-active {
  color: inherit !important;
  background: #ffffff;
}

/* Khi hover vào router-link */
.router-link-active:hover,
.router-link-exact-active:hover {
  background-color: #ddd !important; /* Đổi màu nền */
  color: inherit !important; /* Giữ nguyên màu chữ */
}
</style>



