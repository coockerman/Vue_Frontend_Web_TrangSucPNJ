import { createRouter, createWebHistory } from 'vue-router'
import AuthenticationView from '@/views/AuthenticationView.vue'
import UserHome from '@/views/UserHome.vue'
import AdminHome from '@/views/AdminHome.vue'
import BodyHomeUser from '@/components/HomeUser/BodyHomeUser.vue'
import BodyListProduct from '@/components/HomeUser/BodyListProduct.vue'
import BodyListProductByCollection from '@/components/HomeUser/BodyListProductByCollection.vue'
import BodyListProductByCombo from '@/components/HomeUser/BodyListProductByCombo.vue'
import BodyManagerProduct from '@/components/HomeAdmin/BodyManagerProduct.vue'
import BodyAdminTitle from '@/components/HomeAdmin/BodyAdminTitle.vue'
import BodyManagerOrder from '@/components/HomeAdmin/BodyManagerOrder.vue'
import BodyProductDetail from '@/components/HomeUser/BodyProductDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/user-home',
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
      children: [
        {
          path: 'managerProduct',
          name: 'managerProduct',
          component: BodyManagerProduct,
        },
        {
          path: '',
          name: 'adminTitle',
          component: BodyAdminTitle,
        },
        {
          path: 'managerOrder',
          name: 'managerOrder',
          component: BodyManagerOrder,
        },
      ],
    },
    {
      path: '/user-home',
      component: UserHome,
      children: [
        {
          path: '',
          name: 'homeUser',
          component: BodyHomeUser, // Không cần đăng nhập
        },
        {
          path: 'products',
          name: 'productList',
          component: BodyListProduct, // Không cần đăng nhập
        },
        {
          path: 'productsByCollection',
          name: 'productListByCollection',
          component: BodyListProductByCollection,
          meta: { requiresAuth: true },
        },
        {
          path: 'productsByCombo',
          name: 'productListByCombo',
          component: BodyListProductByCombo, // Không cần đăng nhập
        },
        {
          path: 'productDetail:/id',
          name: 'productDetail',
          component: BodyProductDetail, // Không cần đăng nhập
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('userToken')
  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    next('/authentication')
  } else {
    next()
  }
})

export default router
