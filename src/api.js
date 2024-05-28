import axios from "axios"
import { useAuthStore } from "@/stores/auth"
import router from "@/router"

const axiosApiInstance = axios.create()

const apiKey = import.meta.env.VITE_API_KEY_FIREBASE

axiosApiInstance.interceptors.request.use((config) => {
  const url = config.url

  if (!url.includes('singInWithPassword') && !url.includes('signUp')) {
    const authStore = useAuthStore()
    let params = new URLSearchParams()
    params.append('auth', authStore.userInfo.token)
    config.params = params
  }
  return config
})

// axios.interceptors.request.use((config) => {
//   const url = config.url
//   const authStore = useAuthStore()
//   if (!url.includes('singInWithPassword') && !url.includes('signUp')) {
//     config.headers.Authorization = `Bearer ${authStore.userInfo.token}`
//   }
//   return config
// })

// axios.interceptors.request.use((config) => {
//   const authStore = useAuthStore()
//   config.headers['auth'] = authStore.userInfo.token
//   return config
// })


axiosApiInstance.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const authStore = useAuthStore()
  const originalRequest = error.config
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    try {
      const newTokens = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
        {
          grant_type: 'refresh_token',
          refresh_token: JSON.parse(localStorage.getItem('userTokens')).refreshToken
        }
      )
      console.log(newTokens.data)
      authStore.userInfo.token = newTokens.data.access_token
      authStore.userInfo.refreshToken = newTokens.data.refresh_token
      localStorage.setItem(
        'userTokens',
        JSON.stringify({
          token: newTokens.data.access_token,
          refreshToken: newTokens.data.refresh_token
        })
      )
      // Установите новый токен доступа в исходный запрос
      // axiosApiInstance.defaults.headers.common['Authorization'] =
      //   `Bearer ${newTokens.data.id_token}`
      // originalRequest.headers['Authorization'] = `Bearer ${newTokens.data.id_token}`
      // return axiosApiInstance(originalRequest)
    } catch (err) {
      console.log(err)
      localStorage.removeItem('userTokens')
      router.push('/signin')
      authStore.userInfo.token = ''
      authStore.userInfo.refreshToken = ''
      return Promise.reject(err)
    }
  }
  // Если ошибка не связана с истекшим токеном, просто верните ошибку
  return Promise.reject(error)
})

export default axiosApiInstance