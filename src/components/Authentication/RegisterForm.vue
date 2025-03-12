<template>
  <div class="register-form">
    <h2 class="label-text">Create New Account</h2>
    <p class="label-text3">Please enter details</p>
    <form @submit.prevent="handleRegister">
      <div class="input-group">
        <label class="label-text2">Full Name</label>
        <input type="text" v-model.trim="fullName" required placeholder="Enter your full name" />
      </div>
      <div class="input-group">
        <label class="label-text2">Email Address</label>
        <input type="email" v-model.trim="email" required placeholder="Enter your email" />
      </div>
      <div class="input-group">
        <label class="label-text2">Password</label>
        <input type="password" v-model="password" required placeholder="Create a password" />
      </div>

      <div class="terms-conditions">
        <input type="checkbox" v-model="agreeToTerms" required />
        <label class="label-text2">
          I agree to the <span class="bold-text">Terms & Conditions</span>
        </label>
      </div>

      <button type="submit" :disabled="!agreeToTerms || isSubmitting">
        {{ isSubmitting ? 'Signing Up...' : 'Sign Up' }}
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </form>
    <p class="login-link">
      Already have an account?
      <a href="#" @click.prevent="$emit('toggle-form')">Login here</a>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, database } from '@/firebaseAuth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ref as dbRef, set } from 'firebase/database'

export default {
  setup(_, { emit }) {
    const fullName = ref('')
    const email = ref('')
    const password = ref('')
    const agreeToTerms = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')
    const isSubmitting = ref(false)
    const router = useRouter()

    const validatePassword = (pwd) => {
      if (pwd.length < 6) return 'Mật khẩu không được ngắn hơn 6 ký tự.'
      if (!/[A-Z]/.test(pwd)) return 'Mật khẩu phải chứa ít nhất một chữ cái hoa.'
      if (!/[0-9]/.test(pwd)) return 'Mật khẩu phải chứa ít nhất một số.'
      return ''
    }

    const handleRegister = async () => {
      // Reset thông báo lỗi và thành công
      errorMessage.value = ''
      successMessage.value = ''

      // Trim dữ liệu nhập vào
      fullName.value = fullName.value.trim()
      email.value = email.value.trim()
      password.value = password.value.trim()

      // Kiểm tra Full Name không được để trống
      if (!fullName.value) {
        errorMessage.value = 'Tên người dùng không được để trống hoặc chỉ chứa khoảng trắng.'
        return
      }

      if (fullName.value.length < 3) {
        errorMessage.value = 'Tên người dùng không được ít hơn 3 ký tự'
        return
      }

      if (fullName.value.length > 50) {
        errorMessage.value = 'Tên người dùng không được nhiều hơn 50 ký tự'
        return
      }

      // Kiểm tra email không được để trống
      if (!email.value) {
        errorMessage.value = 'Email không được để trống hoặc chỉ chứa khoảng trắng.'
        return
      }

      if (email.value.length < 12) {
        errorMessage.value = 'Email không được ít hơn 12 ký tự'
        return
      }

      if (email.value.length > 50) {
        errorMessage.value = 'Email không được nhiều hơn 50 ký tự'
        return
      }

      // Kiểm tra email có đúng định dạng không
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(email.value)) {
        errorMessage.value = 'Email không hợp lệ. Vui lòng nhập đúng định dạng.'
        return
      }

      if (!password.value) {
        errorMessage.value = 'Mật khẩu không được để trống hoặc chỉ chứa khoảng trắng.'
        return
      }

      if (password.value.length > 20) {
        errorMessage.value = 'Mật khẩu không được nhiều hơn 20 ký tự'
        return
      }

      // Kiểm tra lỗi mật khẩu
      errorMessage.value = validatePassword(password.value)
      if (errorMessage.value) return

      // Kiểm tra nếu chưa đồng ý điều khoản
      if (!agreeToTerms.value) {
        errorMessage.value = 'Bạn phải đồng ý với Điều khoản & Dịch vụ để đăng ký.'
        return
      }

      isSubmitting.value = true

      try {
        // Đăng ký tài khoản với Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        )
        const user = userCredential.user

        // Lưu thông tin người dùng vào Firebase Database
        await set(dbRef(database, `users/${user.uid}`), {
          fullName: fullName.value,
          email: email.value,
          role: 'user',
        })

        // Hiển thị thông báo thành công và chuyển trang
        successMessage.value = 'Đăng ký thành công! Đang chuyển hướng...'
        setTimeout(() => {
          emit('toggle-form') // Chuyển sang form đăng nhập
        }, 2000)
      } catch (error) {
        // Xử lý lỗi từ Firebase Auth
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage.value = 'Email đã được sử dụng. Vui lòng thử email khác.'
            break
          case 'auth/invalid-email':
            errorMessage.value = 'Email không hợp lệ. Vui lòng nhập đúng định dạng.'
            break
          case 'auth/weak-password':
            errorMessage.value =
              'Mật khẩu quá yếu. Vui lòng nhập ít nhất 6 ký tự, bao gồm chữ hoa và số.'
            break
          case 'auth/operation-not-allowed':
            errorMessage.value = 'Chức năng đăng ký hiện đang bị vô hiệu hóa.'
            break
          case 'auth/network-request-failed':
            errorMessage.value = 'Kết nối mạng bị lỗi. Vui lòng kiểm tra internet và thử lại.'
            break
          default:
            errorMessage.value = 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
        }
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      fullName,
      email,
      password,
      agreeToTerms,
      handleRegister,
      errorMessage,
      successMessage,
      isSubmitting,
    }
  },
}
</script>


<style scoped>
/* Container */
.register-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 350px;
}

/* Heading */
.label-text {
  font-size: 24px;
  font-weight: bold;
}

.label-text2 {
  font-size: 12px;
  color: #303030;
}
.label-text3 {
  font-size: 10px;
  color: #555;
  margin-bottom: 10px;
}

/* Input */
.input-group {
  margin-bottom: 0.7rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

/* Terms & Conditions */
.terms-conditions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.terms-conditions input {
  width: 16px;
  height: 16px;
}

.bold-text {
  font-weight: bold;
  color: #000000;
}

/* Button */
button {
  width: 100%;
  padding: 0.8rem;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #333;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

/* Login Link */
.login-link {
  margin-top: 1rem;
  font-size: 14px;
}

.login-link a {
  color: #000000;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
