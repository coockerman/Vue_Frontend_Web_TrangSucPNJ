<template>
  <!-- Breadcrumb -->
  <nav class="breadcrumb">
    <router-link to="/user-home">Home</router-link>
    <span> > </span>
    <span>Bộ sưu tập</span>
  </nav>
  <div class="filter-sidebar">
    <h3 class="filter-title">Lọc</h3>

    <!-- Lọc theo giá -->
    <div class="filter-section">
      <label class="filter-label">Giá</label>
      <input
        type="range"
        v-model="price"
        min="0"
        max="200000000"
        step="1000000"
        class="price-slider"
        @input="applyFilters"
      />
      <div class="price-values">
        <span>0Đ</span>
        <span>{{ formatPrice(price) }}Đ</span>
      </div>
    </div>

    <!-- Lọc theo chất liệu -->
    <div class="filter-section">
      <label class="filter-label">Chất liệu</label>
      <div class="filter-options">
        <button
          v-for="mat in materials"
          :key="mat.value"
          :class="['filter-btn', { active: material === mat.value }]"
          @click="setMaterial(mat.value)"
        >
          {{ mat.label }}
        </button>
      </div>
    </div>

    <!-- Lọc theo tuổi vàng -->
    <div class="filter-section">
      <label class="filter-label">Tuổi vàng</label>
      <div class="filter-options">
        <button
          v-for="k in karats"
          :key="k.value"
          :class="['filter-btn', { active: karat === k.value }]"
          @click="setKarat(k.value)"
        >
          {{ k.label }}
        </button>
      </div>
    </div>

    <!-- Lọc theo giới tính -->
    <div class="filter-section">
      <label class="filter-label">Giới tính</label>
      <div class="filter-options">
        <button
          v-for="g in genders"
          :key="g.value"
          :class="['filter-btn', { active: gender === g.value }]"
          @click="setGender(g.value)"
        >
          {{ g.label }}
        </button>
      </div>
    </div>

    <!-- Nút tìm kiếm -->
    <button class="search-btn" @click="applyFilters">Tìm kiếm</button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const price = ref(200000000)
const material = ref('all')
const karat = ref('all')
const gender = ref('all')

const materials = [
  { label: 'Vàng trắng', value: 'Vàng trắng' },
  { label: 'Vàng', value: 'Vàng' },
  { label: 'Bạc', value: 'Bạc' },
]

const karats = [
  { label: '10K', value: '10K' },
  { label: '14K', value: '14K' },
  { label: '18K', value: '18K' },
  { label: '24K', value: '24K' },
]

const genders = [
  { label: 'Nữ', value: 'Nữ' },
  { label: 'Nam', value: 'Nam' },
  { label: 'Trẻ em', value: 'Trẻ em' },
  { label: 'Unisex', value: 'Unisex' },
]

const emit = defineEmits(['updateFilters'])

const applyFilters = () => {
  emit('updateFilters', {
    price: price.value,
    material: material.value,
    karat: karat.value,
    gender: gender.value,
  })
}

const setMaterial = (val) => (material.value = val)
const setKarat = (val) => (karat.value = val)
const setGender = (val) => (gender.value = val)

const formatPrice = (num) => num.toLocaleString('vi-VN')
</script>

<style scoped>
.filter-sidebar {
  width: 250px;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-label {
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
}

.price-slider {
  width: 100%;
  accent-color: #6b1e14;
}

.price-values {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 5px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-btn {
  background: #eee;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.filter-btn.active {
  background: #6b1e14;
  color: white;
}

.search-btn {
  width: 100%;
  background: #6b1e14;
  color: white;
  padding: 10px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: 0.3s;
}

.search-btn:hover {
  background: #5a1810;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-top: 15px;
  width: 80%; /* Đảm bảo breadcrumb trải dài toàn bộ chiều ngang */
  justify-content: flex-start; /* Căn về bên trái */
  padding-left: 5px; /* Tạo khoảng cách với mép trái */
}

.breadcrumb a {
  text-decoration: none;
  color: rgb(20, 20, 20);
  font-weight: bold;
}

.breadcrumb span {
  margin: 0 5px;
  color: gray;
}

.breadcrumb a:hover {
  text-decoration: underline;
}
</style>
