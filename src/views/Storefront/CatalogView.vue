<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../../stores/productStore'
import { useCartStore } from '../../stores/cartStore'

const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const formatPrice = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

// Função segura para buscar a imagem principal
const getImg = (p) => (p.images && p.images.length > 0 ? p.images[0].image : null)

const handleAddToCart = (product) => {
  cartStore.addItem({ ...product, price: parseFloat(product.price) })
  cartStore.openCart()
}

onMounted(() => productStore.fetchProducts())
</script>

<template>
  <div class="catalog-container">
    <div class="products-grid">
      <div v-for="p in productStore.products" :key="p.id" class="product-card">
        <div class="img-wrapper" @click="router.push(`/produto/${p.id}`)">
          <img v-if="getImg(p)" :src="getImg(p)" :alt="p.name" />
          <div v-else class="no-img">Sem foto</div>
        </div>
        <div class="info">
          <span class="category-tag">{{ p.category_name }}</span>
          <h3 @click="router.push(`/produto/${p.id}`)">{{ p.name }}</h3>
          <p class="sku">SKU: {{ p.sku }}</p>
          <div class="price-row">
            <span class="price">{{ formatPrice(p.price) }}</span>
            <button @click="handleAddToCart(p)" class="btn-buy">Adicionar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-container { padding: 2rem; max-width: 1200px; margin: auto; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
.product-card { background: white; border-radius: 1rem; padding: 1rem; border: 1px solid #e5e7eb; transition: 0.3s; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
.img-wrapper { height: 200px; background: #f9fafb; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; margin-bottom: 1rem; cursor: pointer; }
.img-wrapper img { max-height: 100%; object-fit: contain; }
.category-tag { font-size: 0.7rem; color: #059669; font-weight: 800; text-transform: uppercase; }
.product-card h3 { font-size: 1rem; margin: 0.5rem 0; cursor: pointer; }
.price-row { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
.price { font-weight: 900; font-size: 1.2rem; }
.btn-buy { background: #008f4c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.4rem; cursor: pointer; }
</style>