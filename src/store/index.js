import {reactive} from 'vue'
import router from '../router/index'
import jwt_decode from 'jwt-decode'
import encryption from '../encryption/index'

const state = reactive({
    token: null,
    masterKey: null,
    bookmarks: [],
    lastUpdate: null,
})

const mutations = {
    setToken(token) {
        state.token = token
    },
    setMasterKey(key) {
        state.masterKey = key
    },
    setBookmarks(bookmarks) {
        state.bookmarks = bookmarks
    },
}

const getters = {
    username() {
        return jwt_decode(state.token).sub
    },
    isLoggedIn() {
        return !!state.token
    },
}

const actions = {
    async authenticate(username, password) {
        let res = await fetch('http://localhost:8080/users/' + username + '/seed')
        const seed = await res.text()

        const rootKey = await encryption.computeRootKey(username, password, seed)
        res = await fetch('http://localhost:8080/auth/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: rootKey.serverPassword,
            })
        })
        const {token} = await res.json()
        mutations.setToken(token)
        mutations.setMasterKey(rootKey.masterKey)
        router.replace('/')
    },

    async register(username, password) {
        const rootKey = await encryption.computeRootKey(username, password)
        const res = await fetch('http://localhost:8080/auth/register', {
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
        const {token} = await res.json()
        mutations.setToken(token)
        mutations.setMasterKey(rootKey.masterKey)
        router.replace('/')
    },

    async add(title, url) {
        const body = await encryption.encryptItem({
            title: title,
            url: url
        }, state.masterKey)
        const res = await fetch('http://localhost:8080/bookmarks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + state.token,
            },
            body: JSON.stringify(body)
        })
        const bookmark = await res.json()
        const decryptedBookmark = await encryption.decryptBookmark(bookmark, state.masterKey)
        state.bookmarks.push(decryptedBookmark)

        router.replace('/')
    },

    async getAll() {
        const res = await fetch('http://localhost:8080/users/' + getters.username() + '/bookmarks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + state.token,
            },
        })
        const bookmarks = await res.json()
        console.log(bookmarks)

        const decryptedBookmarks = await Promise.all(bookmarks.map((bookmark) => encryption.decryptBookmark(bookmark, state.masterKey)))
        mutations.setBookmarks(decryptedBookmarks)
        console.log(decryptedBookmarks)
    },
}

export default {
    state,
    mutations,
    getters,
    actions,
}
