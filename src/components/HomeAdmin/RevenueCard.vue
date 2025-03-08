<template>
  <div class="card">
    <h2 class="text-lg font-semibold text-gray-700">{{ title }}</h2>
    <p class="text-3xl font-bold text-green-500">{{ amount.toLocaleString() }} VND</p>
  </div>
</template>
    
  <script>
export default {
  props: {
    title: String,
    amount: Number,
  },
}
</script>
    
  <style scoped>
.card {
  padding: 20px;
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

h2 {
  margin-bottom: 10px;
  font-size: 1.2rem;
  color: #333;
}

p {
  font-size: 2rem;
  font-weight: bold;
  color: #28a745;
}
</style>