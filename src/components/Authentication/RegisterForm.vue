<template>
  <div class="register-form">
    <h2 class="label-text">Create New Account</h2>
    <p class="label-text3">Please enter details</p>
    <form @submit.prevent="handleRegister">
      <div class="input-group">
        <label class="label-text2">First Name</label>
        <input type="text" v-model="firstName" required placeholder="Enter your first name" />
      </div>
      <div class="input-group">
        <label class="label-text2">Last Name</label>
        <input type="text" v-model="lastName" required placeholder="Enter your last name" />
      </div>
      <div class="input-group">
        <label class="label-text2">Email Address</label>
        <input type="email" v-model="email" required placeholder="Enter your email" />
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

      <button type="submit" :disabled="!agreeToTerms">Sign Up</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
import { auth, database } from '@/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ref as dbRef, set } from 'firebase/database'

export default {
  setup() {
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const password = ref('')
    const agreeToTerms = ref(false)
    const errorMessage = ref('')
    const router = useRouter()

    const handleRegister = async () => {
      if (!agreeToTerms.value) {
        errorMessage.value = 'You must agree to the Terms & Conditions to register.'
        return
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        )
        const user = userCredential.user

        // Lưu thông tin vào Firebase Database
        await set(dbRef(database, `authentication/${user.uid}`), {
          FirstName: firstName.value,
          LastName: lastName.value,
          Email: email.value,
          Role: 'user', // Mặc định role là user
        })

        // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
        router.push('/login')
      } catch (error) {
        errorMessage.value = error.message
      }
    }

    return { firstName, lastName, email, password, agreeToTerms, handleRegister, errorMessage }
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
