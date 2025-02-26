import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from '@/firebaseAuth'
import { onAuthStateChanged } from 'firebase/auth'

const app = createApp(App)

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const idToken = await user.getIdToken()
    localStorage.setItem('userToken', idToken)
  } else {
    localStorage.removeItem('userToken')
  }
})

app.use(router)
app.mount('#app')
