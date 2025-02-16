import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, ref, get } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAA5FhDoGu035Jp8T2U_kbFR5mIkw2ZLjE',
  authDomain: 'pnjstore-66a4d.firebaseapp.com',
  databaseURL: 'https://pnjstore-66a4d-default-rtdb.firebaseio.com',
  projectId: 'pnjstore-66a4d',
  storageBucket: 'pnjstore-66a4d.firebasestorage.app',
  messagingSenderId: '539018143078',
  appId: '1:539018143078:web:126f01e0220e4842c8d4a7',
  measurementId: 'G-TB64N72S0C',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const database = getDatabase(app)

export { auth, database, signInWithEmailAndPassword, ref, get }
