
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {useRouter} from 'vue-router'

import InputText from 'primevue/inputtext'
import AppButton from 'primevue/button'
import AppMessage from 'primevue/message'
import AppLoader from '@/components/AppLoader.vue'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const signup = async () => {
  await authStore.auth({ email: email.value, password: password.value }, 'signup')
  router.push('/cars')
}
</script>

<template>
  <div class="container">
    <h2>Sign Up</h2>
  <form class="flex flex-column gap-3">
    <app-message v-if="authStore.error" severity="error">{{ authStore.error }}</app-message>
    <div class="p-inputgroup flex-1">
      <span class="p-inputgroup-addon">
          <i class="pi pi-user"></i>
      </span>
      <InputText 
        type="email" 
        v-model="email" 
        placeholder="Your Email" 
      />
    </div>
    <div class="p-inputgroup flex-1">
      <span class="p-inputgroup-addon">
          <i class="pi pi-at"></i>
      </span>
      <InputText 
        type="password" 
        v-model="password" 
        placeholder="Password" 
      />
    </div>
    <AppLoader v-if="authStore.loader"/>
    <div 
      v-else 
      class="flex flex-column gap-3">
      <AppButton 
        @click="signup" 
        label="Sign up"
      />
      <span>Are you already registered? <router-link  to="/signin">Sign in</router-link></span>
    </div>
  </form>
  </div>
</template>

<style>
.container {
  margin: auto;
  width: 400px;
}
</style>