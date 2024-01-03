import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import {createPinia} from "pinia"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/styles/variable.css'
import './assets/styles/custom.css'
import './assets/styles/font.css'

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
