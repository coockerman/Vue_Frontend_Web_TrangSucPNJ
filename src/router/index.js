import { createRouter, createWebHistory } from 'vue-router'
import AuthenticationView from '@/views/AuthenticationView.vue'
import UserHome from '@/views/UserHome.vue'
import AdminHome from '@/views/AdminHome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/authentication', // Mặc định chuyển hướng đến trang Authentication
    },
    {
      path: '/authentication',
      name: 'authentication',
      component: AuthenticationView,
    },
    {
      path: '/admin-home',
      name: 'adminHome',
      component: AdminHome,
    },
    {
      path: '/user-home',
      name: 'userHome',
      component: UserHome,
    },
  ],
})

export default router
