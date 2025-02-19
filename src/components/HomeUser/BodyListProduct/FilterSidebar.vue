<template>
  <div class="filter-sidebar">
    <h3>Bộ lọc</h3>

    <!-- Lọc theo giá -->
    <label>Khoảng giá:</label>
    <input
      type="range"
      v-model="price"
      min="0"
      max="300000000"
      step="1000000"
      @input="applyFilters"
    />

    <!-- Lọc theo chất liệu -->
    <label>Chất liệu:</label>
    <select v-model="material" @change="applyFilters">
      <option value="all">Tất cả</option>
      <option value="gold">Vàng</option>
      <option value="silver">Bạc</option>
    </select>

    <!-- Lọc theo tuổi vàng -->
    <label>Tuổi vàng:</label>
    <select v-model="karat" @change="applyFilters">
      <option value="all">Tất cả</option>
      <option value="10K">10K</option>
      <option value="14K">14K</option>
      <option value="18K">18K</option>
      <option value="24K">24K</option>
    </select>
  </div>
</template>
  
  <script setup>
import { ref, defineEmits } from 'vue'

const price = ref(300000000)
const material = ref('all')
const karat = ref('all')

const emit = defineEmits(['updateFilters'])

const applyFilters = () => {
  emit('updateFilters', { price: price.value, material: material.value, karat: karat.value })
}
</script>
  
  <style scoped>
.filter-sidebar {
  padding: 30px;
  border-right: 1px solid #ddd;
}
</style>
  