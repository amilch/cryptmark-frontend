import {reactive, watch} from 'vue'
import router from '../router/index'
import jwt_decode from 'jwt-decode'
import {encryption, fetchAPI, urlUtils} from '@/utils'

const state = reactive({
    auth: {
        token: null,
        masterKey: null,
    },
    bookmarks: null,
    error: null,
})


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
        let res = await fetchAPI(`/users/${username}/seed`)
        if (res.status !== 200) {
            state.error = "Username not found"
            return
        }
        const seed = await res.text()

        const rootKey = await encryption.computeRootKey(username, password, seed)

        res = await fetchAPI(`/auth/authenticate`, 'POST', {
            username: username,
            password: rootKey.serverPassword,
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
        const res = await fetchAPI('/auth/register', 'POST', {
            username: username,
            password: rootKey.serverPassword,
            seed: rootKey.seed,
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

    async logout({sessionTimeout} = {}) {
        state.auth = {
            masterKey: null,
            token: null,
        }
        await router.push('/login')
        if (sessionTimeout) {
            state.error = "You're session ended. Please sign in again."
        }
    },

    async addBookmark(bookmark) {
        const {url, title} = bookmark
        const body = await encryption.encryptItem({
            title: title,
            url: urlUtils.getWholeURL(url)
        }, state.auth.masterKey)

        const res = await fetchAPI('/bookmarks/', 'POST', body)
        if (res.status !== 200) {
            return this.logout({sessionTimeout: true})
        }
        const encryptedBookmark = await res.json()
        const decryptedBookmark = await encryption.decryptBookmark(encryptedBookmark, state.auth.masterKey)
        state.bookmarks.set(decryptedBookmark.id, decryptedBookmark)

        router.replace('/')
    },

    async editBookmark(bookmark) {
        const {id, url, title} = bookmark
        const body = {
            id: id,
            ...await encryption.encryptItem({
                id: id,
                title: title,
                url: urlUtils.getWholeURL(url)
            }, state.auth.masterKey),
        }

        const res = await fetchAPI('/bookmarks/', 'PUT', body)
        if (res.status !== 200) {
            return this.logout({sessionTimeout: true})
        }

        const encryptedBookmark = await res.json()
        const decryptedBookmark = await encryption.decryptBookmark(encryptedBookmark, state.auth.masterKey)
        state.bookmarks.set(decryptedBookmark.id, decryptedBookmark)

        router.replace('/')
    },

    async getAllBookmarks() {
        const res = await fetchAPI('/bookmarks/', 'GET')
        if (res.status !== 200) {
            return this.logout({sessionTimeout: true})
        }
        const bookmarks = await res.json()
        console.log(bookmarks)
        const decryptedBookmarks = await Promise.all(bookmarks.map((bookmark) => encryption.decryptBookmark(bookmark, state.auth.masterKey)))
        console.log(decryptedBookmarks)
        state.bookmarks = new Map(decryptedBookmarks.map(b => [b.id, b]))
    }
    ,

    async removeBookmark(bookmark) {
        state.bookmarks.delete(bookmark.id)

        const res = await fetchAPI(`/bookmarks/${bookmark.id}`, 'DELETE')
        if (res.status !== 200) {
            return this.logout({sessionTimeout: true})
        }
    },

    visitBookmark(bookmark) {
        window.open(bookmark.url, '_blank')
    }
}

try {
    const auth = JSON.parse(sessionStorage.getItem('auth'))
    if (auth) {
        state.auth = auth
    }
} catch (e) {}

watch(() => state.auth, auth => {
    sessionStorage.setItem('auth', JSON.stringify(auth))
}, {deep: true})

export default {
    state,
    getters,
    actions,
}
