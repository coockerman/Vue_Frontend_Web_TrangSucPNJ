import { initializeApp, getApps, getApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfigStorage = {
  apiKey: 'AIzaSyBexFQJ5ejdnkhCdeEFp-Ja-7qh7lF53_Y',
  authDomain: 'duan-4904c.firebaseapp.com',
  databaseURL: 'https://duan-4904c-default-rtdb.firebaseio.com',
  projectId: 'duan-4904c',
  storageBucket: 'duan-4904c.appspot.com',
  messagingSenderId: '437436814903',
  appId: '1:437436814903:web:c0f25b370ae545681391b2',
  measurementId: 'G-NT3171KZEW',
}

// Kiểm tra nếu Firebase Storage app đã tồn tại chưa
const storageApp = getApps().find((app) => app.name === 'storageApp')
  ? getApp('storageApp')
  : initializeApp(firebaseConfigStorage, 'storageApp')

// Khởi tạo Firebase Storage
const storage = getStorage(storageApp)

export { storage }
