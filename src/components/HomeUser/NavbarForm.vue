<template>
  <nav class="navbar">
    <!-- Logo -->
    <div class="logo">
      <img src="/src/assets/Img/Logo.png" alt="PNJ" />
    </div>

    <!-- Search Bar -->
    <input type="text" placeholder="Search for products..." class="search-bar" />

    <!-- Menu Items -->
    <div class="menu">
      <a href="#">TRANG SỨC</a>
      <a href="#">GIFTS</a>
      <a href="#">SALE</a>
      <!-- Nút giỏ hàng -->
      <div class="icon-wrapper">
        <button class="icon-button">
          <img src="/src/assets/Img/shopping-cart.png" alt="Cart" />
        </button>
      </div>

      <!-- Nút tài khoản -->
      <div class="icon-wrapper">
        <button class="icon-button">
          <img src="/src/assets/Img/AuthIcon.png" alt="Account" />
        </button>
      </div>
    </div>
  </nav>
</template>
  
  <style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 50px;
  background: white;
  border-bottom: 1px solid #ddd;
}

/* Logo */
.logo img {
  width: 120px;
}

/* Search Bar */
.search-bar {
  flex: 1;
  max-width: 50%;
  padding: 15px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

/* Menu */
.menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu a {
  text-decoration: none;
  color: black;
  font-weight: bold;
  font-size: 16px;
}

/* Icons */
.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 7px;
}

.icon-button img {
  width: 16px;
  height: 16px;
}
.icon-wrapper {
  position: relative;
  width: 30px; /* Định kích thước khung */
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: transparent; /* Làm nền trong suốt */
  border: 2px solid rgb(86, 5, 5); /* Viền màu đỏ */
}
</style>
  