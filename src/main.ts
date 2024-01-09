import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { useUserStore } from '@/store/modules/user.ts'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/styles/variable.css'
import './assets/styles/custom.css'
import './assets/styles/font.css'

const pinia = createPinia()
const app = createApp(App)
pinia.use(piniaPluginPersistedstate)
app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

if (window.microApp) {
  const UserStore = useUserStore()
  const data = window.microApp.getData()
  UserStore.setUserInfo(data.memberInfo)
  // 当基座下发跳转指令时进行跳转
  if (data.path) {
    router.push(data.path)
  }
}

// 监听卸载操作
window.addEventListener('unmount', function () {
  app.unmount()
  // 卸载所有数据监听函数
  window.microApp?.clearDataListener()
})
