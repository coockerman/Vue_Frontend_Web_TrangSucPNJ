<template>
  <div class="promotion-section">
    <h2 class="title">Món quà tuyệt vời cho tình yêu của bạn</h2>
    <PromotionCard
      title="Vì em là duy nhất"
      description="Bộ sưu tập lấy cảm hứng từ Only You, với hình ảnh chữ O và U lồng ghép vào nhau tạo thành biểu tượng tinh tế, khéo léo mang vào thiết kế để tạo nên chiếc nhẫn cầu hôn với ý nghĩa đặc biệt: Chỉ trao tình yêu duy nhất một đời."
      image="https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20B%E1%BB%99%20s%C6%B0u%20t%E1%BA%ADp%2FBosuutap_Onlyyou.png?alt=media&token=39ff59eb-d3e8-45d3-9d2a-d54cdaaf32fd"
      image_child="https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FTrang%20s%E1%BB%A9c%2FNh%E1%BA%ABn%2FN-B1.1.png?alt=media&token=feabbd77-4376-4ac0-a8bf-a003fd65bf9e"
      buttonText="SEE NOW"
      :reverse="true"
    />
    <PromotionCard
      title="Chốt mê"
      description="Tình yêu là sự rung động từ trái tim, là những khoảnh khắc đáng trân quý mà ta luôn muốn gìn giữ. Bộ sưu tập Chót Mê ra đời như một cách tôn vinh cảm xúc chân thành, giúp bạn gửi gắm những lời yêu thương sâu sắc qua từng thiết kế trang sức tinh xảo."
      image="https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20B%E1%BB%99%20s%C6%B0u%20t%E1%BA%ADp%2FBosuutap_chotme.png?alt=media&token=26539cef-48e3-46ba-a576-be2d23957b5f"
      image_child="https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20B%E1%BB%99%20s%C6%B0u%20t%E1%BA%ADp%2FBosuutap_chotme_bongtaiHome.png?alt=media&token=d4a042f8-60eb-41e1-a1c1-7e9525dd022c"
      buttonText="SEE NOW"
    />
    <MiddleComponent
      title="Tuyệt tác trang sức – Tỏa sáng tình yêu"
      description="Tạo bất ngờ cho người thương với những thiết kế trang sức sang trọng từ PNJ. Với các bộ sưu tập nhẫn kim cương, dây chuyền, lắc tay, điển hình tạo điểm nhấn quý giá."
      backgroundImage="https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20B%E1%BB%99%20s%C6%B0u%20t%E1%BA%ADp%2FBosuutap_tuyettac.png?alt=media&token=d6ad5865-ac5a-4870-8baf-abf8526dc083"
      buttonText="SEE ALL"
    />
    <PromotionCard
      title="Quý phái"
      description="Tỏa sáng với những thiết kế tinh xảo từ PNJ, được chế tác từ vàng, kim cương và đá quý cao cấp. Mỗi đôi bông tai không chỉ tôn vinh nét thanh lịch mà còn là biểu tượng của sự sang trọng và đẳng cấp, giúp bạn luôn rạng rỡ trong mọi khoảnh khắc."
      image="https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20B%E1%BB%99%20s%C6%B0u%20t%E1%BA%ADp%2FBosuutap_quyphai.png?alt=media&token=2ce10389-6483-4861-9d5b-89ca197e6f6b"
      image_child="https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FImage%20Home%2FImage%20B%E1%BB%99%20s%C6%B0u%20t%E1%BA%ADp%2FBosuutap_quyphai_bongtaihome.png?alt=media&token=d1acc849-1376-495f-9d2a-ff92800c0061"
      buttonText="SEE NOW"
      :reverse="true"
    />
    <PromotionCard
      title="Combo ưu đãi"
      description="Khám phá ngay những combo trang sức PNJ với thiết kế tinh xảo, kết hợp hoàn hảo giữa nhẫn, bông tai, dây chuyền và lắc tay. Sở hữu vẻ đẹp sang trọng với mức giá hấp dẫn, giúp bạn tỏa sáng trong mọi dịp đặc biệt!"
      image="/src/assets/Promotion/promotion4.png"
      buttonText="SEE NOW"
      :reverse="true"
    />
  </div>
</template>
  
  <script>
import PromotionCard from '@/components/HomeUser/BodyHomeUser/PromotionSection/PromotionCard.vue'
import MiddleComponent from '@/components/HomeUser/BodyHomeUser/PromotionSection/MiddleComponent.vue'
export default {
  components: {
    PromotionCard,
    MiddleComponent,
  },
}
</script>
  
  <style scoped>
.promotion-section {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  gap: 20px;
}
.title {
  text-align: center;
  font-size: 24px; /* Làm chữ to hơn */
  text-decoration: underline; /* Thêm gạch chân */
  margin-top: 20px;
  font-family: 'Prata', serif;
}
</style>
  