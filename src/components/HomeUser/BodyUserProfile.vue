<template>
  <div class="dashboard-wrapper">
    <div class="user-dashboard">
      <div class="sidebar">
        <!-- Nút Trở về trang chủ -->
        <button class="back-button" @click="goHome">
          <span>&lt; Trở về trang chủ</span>
        </button>

        <div class="sidebar-content">
          <button
            v-for="item in menuItems"
            :key="item.id"
            :class="{ active: selectedTab === item.id }"
            @click="selectedTab = item.id"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </button>
        </div>
      </div>
      <div class="content">
        <UserInfo v-if="selectedTab === 'view'" />
        <EditUser v-if="selectedTab === 'edit'" />
        <UserAddress v-if="selectedTab === 'address'" />
      </div>
    </div>
  </div>
  <Footer />
</template>
    
  <script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserInfo from '@/components/HomeUser/BodyUserProfile/UserInfo.vue'
import EditUser from '@/components/HomeUser/BodyUserProfile/EditUser.vue'
import UserAddress from '@/components/HomeUser/BodyUserProfile/UserAddress.vue'
import Footer from '@/components/HomeUser/BodyHomeUser/FooterForm.vue'

const router = useRouter()
const selectedTab = ref('view')

const menuItems = [
  { id: 'view', label: 'Thông tin', icon: 'fa fa-user' },
  { id: 'edit', label: 'Sửa thông tin', icon: 'fa fa-pencil-alt' },
  { id: 'address', label: 'Địa chỉ', icon: 'fa fa-bell' },
  { id: 'security', label: 'Security', icon: 'fa fa-lock' },
  { id: 'appearance', label: 'Appearance', icon: 'fa fa-cog' },
  { id: 'help', label: 'Help', icon: 'fa fa-question-circle' },
]

// Hàm chuyển hướng về trang chủ
const goHome = () => {
  router.push('/')
}
</script>
    
  <style scoped>
/* Căn giữa dashboard */
.dashboard-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f5f5; /* Màu nền tổng thể nhẹ nhàng */
}

.user-dashboard {
  display: flex;
  min-height: 450px;
  width: 80%;
  max-width: 1500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px 0 0 12px;
  border-right: 1px solid #ddd;
}

/* Nút trở về trang chủ */
.back-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  background: transparent;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: 0.3s;
  font-family: 'Inter', sans-serif;
}

.back-button:hover {
  color: black;
  font-weight: bold;
}

/* Danh sách menu */
.sidebar-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar button {
  width: 90%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  margin-bottom: 10px;
  border: none;
  background: transparent;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  text-align: left;
  border-radius: 8px;
  transition: 0.3s;
}

.sidebar button i {
  font-size: 14px;
}

.sidebar button.active {
  background: black;
  color: white;
}

.sidebar button:hover {
  background: #e0e0e0;
}

/* Content */
.content {
  flex: 1;
  padding: 20px;
  border-radius: 0 12px 12px 0;
}
</style>
  