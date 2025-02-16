import { createRouter, createWebHistory } from 'vue-router'
import AuthenticationView from '@/views/AuthenticationView.vue'
import LoginForm from '@/components/Authentication/LoginForm.vue'
import RegisterForm from '@/components/Authentication/RegisterForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'authentication',
      component: AuthenticationView,
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
  ],
})

export default router
