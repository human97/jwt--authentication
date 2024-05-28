import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { initializeApp } from 'firebase/app'
import '@/api'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyDphk0X2Copw_1zoPVnmP4dLwtoSDfaLog',
  authDomain: 'jwt-auth-2f15e.firebaseapp.com',
  projectId: 'jwt-auth-2f15e',
  storageBucket: 'jwt-auth-2f15e.appspot.com',
  messagingSenderId: '355302824242',
  appId: '1:355302824242:web:d9d9e7afb5a205c8a7df2b'
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)

app.mount('#app')
