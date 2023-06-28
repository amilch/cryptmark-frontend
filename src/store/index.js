import {reactive, watch} from 'vue'
import router from '../router/index'
import jwt_decode from 'jwt-decode'
import encryption from '@/utils/encryption'

const baseUrl = `${import.meta.env.VITE_API_URL}`

const state = reactive({
    auth: {
        token: null,
        masterKey: null,
    },
    bookmarks: null,
    error: null,
})

try {
    const auth = JSON.parse(sessionStorage.getItem('auth'))
    if (auth) {
        state.auth = auth
    }
} catch (e) {}

watch(() => state.auth, auth => {
    sessionStorage.setItem('auth', JSON.stringify(auth))
}, {deep: true})

const getters = {
    username() {
        return jwt_decode(state.auth.token).sub
    },
    isLoggedIn() {
        return !!state.auth.token
    },
    bookmark(id) {
        return state.bookmarks.get(id)
    }
}

const actions = {
    async authenticate(username, password) {
        let res = await fetch(`${baseUrl}/users/${username}/seed`)
        if (res.status !== 200) {
            state.error = "Username not found"
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
            state.error = "Could not log in. Is your password correct?"
            return
        }
        const {token} = await res.json()

        state.auth.token = token
        state.auth.masterKey = rootKey.masterKey
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
            state.error = "Could not create account. Please try another username."
            return
        }
        const {token} = await res.json()

        state.auth.token = token
        state.auth.masterKey = rootKey.masterKey
        router.replace('/')
    },

    async add({url, title}) {
        const body = await encryption.encryptItem({
            title: title,
            url: url
        }, state.auth.masterKey)

        const res = await fetch(`${baseUrl}/bookmarks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + state.auth.token,
            },
            body: JSON.stringify(body)
        })
        const bookmark = await res.json()
        const decryptedBookmark = await encryption.decryptBookmark(bookmark, state.auth.masterKey)
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
            }, state.auth.masterKey),
        }

        const res = await fetch(`${baseUrl}/bookmarks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + state.auth.token,
            },
            body: JSON.stringify(body)
        })
        const bookmark = await res.json()
        const decryptedBookmark = await encryption.decryptBookmark(bookmark, state.auth.masterKey)
        state.bookmarks.set(decryptedBookmark.id, decryptedBookmark)

        router.replace('/')
    },

    async getAll() {
        const res = await fetch(`${baseUrl}/bookmarks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + state.auth.token,
            },
        })
        const bookmarks = await res.json()
        console.log(bookmarks)
        const decryptedBookmarks = await Promise.all(bookmarks.map((bookmark) => encryption.decryptBookmark(bookmark, state.auth.masterKey)))
        console.log(decryptedBookmarks)
        state.bookmarks = new Map(decryptedBookmarks.map(b => [b.id, b]))
    }
    ,

    async remove(bookmark) {
        const res = await fetch(`${baseUrl}/bookmarks/${bookmark.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + state.auth.token,
            },
        })
        console.log(await res.text)

        state.bookmarks.delete(bookmark.id)
    },

    async logout() {
        state.auth = {
            masterKey: null,
            token: null,
        }
        await router.push('/login')
    }
}

export default {
    state,
    getters,
    actions,
}
