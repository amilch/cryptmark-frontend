import {createRouter, createWebHistory} from 'vue-router'
import store from '../store/index.js'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/add',
            name: 'add',
            components: {
                default: () => import('../views/HomeView.vue'),
                dialog: () => import('../views/AddView.vue'),
            }
        },
        {
            path: '/edit/:id',
            name: 'edit',
            components: {
                default: () => import('../views/HomeView.vue'),
                dialog: () => import('../views/AddView.vue'),
            }
        },
    ]
})

router.beforeEach(async (to, from) => {
    store.state.error = null

    const loginRoutes = ['login', 'signup']
    if (!store.getters.isLoggedIn() && !loginRoutes.includes(to.name)) {
        return {name: 'login'}
    } else if (store.getters.isLoggedIn() && loginRoutes.includes(to.name)) {
        return {name: 'home'}
    }
})

export default router
