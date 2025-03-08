<template>
  <div class="product-list">
    <h2 class="title">{{ title }}</h2>
    <div class="products">
      <div v-for="product in products" :key="product.id" class="product">
        <router-link
          class="productBody"
          :to="`/user-home/products?type=${encodeURIComponent(product.type)}`"
        >
          <img :src="product.image" :alt="product.name" class="product-image" />
          <p class="product-name">{{ product.name }}</p>
        </router-link>
      </div>
    </div>
    <button class="best-seller">Top Bán Chạy</button>
  </div>
</template>
    
  <script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
  },
}
</script>
    
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prata&display=swap');
.product-list {
  text-align: center;
  padding: 30px;
  margin: 30px 50px;
  border-radius: 8px;
  background-color: rgb(240, 240, 240);
}

.title {
  font-size: 24px; /* Làm chữ to hơn */
  text-decoration: underline; /* Thêm gạch chân */
  margin-bottom: 20px;
  font-family: 'Prata', serif;
}

.products {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.product {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.productBody:hover {
  background-color: #f5f5f5;
}
.product-image {
  width: 200px;
  height: 200px;
  margin: 7px;
  object-fit: cover;
  background-color: #f5f5f5; /* Màu nền xám nhạt */
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.1);
}

.product-name {
  font-size: 20px; /* Làm chữ sản phẩm to hơn */
  font-weight: 400; /* Làm đậm hơn */
  margin-top: 5px;
  color: black;
}
.best-seller {
  background-color: rgb(172, 56, 67);
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  padding: 12px 24px;
  margin-top: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.best-seller:hover {
  background-color: darkred;
}
</style>
  