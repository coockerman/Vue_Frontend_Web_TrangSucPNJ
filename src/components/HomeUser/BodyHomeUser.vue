<template>
  <div class="container">
    <Banner />
    <ProductListBtn title="Trang sức" :products="jewelryProducts"/>
    <ProductListBtn title="Trang sức cưới" :products="jewelryWeddingProducts" />
    <Promotion />
    <Footer />
  </div>
</template>
  <script>
import Banner from '@/components/HomeUser/BodyHomeUser/BannerForm.vue'
import ProductListBtn from '@/components/HomeUser/BodyHomeUser/ProductListBtn.vue'
import Footer from '@/components/HomeUser/BodyHomeUser/FooterForm.vue'
import Promotion from '@/components/HomeUser/BodyHomeUser/PromotionSection.vue'
export default {
  components: {
    Banner,
    ProductListBtn,
    Footer,
    Promotion,
  },
  data() {
    return {
      jewelryProducts: [
        {
          id: 1,
          name: 'Nhẫn',
          type: 'Nhẫn',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20trang%20s%E1%BB%A9c%2FTrangsuc_nhan.png?alt=media&token=71f900cb-5a5a-416a-a344-1b47e9a596dc',
        },
        {
          id: 2,
          name: 'Dây chuyền',
          type: 'Dây chuyền',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20trang%20s%E1%BB%A9c%2FTrangsuc_Day%20chuyen.png?alt=media&token=cb06cc56-3ff1-4792-96bb-1f0ef7341431',
        },
        {
          id: 3,
          name: 'Vòng lắc',
          type: 'Vòng lắc',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20trang%20s%E1%BB%A9c%2FTrangsuc_vonglac.png?alt=media&token=cd3ea018-2f22-4eca-907e-f85b51c37a3c',
        },
        {
          id: 4,
          name: 'Bông tai',
          type: 'Bông tai',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20trang%20s%E1%BB%A9c%2FTrangsuc_Bong%20tai.png?alt=media&token=3c988ee2-6e5d-4fc3-9ef6-00c4b52e37ec',
        },
      ],
      jewelryWeddingProducts: [
        {
          id: 1,
          name: 'Nhẫn cầu hôn',
          type: 'Nhẫn cầu hôn',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20trang%20s%E1%BB%A9c%20c%C6%B0%E1%BB%9Bi%2FTrangsuccuoi_NCH.png?alt=media&token=6fb00b9c-fb68-4376-baa4-71550ddcb39d',
        },
        {
          id: 2,
          name: 'Nhẫn cưới',
          type: 'Nhẫn cưới',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20trang%20s%E1%BB%A9c%20c%C6%B0%E1%BB%9Bi%2FTrangsuccuoi_nhancuoi.png?alt=media&token=77079451-7383-4c15-b6f6-41840a1fbcf6',
        },
        {
          id: 3,
          name: 'Nhẫn cặp',
          type: 'Nhẫn cặp',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20trang%20s%E1%BB%A9c%20c%C6%B0%E1%BB%9Bi%2FTrangsuccuoi_NC%E1%BA%B7p.png?alt=media&token=c7e65c4d-c23a-4b62-ae9b-02adc269b396',
        },
        {
          id: 4,
          name: 'Kiềng',
          type: 'Kiềng',
          image:
            'https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20trang%20s%E1%BB%A9c%20c%C6%B0%E1%BB%9Bi%2FTrang%20s%E1%BB%A9c%20c%C6%B0%E1%BB%9Bi_Ki%E1%BB%81ng.png?alt=media&token=ced7869c-65b3-410f-8713-bd9793be909c',
        },
      ],
    }
  },
}
</script>