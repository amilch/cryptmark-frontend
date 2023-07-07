import { describe, it, expect, vi } from 'vitest'

import router from "../index";
import store from "@/store";

describe('routingtest', () => {
    it('redirects / if not logged in', async () => {
        store.getters.isLoggedIn = vi.fn().mockReturnValue(false)

        await router.push('/')

        expect(router.currentRoute.value.path).equals('/login')
    })

    it('does allow /signup even if not logged in', async () => {
        store.getters.isLoggedIn = vi.fn().mockReturnValue(false)

        await router.push('/signup')

        expect(router.currentRoute.value.path).equals('/signup')
    })

    it('does not redirect / if logged in', async () => {
        store.getters.isLoggedIn = vi.fn().mockReturnValue(true)

        await router.push('/')

        expect(router.currentRoute.value.path).equals('/')
    })

    it('does redirect /login if already logged in', async () => {
        store.getters.isLoggedIn = vi.fn().mockReturnValue(true)

        await router.push('/login')

        expect(router.currentRoute.value.path).equals('/')
    })

    it('does redirect /signup if already logged in', async () => {
        store.getters.isLoggedIn = vi.fn().mockReturnValue(true)

        await router.push('/signup')

        expect(router.currentRoute.value.path).equals('/')
    })
})