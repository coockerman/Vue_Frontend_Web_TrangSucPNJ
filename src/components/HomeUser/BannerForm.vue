<template>
  <div class="banner">
    <img src="/src/assets/Banner/bn2.png" alt="PNJ Banner" class="banner-img" />
    <div class="banner-content">
      <div class="sale-badge">
        <span>SALE</span>
        <span class="sale-text">GET 15% WITH PNJ</span>
      </div>
      <h1 class="title">
        PNJ <br />
        Một lời trao, <br />
        Một đời yêu.
      </h1>
      <button class="explore-btn">Khám phá ngay</button>
    </div>
  </div>
</template>
  
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quintessential&display=swap');
.banner {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 25%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sale-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 0px 20px 0px 0px;
  font-size: 14px;
}

.sale-badge span:first-child {
  background: #b71c1c;
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  margin-right: 10px;
}

.sale-text {
  color: #ffdad8;
  padding: 0px 10px;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  font-family: 'Quintessential', cursive;
  margin: 20px 0;
}

.explore-btn {
  background: #7a3b3b;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 20px;
}
</style>
  