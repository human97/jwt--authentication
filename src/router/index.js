import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignUpView from '@/views/SignUpView.vue'
import SignInView from '@/views/SignInView.vue'
import CarsView from '@/views/CarsView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
      meta: {
        auth: false
      }
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView,
      meta: {
        auth: false
      }
    },
    {
      path: '/cars',
      name: 'cars',
      component: CarsView,
      meta: {
        auth: true
      }
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // if (to.meta.auth && !authStore.userInfo.token) {
  //   next('/signin')
  // } else if  (!to.meta.auth && authStore.userInfo.token) {
  //   next('/cars')
  // } else {
  //   next()
  // }
  
  // Если путь требует аутентификации и пользователь не залогинен
  if (to.meta.auth && !authStore.userInfo.token) {
    // Если путь требует аутентификации и токен отсутствует.
    next('/signin')
  } else if (!to.meta.auth && to.name !== 'home' && authStore.userInfo.token) {
    // Если путь не требует аутентификации и пользователь уже залогинен,
    // перенаправляем на Home, за исключением случая, когда пользователь уже находится на Home.
    next('/')
  } else {
    // Во всех остальных случаях выполняем переход как запланировано.
    next()
  }
})

export default router
