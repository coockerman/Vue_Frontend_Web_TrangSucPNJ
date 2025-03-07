<template>
  <div class="admin-container">
    <aside class="sidebar">
      <h1>Admin</h1>
      <ul>
        <router-link :to="'/admin-home/'">
          <li>Quản lý tài khoản</li>
        </router-link>

        <router-link :to="'/admin-home/managerProduct/'">
          <li>Quản lý sản phẩm</li>
        </router-link>

        <router-link :to="'/admin-home/managerOrder/'">
          <li>Quản lý đơn hàng</li>
        </router-link>

        <li @click="navigate('revenue')">Xem doanh thu</li>
        <li @click="navigate('reviews')">Quản lý đánh giá</li>
        <li @click="navigate('ads')">Quản lý quảng cáo</li>
      </ul>
    </aside>
    <main class="content">
      <header class="topbar">
        <div class="user-menu" @click="toggleMenu">
          <img src="@/assets/Img/Logo.png" alt="User Avatar" class="avatar" />
          <div v-if="showMenu" class="dropdown-menu">
            <button @click="logout">Đăng xuất</button>
          </div>
        </div>
      </header>
      <div class="page-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import BodyManagerProduct from '@/components/HomeAdmin/BodyManagerProduct.vue'

export default {
  components: {
    BodyManagerProduct,
  },
  data() {
    return {
      showMenu: false,
    }
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    logout() {
      localStorage.removeItem('userToken')
      localStorage.removeItem('userRole')
      this.$router.push('/authentication')
    },
    navigate(route) {
      this.$router.push(`/admin-home/${route}`)
    },
  },
}
</script>

<style scoped>
.admin-container {
  display: flex;
  height: 100vh;
  overflow-y: auto; /* Ngăn trang bị cuộn theo toàn bộ chiều cao */
}
.sidebar h1 {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  background: #1c4d3e;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.sidebar {
  width: 200px; /* Giảm chiều rộng */
  background: #1f2937;
  color: white;
  padding: 15px;
  flex-shrink: 0; /* Đảm bảo sidebar không bị thu nhỏ */
  height: 100vh; /* Chiều cao toàn màn hình */
  position: fixed; /* Cố định sidebar */
  left: 0;
  top: 0;
  bottom: 0;
}

.sidebar h2 {
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 12px;
  cursor: pointer;
  transition: background 0.3s ease;
  border-radius: 5px;
}

.sidebar li:hover {
  background: #374151;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 200px; /* Điều chỉnh phù hợp với sidebar */
  height: 100vh;
  overflow-y: auto;
}

.topbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 20px;
  background: #111827;
  height: 60px;
}

.user-menu {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
}

.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 10;
}

.dropdown-menu button {
  width: 100%;
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.dropdown-menu button:hover {
  background: #f3f4f6;
}

.page-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto; /* Kích hoạt cuộn nội dung */
}
</style>
