import { ref } from 'vue'
import { defineStore } from 'pinia'
import axiosApiInstance from '@/api'

const apiKey = import.meta.env.VITE_API_KEY_FIREBASE

export const useAuthStore = defineStore('auth', () => {
  const userInfo = ref({
    token: '',
    email: '',
    userId: '',
    refreshToken: '',
  })

  const error = ref('')
  const loader = ref(false)
  
  const auth = async (payload, type) => { 
    const authType = type === 'signup' ? 'signUp' : 'signInWithPassword'
    error.value = ''
    loader.value = true

    try {
      let response = await axiosApiInstance.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:${authType}?key=${apiKey}`,
        {
          ...payload,
          returnSecureToken: true
        }
      )

      userInfo.value = {
        token: response.data.idToken,
        email: response.data.email,
        userId: response.data.localId,
        refreshToken: response.data.refreshToken,
      }

      localStorage.setItem(
        'userTokens',
        JSON.stringify({
          token: userInfo.value.token,
          refreshToken: userInfo.value.refreshToken,
        })
      )

    } catch (err) {
      switch (err.response.data.error.message) {
        case 'EMAIL_EXISTS':
          error.value = 'Email already exists'
          break
        case 'OPERATION_NOT_ALLOWED':
          error.value = 'Password sign-in is disabled for this project'
          break
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          error.value = 'Too many attempts, please try again later'
          break
        case 'EMAIL_NOT_FOUND':
          error.value =
            'There is no user record corresponding to this identifier. The user may have been deleted'
          break
        case 'INVALID_PASSWORD':
          error.value = 'The password is invalid or the user does not have a password'
          break
        case 'USER_DISABLED':
          error.value = 'The user account has been disabled by an administrator'
          break
        case 'INVALID_EMAIL':
          error.value = 'The email address is badly formatted'
          break
        case 'MISSING_PASSWORD':
          error.value = 'Password is required'
          break
        case 'USER_NOT_FOUND':
          error.value = 'There is no user record corresponding to this identifier. The user may have been deleted'
          break
        default:
          error.value = `${err.response.data.error.message}`
          break
      }
      throw error.value
    } finally {
      loader.value = false
    }
  }

  const logout = () => {
    userInfo.value = {
      token: '',
      email: '',
      userId: '',
      refreshToken: '',
    }
  }

  return { auth, userInfo, error, loader, logout }
})
