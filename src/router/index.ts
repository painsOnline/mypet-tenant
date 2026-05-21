import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('@/layout/AdminLayout.vue'),
    redirect: '/tenant',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'tenant',
        name: 'TenantList',
        component: () => import('@/views/tenant/TenantListView.vue'),
      },
      {
        path: 'tenant/:id',
        name: 'TenantDetail',
        component: () => import('@/views/tenant/TenantDetailView.vue'),
        props: true,
      },
      {
        path: 'admin/users',
        name: 'AdminList',
        component: () => import('@/views/admin/AdminListView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && authStore.isLoggedIn) {
    next('/tenant')
  } else {
    next()
  }
})

export default router
