<template>
  <div class="login-form">
    <h2 class="label-text">Welcome</h2>
    <p class="label-text3">Please login here</p>

    <!-- Hiển thị thông báo lỗi -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label class="label-text2">Email Address</label>
        <input
          type="email"
          v-model="email"
          required
          placeholder="Enter your email"
          autocomplete="off"
          maxlength="50"
        />
      </div>
      <div class="input-group">
        <label class="label-text2">Password</label>
        <input
          type="password"
          v-model="password"
          required
          placeholder="Enter your password"
          autocomplete="off"
          maxlength="20"
        />
      </div>
      <div class="remember-me">
        <input type="checkbox" v-model="rememberMe" id="rememberMe" />
        <label for="rememberMe" class="label-text2">Remember Me</label>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <p class="register-link">
      Don't have an account?
      <a href="#" @click.prevent="$emit('toggle-form')">Sign up here</a>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, database } from '@/firebaseAuth'
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { ref as dbRef, get } from 'firebase/database'
import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const errorMessage = ref('')
    const isLoading = ref(false) // Ngăn spam login
    const router = useRouter()
    const userStore = useUserStore()

    const handleLogin = async () => {
      errorMessage.value = ''
      isLoading.value = true

      // Kiểm tra đầu vào trước khi gửi request
      if (!email.value.trim()) {
        errorMessage.value = 'Vui lòng nhập email.'
        isLoading.value = false
        return
      }
      if (!password.value.trim()) {
        errorMessage.value = 'Vui lòng nhập mật khẩu.'
        isLoading.value = false
        return
      }

      try {
        // Chọn cách lưu đăng nhập
        await setPersistence(
          auth,
          rememberMe.value ? browserLocalPersistence : browserSessionPersistence
        )

        // Thực hiện đăng nhập
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        const user = userCredential.user

        // Lưu token vào localStorage
        const idToken = await user.getIdToken()
        localStorage.setItem('userToken', idToken)

        // Lấy role của user từ database
        const userRef = dbRef(database, `users/${user.uid}/role`)
        const snapshot = await get(userRef)

        if (snapshot.exists()) {
          const role = snapshot.val()
          localStorage.setItem('userRole', role)
          localStorage.setItem('uid', user.uid)

          // Cập nhật user vào store
          userStore.setUser({ uid: user.uid, role: role })

          // Điều hướng theo vai trò
          router.push(role === 'admin' ? '/admin-home' : '/user-home')
        } else {
          errorMessage.value = 'Không tìm thấy quyền của người dùng. Vui lòng liên hệ hỗ trợ.'
          localStorage.removeItem('userToken')
        }
      } catch (error) {
        console.log(error.code)
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage.value = 'Email không hợp lệ.'
            break
          case 'auth/invalid-credential':
            errorMessage.value = 'Tài khoản hoặc mật khẩu không đúng'
            break
          case 'auth/wrong-password':
            errorMessage.value = 'Mật khẩu không đúng.'
            break
          case 'auth/too-many-requests':
            errorMessage.value = 'Bạn đã nhập sai quá nhiều lần, thử lại sau.'
            break
          case 'auth/network-request-failed':
            errorMessage.value = 'Lỗi mạng, vui lòng kiểm tra kết nối.'
            break
          default:
            errorMessage.value = 'Đăng nhập thất bại. Vui lòng thử lại.'
        }
      } finally {
        isLoading.value = false
      }
    }

    return { email, password, rememberMe, errorMessage, handleLogin, isLoading }
  },
}
</script>





<style scoped>
/* Container */
.login-form {
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
  font-size: 14px;
  color: #303030;
}
.label-text3 {
  font-size: 12px;
  color: #555;
  margin-bottom: 10px;
}
/* Input */
.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 3px;
}

input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

/* Remember Me */
.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 10px;
}

.remember-me input {
  width: 16px;
  height: 16px;
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

/* Register Link */
.register-link {
  margin-top: 1rem;
  font-size: 14px;
}

.register-link a {
  color: #000000;
  text-decoration: none;
  font-weight: bold;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
