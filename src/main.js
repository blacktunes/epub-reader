import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style/transition.styl'
import LazyPlugin from './assets/script/LazyPlugin'

createApp(App)
  .use(router)
  .use(LazyPlugin)
  .mount('#app')
