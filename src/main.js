import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from '@/firebaseAuth'
import { onAuthStateChanged } from 'firebase/auth'
import { createPinia } from 'pinia'

const pinia = createPinia() // ✅ Tạo một instance Pinia
const app = createApp(App)

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const idToken = await user.getIdToken()
    localStorage.setItem('userToken', idToken)
  } else {
    localStorage.removeItem('userToken')
  }
})

app.use(pinia) // ✅ Sử dụng instance đã tạo
app.use(router)
app.mount('#app')
