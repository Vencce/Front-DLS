import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// 1. Importe o plugin do Google
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

const observer = new IntersectionObserver(
  (entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('enter-animation')
        observerInstance.unobserve(entry.target)
      }
    })
  },
  {
    threshold: 0.15
  }
)

app.directive('animate', {
  mounted(el) {
    el.classList.add('before-enter-animation')
    observer.observe(el)
  },
  unmounted(el) {
    observer.unobserve(el)
  }
})

app.use(createPinia())
app.use(router)

// 2. Registre o plugin com o seu Client ID
app.use(vue3GoogleLogin, {
  clientId: '643594340805-38qisrhrs767nd57noha1ooick4bv762.apps.googleusercontent.com'
})

app.mount('#app')