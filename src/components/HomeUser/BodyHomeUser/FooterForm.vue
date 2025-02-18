<template>
  <footer class="footer-container">
    <div class="footer-content">
      <!-- Cột 1: Logo & Thông tin công ty -->
      <div class="footer-col-big">
        <img src="@/assets/Img/Logo.png" alt="PNJ Logo" class="footer-logo" />
        <p>© 2017 Công Ty Cổ Phần Vàng Bạc Đá Quý Phú Nhuận</p>
        <p>170E Phan Đăng Lưu, P.4, Q.Phú Nhuận, TP.Hồ Chí Minh</p>
        <p>ĐT: 028 39951703 - Fax: 028 3995 1702</p>
        <p>Giấy chứng nhận ĐKKD: 0300521758</p>
        <p>Tổng đài hỗ trợ (08:00-21:00): <strong>1800545457</strong></p>
      </div>

      <!-- Cột 2: Về PNJ -->
      <div class="footer-col">
        <h3>VỀ PNJ</h3>
        <ul>
          <li><a href="#">Câu chuyện PNJ</a></li>
          <li><a href="#">Tuyển dụng</a></li>
          <li><a href="#">Xuất khẩu</a></li>
          <li><a href="#">Kinh doanh sỉ</a></li>
          <li><a href="#">Kiểm định kim cương</a></li>
          <li><a href="#">Quà tặng doanh nghiệp</a></li>
        </ul>
      </div>

      <!-- Cột 3: Dịch vụ khách hàng & Chính sách -->
      <div class="footer-col">
        <h3>DỊCH VỤ KHÁCH HÀNG</h3>
        <ul>
          <li><a href="#">Hướng dẫn đo size trang sức</a></li>
          <li><a href="#">Mua hàng trả góp</a></li>
          <li><a href="#">Hướng dẫn mua hàng & thanh toán</a></li>
          <li><a href="#">Cẩm nang sử dụng trang sức</a></li>
          <li><a href="#">Câu hỏi thường gặp</a></li>
        </ul>
        <h3>TỔNG HỢP CÁC CHÍNH SÁCH PNJ</h3>
        <ul>
          <li><a href="#">Chính sách hoàn tiền</a></li>
          <li><a href="#">Chính sách giao hàng</a></li>
          <li><a href="#">Chính sách bảo hành thu đổi</a></li>
          <li><a href="#">Chính sách khách hàng thân thiết</a></li>
          <li><a href="#">Chính sách bảo mật thông tin</a></li>
          <li><a href="#">Chính sách xử lý dữ liệu cá nhân</a></li>
        </ul>
      </div>

      <!-- Cột 4: Thanh toán & Mạng xã hội -->
      <div class="footer-col">
        <h3>PHƯƠNG THỨC THANH TOÁN</h3>
        <div class="payment-methods">
          <img src="@/assets/Logo/Visa.png" alt="Visa" />
          <img src="@/assets/Logo/MasterCard.png" alt="MasterCard" />
          <img src="@/assets/Logo/Paypal.png" alt="PayPal" />
          <img src="@/assets/Logo/ApplePay.png" alt="Apple Pay" />
          <img src="@/assets/Logo/GooglePay.png" alt="Google Pay" />
        </div>
        <h3>KẾT NỐI VỚI CHÚNG TÔI</h3>
        <div class="social-icons">
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-github"></i></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-container {
  background-color: #f4f4f4;
  padding: 40px 60px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.footer-col-big {
  width: 35%;
}
.footer-col {
  width: 20%;
}

.footer-logo {
  width: 160px;
  margin-bottom: 10px;
}

h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 5px;
}

ul li a {
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  color: #333;
}

ul li a:hover {
  color: #d19c97;
}

.payment-methods img {
  width: 40px;
  margin-right: 5px;
}

.social-icons a {
  margin-right: 10px;
  font-size: 20px;
  color: #333;
  text-decoration: none;
}

.social-icons a:hover {
  color: #d19c97;
}
</style>
