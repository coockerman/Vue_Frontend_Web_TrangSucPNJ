<template>
  <div class="promotion-section">
    <h2 class="title">Món quà tuyệt vời cho tình yêu của bạn</h2>
    <PromotionCard
      title="Vì em là duy nhất"
      description="Bộ sưu tập lấy cảm hứng từ Only You, với hình ảnh chữ O và U lồng ghép vào nhau tạo thành biểu tượng tinh tế, khéo léo mang vào thiết kế để tạo nên chiếc nhẫn cầu hôn với ý nghĩa đặc biệt: Chỉ trao tình yêu duy nhất một đời."
      image="/src/assets/Promotion/promotion1.png"
      image_child="https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FTrang%20s%E1%BB%A9c%2FNh%E1%BA%ABn%2FN-B1.1.png?alt=media&token=feabbd77-4376-4ac0-a8bf-a003fd65bf9e"
      buttonText="SEE NOW"
      :reverse="true"
    />
    <PromotionCard
      title="Chốt mê"
      description="Tình yêu là sự rung động từ trái tim, là những khoảnh khắc đáng trân quý mà ta luôn muốn gìn giữ. Bộ sưu tập Chót Mê ra đời như một cách tôn vinh cảm xúc chân thành, giúp bạn gửi gắm những lời yêu thương sâu sắc qua từng thiết kế trang sức tinh xảo."
      image="/src/assets/Promotion/promotion2.png"
      buttonText="SEE NOW"
    />
    <MiddleComponent
      title="Tuyệt tác trang sức – Tỏa sáng tình yêu"
      description="Tạo bất ngờ cho người thương với những thiết kế trang sức sang trọng từ PNJ. Với các bộ sưu tập nhẫn kim cương, dây chuyền, lắc tay, điển hình tạo điểm nhấn quý giá."
      backgroundImage="/src/assets/Promotion/promotionMiddle.png"
      buttonText="SEE ALL"
    />
    <PromotionCard
      title="Quý phái"
      description="Tỏa sáng với những thiết kế tinh xảo từ PNJ, được chế tác từ vàng, kim cương và đá quý cao cấp. Mỗi đôi bông tai không chỉ tôn vinh nét thanh lịch mà còn là biểu tượng của sự sang trọng và đẳng cấp, giúp bạn luôn rạng rỡ trong mọi khoảnh khắc."
      image="/src/assets/Promotion/promotion3.png"
      image_child="https://firebasestorage.googleapis.com/v0/b/duan-4904c.appspot.com/o/flutter_pnj%2FTrang%20s%E1%BB%A9c%20c%C6%B0%E1%BB%9Bi%2FNh%E1%BA%ABn%20c%E1%BA%A7u%20h%C3%B4n%2FNCH-24VA1.1.png?alt=media&token=b38523eb-9ecc-4bf4-b055-fc07b76ad8f1"
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
  