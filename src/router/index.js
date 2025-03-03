import { createRouter, createWebHistory } from 'vue-router'
import AuthenticationView from '@/views/AuthenticationView.vue'
import UserHome from '@/views/UserHome.vue'
import AdminHome from '@/views/AdminHome.vue'
import BodyHomeUser from '@/components/HomeUser/BodyHomeUser.vue'
import BodyListProduct from '@/components/HomeUser/BodyListProduct.vue'
import BodyListProductByCollection from '@/components/HomeUser/BodyListProductByCollection.vue'
import BodyListProductByCombo from '@/components/HomeUser/BodyListProductByCombo.vue'
import BodyManagerProduct from '@/components/HomeAdmin/BodyManagerProduct.vue'
import BodyUserProfile from '@/components/HomeUser/BodyUserProfile.vue'
import BodyAdminTitle from '@/components/HomeAdmin/BodyAdminTitle.vue'
import BodyManagerOrder from '@/components/HomeAdmin/BodyManagerOrder.vue'
import BodyProductDetail from '@/components/HomeUser/BodyProductDetail.vue'
import BodyCartView from '@/components/HomeUser/BodyCartView.vue'
import BodyPayment from '@/components/HomeUser/BodyPayment.vue'

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
      meta: { requireRoleAdmin: true },
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
      meta: { requireRoleUser: true },
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
        {
          path: 'userProfile',
          name: 'userProfile',
          component: BodyUserProfile,
          meta: { requiresAuth: true },
        },
        {
          path: 'cartView',
          name: 'cartView',
          component: BodyCartView,
          meta: { requiresAuth: true },
        },
        {
          path: 'payment',
          name: 'payment',
          component: BodyPayment,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('userToken')
  const role = localStorage.getItem('userRole')

  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    return next('/authentication') // Không có token thì về trang đăng nhập
  }

  if (to.matched.some((record) => record.meta.requireRoleAdmin) && role !== 'admin') {
    return next('/authentication') // Không phải admin thì về trang đăng nhập
  }

  if (to.matched.some((record) => record.meta.requireRoleUser) && role == 'admin') {
    return next('/admin-home') // Không phải user thì về trang đăng nhập
  }

  next() // Chỉ gọi next() một lần duy nhất nếu không có điều kiện nào bị chặn
})

export default router
