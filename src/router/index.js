import { createRouter, createWebHistory } from 'vue-router'
import AuthenticationView from '@/views/AuthenticationView.vue'
import UserHome from '@/views/UserHome.vue'
import AdminHome from '@/views/AdminHome.vue'
import BodyHomeUser from '@/components/HomeUser/BodyHomeUser.vue'
import BodyListProduct from '@/components/HomeUser/BodyListProduct.vue'
import BodyListProductByCollection from '@/components/HomeUser/BodyListProductByCollection.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/authentication',
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
      component: UserHome,
      children: [
        {
          path: '',
          name: 'homeUser',
          component: BodyHomeUser, // Mặc định hiển thị BodyHomeUser
        },
        {
          path: 'products',
          name: 'productList',
          component: BodyListProduct,
        },
        {
          path: 'productsByCollection',
          name: 'productListByCollection',
          component: BodyListProductByCollection,
        },
      ],
    },
  ],
})

export default router
