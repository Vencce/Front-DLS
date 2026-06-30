import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import AdminLayout from '../layouts/AdminLayout.vue'

import HomeView from '../views/Storefront/HomeView.vue'
import CatalogView from '../views/Storefront/CatalogView.vue'
import ProductDetailView from '../views/Storefront/ProductDetailView.vue'
import CartView from '../views/Storefront/CartView.vue'
import CheckoutView from '../views/Storefront/CheckoutView.vue'
import CustomerAreaView from '../views/Storefront/CustomerAreaView.vue'
import AboutView from '../views/Storefront/AboutView.vue'
import AuthView from '../views/Storefront/AuthView.vue'

import LoginAdminView from '../views/Admin/LoginAdminView.vue'
import DashboardView from '../views/Admin/DashboardView.vue'
import ProductManagementView from '../views/Admin/ProductManagementView.vue'
import OrderManagementView from '../views/Admin/OrderManagementView.vue'
import CustomerManagementView from '../views/Admin/CustomerManagementView.vue'
import SettingsView from '../views/Admin/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/catalogo', name: 'catalog', component: CatalogView },
    { path: '/produto/:id', name: 'product', component: ProductDetailView },
    { path: '/carrinho', name: 'cart', component: CartView },
    { path: '/checkout', name: 'checkout', component: CheckoutView },
    { path: '/minha-conta', name: 'customer-area', component: CustomerAreaView, meta: { requiresAuth: true } },
    { path: '/sobre', name: 'about', component: AboutView },
    { path: '/login', name: 'login', component: AuthView },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAdmin: true },
      children: [
        { path: 'dashboard', name: 'admin-dashboard', component: DashboardView },
        { path: 'produtos', name: 'admin-products', component: ProductManagementView },
        { path: 'pedidos', name: 'admin-orders', component: OrderManagementView },
        { path: 'clientes', name: 'admin-customers', component: CustomerManagementView },
        { path: 'configuracoes', name: 'admin-settings', component: SettingsView }
      ]   
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: LoginAdminView
    }
  ]
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  
  if (!authStore.user && authStore.token) {
    await authStore.fetchUser()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      return { name: 'admin-login' }
    }
    if (!authStore.isSuperuser) {
      return { name: 'home' }
    }
  }
})

export default router