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

        <router-link :to="'/admin-home/managerRevenue/'">
          <li>Xem doanh thu</li>
        </router-link>

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
  background: #f4f4f9;
}

.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #1e293b, #314668);
  color: white;
  padding: 20px;
  flex-shrink: 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
}

.sidebar h1 {
  font-size: 22px; /* Tăng kích thước chữ */
  font-weight: bold;
  color: #f4fbca;
  text-align: center;
  margin-bottom: 40px;
  text-transform: uppercase;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  font-size: 16px; /* Tăng kích thước chữ */
  font-weight: bold; /* In đậm chữ */
  padding: 14px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s;
  border-radius: 8px;
}

.sidebar li:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05); /* Hiệu ứng phóng to nhẹ khi hover */
}

.sidebar a {
  color: white;
  text-decoration: none;
  display: block;
}

.content {
  flex: 1;
  margin-left: 250px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 20px;
  background: #1e293b;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  border-radius: 6px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  min-width: 140px;
  z-index: 10;
}

.dropdown-menu button {
  width: 100%;
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.3s;
}

.dropdown-menu button:hover {
  background: #e5e7eb;
}

.page-content {
  flex: 1;
  padding: 25px;
  overflow-y: auto;
}
</style>