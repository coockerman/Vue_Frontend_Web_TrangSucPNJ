import { createRouter, createWebHistory } from 'vue-router'
import AuthenticationView from '@/views/AuthenticationView.vue'
import LoginForm from '@/components/Authentication/LoginForm.vue'
import RegisterForm from '@/components/Authentication/RegisterForm.vue'
import UserHome from '@/views/UserHome.vue'
import AdminHome from '@/views/AdminHome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'authentication',
      component: AuthenticationView,
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginForm,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm,
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
