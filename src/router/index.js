import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store/index.js'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/ListView.vue')
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
                default: () => import('../views/ListView.vue'),
                dialog: () => import('../views/AddView.vue'),
            }
        },
    ]
})

router.beforeEach(async (to, from) => {
    store.mutations.clearError()
    if (!store.getters.isLoggedIn() && to.name !== 'login' && to.name !== 'signup') {
        return {name: 'login'}
    }
})

export default router
