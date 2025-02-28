<template>
  <div class="product-title-container">
    <h1 class="product-name">{{ name }}</h1>
    <ul class="product-details">
      <li><strong>Loại:</strong> {{ type }}</li>
      <li><strong>Chất liệu:</strong> {{ material }}</li>
      <li><strong>Karat:</strong> {{ karat }}</li>
      <li><strong>Dành cho:</strong> {{ gender }}</li>
    </ul>
    <p class="product-description" v-html="formattedDescription"></p>
  </div>
</template>
    
  <script setup>
import { computed } from 'vue'

const props = defineProps({
  name: String,
  type: String,
  material: String,
  karat: String,
  gender: String,
  description: String,
})

const formattedDescription = computed(() =>
  props.description ? props.description.replace(/-/g, '<br>') : ''
)
</script>
    
  <style scoped>
.product-title-container {
  padding: 16px;
  border-bottom: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.product-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.product-details {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: #555;
}

.product-details li {
  margin-bottom: 4px;
}

.product-description {
  margin-top: 12px;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  white-space: pre-line; /* Đảm bảo xuống dòng theo <br> */
  background: #fff;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
  