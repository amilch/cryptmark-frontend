import { describe, it, expect, vi } from 'vitest'

import store from "@/store";
import { fetchAPI } from "../fetchAPI";

describe('utils/fetchAPI', () => {
    it('doesSendBearerTokenWithRequestIfLoggedIn', async () => {
        store.getters.isLoggedIn = vi.fn()
        store.getters.isLoggedIn.mockReturnValue(true)
        store.state.auth.token = 'token'
        global.fetch = vi.fn()

        await fetchAPI('/', 'GET')

        expect(global.fetch).toHaveBeenCalledWith(
            import.meta.env.VITE_API_URL + '/',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token'
                }
            })
    })

    it('doesNotSendBearerTokenWithRequestIfNotLoggedIn', async () => {
        store.getters.isLoggedIn = vi.fn()
        store.getters.isLoggedIn.mockReturnValue(false)
        store.state.auth.token = 'token'
        global.fetch = vi.fn()

        await fetchAPI('/', 'GET')

        expect(global.fetch).toHaveBeenCalledWith(
            import.meta.env.VITE_API_URL + '/',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    })
})