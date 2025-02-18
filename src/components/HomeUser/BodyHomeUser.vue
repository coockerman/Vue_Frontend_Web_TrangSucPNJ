<template>
  <div class="container">
    <Banner />
    <ProductList title="Trang sức" :products="jewelryProducts" />
    <ProductList title="Trang sức cưới" :products="jewelryProducts" />
    <Promotion />
    <Footer />
  </div>
</template>
  <script>
import Banner from '@/components/HomeUser/BodyHomeUser/BannerForm.vue'
import ProductList from '@/components/HomeUser/BodyHomeUser/ProductList.vue'
import Footer from '@/components/HomeUser/BodyHomeUser/FooterForm.vue'
import Promotion from '@/components/HomeUser/BodyHomeUser/PromotionSection.vue'
export default {
  components: {
    Banner,
    ProductList,
    Footer,
    Promotion,
  },
  data() {
    return {
      jewelryProducts: [
        {
          id: 1,
          name: 'Nhẫn',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FTrang%20s%E1%BB%A9c%2FNh%E1%BA%ABn%2FN-B1.1.png?alt=media&token=feabbd77-4376-4ac0-a8bf-a003fd65bf9e',
        },
        {
          id: 2,
          name: 'Vòng lắc',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FTrang%20s%E1%BB%A9c%2FV%C3%B2ng-l%E1%BA%AFc%2FVL-14K3.1.png?alt=media&token=f815a063-8f3a-4764-b070-c710c02aa838',
        },
        {
          id: 3,
          name: 'Vòng tay',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FTrang%20s%E1%BB%A9c%2FV%C3%B2ng-l%E1%BA%AFc%2FVL2-10K1.2.png?alt=media&token=d4700f8d-3d4b-4eca-a7da-6e7e887d3cf3',
        },
        {
          id: 4,
          name: 'Vòng tay',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FTrang%20s%E1%BB%A9c%2FV%C3%B2ng-l%E1%BA%AFc%2FVL2-10K1.2.png?alt=media&token=d4700f8d-3d4b-4eca-a7da-6e7e887d3cf3',
        },
      ],
    }
  },
}
</script>