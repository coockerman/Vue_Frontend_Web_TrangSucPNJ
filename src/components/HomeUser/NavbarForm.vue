<template>
  <keep-alive>
    <nav class="navbar">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/user-home">
          <img src="/src/assets/Img/Logo.png" alt="PNJ" />
        </router-link>
      </div>

      <!-- Search Bar -->
      <input type="text" placeholder="Search for products..." class="search-bar" />

      <!-- Menu Items -->
      <div class="menu">
        <router-link :to="`/user-home/products`"> TRANG SỨC </router-link>
        <router-link to="#">GIFTS</router-link>
        <router-link to="#">SALE</router-link>

        <!-- Nút giỏ hàng -->
        <div class="icon-wrapper">
          <router-link :to="`/user-home/cartView`">
            <img src="/src/assets/Img/shopping-cart.png" alt="Cart" />
          </router-link>
        </div>

        <!-- Nút tài khoản -->
        <div class="icon-wrapper">
          <img src="/src/assets/Img/AuthIcon.png" alt="Account" />
          <!-- Bảng chọn -->
          <div class="dropdown">
            <template v-if="isLoggedIn">
              <button>
                <router-link class="text-normal" :to="'/user-home/userProfile'"
                  >Thông tin cá nhân</router-link
                >
              </button>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dropdownOpen = ref(false)
const isLoggedIn = ref(false)

// Kiểm tra token khi component được tạo
onMounted(() => {
  console.log(localStorage.getItem('userRole'))
  console.log(localStorage.getItem('userToken'))
  console.log(localStorage.getItem('uid'))
  isLoggedIn.value = localStorage.getItem('userRole') === 'user'
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const goToProfile = () => {
  router.push('/profile') // Chuyển hướng đến trang thông tin cá nhân
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
  isLoggedIn.value = false
  router.push('/authentication') // Quay về trang đăng nhập
  dropdownOpen.value = false
}

const goToLogin = () => {
  router.push('/authentication')
  dropdownOpen.value = false
}
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

/* Search Bar */
.search-bar {
  flex: 1;
  max-width: 50%;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
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
  font-size: 10px;
  color: black;
}
</style>



