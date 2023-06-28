import {reactive} from 'vue'
import router from '../router/index'
import jwt_decode from 'jwt-decode'
import encryption from '@/utils/encryption'

const baseUrl = `${import.meta.env.VITE_API_URL}`

const state = reactive({
    token: null,
    masterKey: null,
    bookmarks: null,
    lastUpdate: null,
    error: null,
})

const mutations = {
    setToken(token) {
        state.token = token
    },
    setMasterKey(key) {
        state.masterKey = key
    },
    setError(error) {
        state.error = error
    },
    clearError(error) {
        state.error = null
    }
}

const getters = {
    username() {
        return jwt_decode(state.token).sub
    },
    isLoggedIn() {
        return !!state.token
    },
    bookmark(id) {
        return state.bookmarks.get(id)
    }
}

const actions = {
    async authenticate(username, password) {
        let res = await fetch(`${baseUrl}/users/${username}/seed`)
        if (res.status !== 200) {
            mutations.setError("Username not found")
            return
        }
        const seed = await res.text()

        const rootKey = await encryption.computeRootKey(username, password, seed)

        res = await fetch(`${baseUrl}/auth/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: rootKey.serverPassword,
            })
        })
        if (res.status !== 200) {
            mutations.setError("Could not log in. Is your password correct?")
            return
        }
        const {token} = await res.json()

        mutations.setToken(token)
        mutations.setMasterKey(rootKey.masterKey)
        router.replace('/')
    },

    async signup(username, password) {
        const rootKey = await encryption.computeRootKey(username, password)
        // TODO: change api endpoint from register to signup
        const res = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: rootKey.serverPassword,
                seed: rootKey.seed,
            })
        })
        if (res.status !== 200) {
            mutations.setError("Could not create account. Please try another username.")
            return
        }
        const {token} = await res.json()

        mutations.setToken(token)
        mutations.setMasterKey(rootKey.masterKey)
        router.replace('/')
    },

    async add({url, title}) {
        const body = await encryption.encryptItem({
            title: title,
            url: url
        }, state.masterKey)

        const res = await fetch(`${baseUrl}/bookmarks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + state.token,
            },
            body: JSON.stringify(body)
        })
        const bookmark = await res.json()
        const decryptedBookmark = await encryption.decryptBookmark(bookmark, state.masterKey)
        state.bookmarks.set(decryptedBookmark.id, decryptedBookmark)

        router.replace('/')
    },

    async edit({id, url, title}) {
        const body = {
            id: id,
            ...await encryption.encryptItem({
                id: id,
                title: title,
                url: url
            }, state.masterKey),
        }

        const res = await fetch(`${baseUrl}/bookmarks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + state.token,
            },
            body: JSON.stringify(body)
        })
        const bookmark = await res.json()
        const decryptedBookmark = await encryption.decryptBookmark(bookmark, state.masterKey)
        state.bookmarks.set(decryptedBookmark.id, decryptedBookmark)

        router.replace('/')
    },

    async getAll() {
        const res = await fetch(`${baseUrl}/bookmarks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + state.token,
            },
        })
        const bookmarks = await res.json()
        console.log(bookmarks)
        const decryptedBookmarks = await Promise.all(bookmarks.map((bookmark) => encryption.decryptBookmark(bookmark, state.masterKey)))
        console.log(decryptedBookmarks)
        state.bookmarks = new Map(decryptedBookmarks.map(b => [b.id, b]))
    }
    ,

    async remove(bookmark) {
        const res = await fetch(`${baseUrl}/bookmarks/${bookmark.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + state.token,
            },
        })
        console.log(await res.text)

        state.bookmarks.delete(bookmark.id)
    }
}

export default {
    state,
    mutations,
    getters,
    actions,
}
