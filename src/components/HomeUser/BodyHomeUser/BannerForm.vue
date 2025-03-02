<template>
  <div class="banner">
    <transition name="fade" mode="out-in">
      <img :key="currentAd.id" :src="currentAd.urlImage" alt="PNJ Banner" class="banner-img" />
    </transition>
    <div class="banner-content">
      <div class="sale-badge" v-if="currentAd">
        <span>SALE</span>
        <span class="sale-text">GET 20% WITH PNJ</span>
      </div>
      <!-- <h1 class="title" v-if="currentAd">{{ currentAd.name }}</h1> -->
      <button class="explore-btn" @click="scrollToBottom">Khám phá ngay</button>
    </div>
    <button class="nav-btn left" @click="prevSlide">&#10094;</button>
    <button class="nav-btn right" @click="nextSlide">&#10095;</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      advertisements: [],
      currentIndex: 0,
    }
  },
  computed: {
    currentAd() {
      return this.advertisements.length ? this.advertisements[this.currentIndex] : {}
    },
  },
  methods: {
    async fetchAdvertisements() {
      try {
        const response = await axios.get('http://localhost:5121/api/advertisements/all')
        this.advertisements = response.data
      } catch (error) {
        console.error('Lỗi khi tải quảng cáo:', error)
      }
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.advertisements.length
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.advertisements.length) % this.advertisements.length
    },
    startAutoSlide() {
      setInterval(() => {
        this.nextSlide()
      }, 3000)
    },
    scrollToBottom() {
      window.scrollBy({ top: window.innerHeight * 1.1, behavior: 'smooth' })
    },
  },
  mounted() {
    this.fetchAdvertisements().then(() => {
      if (this.advertisements.length) this.startAutoSlide()
    })
  },
}
</script>

<style scoped>
.banner {
  position: relative;
  width: 100vw;
  height: 85vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner-img {
  width: 100%;
  object-fit: cover;
  position: absolute;
  transition: opacity 1s ease-in-out;
}

.banner-content {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
}

.sale-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 5px;
  border-radius: 5px;
  margin: 10px;
}

.sale-badge span:first-child {
  background: #b71c1c;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 10px;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
}

.explore-btn {
  background: #7a3b3b;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.left {
  left: 10px;
}

.right {
  right: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>