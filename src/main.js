import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

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

app.mount('#app')