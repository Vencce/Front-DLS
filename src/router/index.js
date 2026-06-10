import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import HomeView from '../views/Storefront/HomeView.vue'
import CatalogView from '../views/Storefront/CatalogView.vue'
import ProductDetailView from '../views/Storefront/ProductDetailView.vue'
import CartView from '../views/Storefront/CartView.vue'
import CheckoutView from '../views/Storefront/CheckoutView.vue'
import AuthView from '../views/AuthView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import DashboardView from '../views/Admin/DashboardView.vue'
import ProductManagementView from '../views/Admin/ProductManagementView.vue'
import OrderManagementView from '../views/Admin/OrderManagementView.vue'
import CustomerManagementView from '../views/Admin/CustomerManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/catalogo', name: 'catalog', component: CatalogView },
    { path: '/produto/:slug', name: 'product', component: ProductDetailView },
    { path: '/carrinho', name: 'cart', component: CartView },
    { path: '/checkout', name: 'checkout', component: CheckoutView },
    { path: '/admin/login', name: 'login', component: AuthView },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: DashboardView },
        { path: 'produtos', name: 'admin-products', component: ProductManagementView },
        { path: 'pedidos', name: 'admin-orders', component: OrderManagementView },
        { path: 'clientes', name: 'admin-customers', component: CustomerManagementView },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.user && authStore.token) {
    await authStore.fetchUser()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/admin/login')
  } else if (to.meta.requiresAdmin && !authStore.isSuperuser) {
    next('/')
  } else {
    next()
  }
})

export default router
