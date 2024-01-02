import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/pages/home.vue'),  // 配置路径别名后，可以使用@
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router