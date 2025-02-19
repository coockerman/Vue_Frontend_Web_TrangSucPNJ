<template>
  <div class="product-list">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>
  
  <script setup>
import ProductCard from '@/components/HomeUser/BodyListProduct/ProductCard.vue'

defineProps({
  products: Array,
})
</script>
  
  <style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(3, 2fr);
  gap: 10px;
  padding: 20px;
}
</style>
  