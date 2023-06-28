import store from '@/store/index'

async function fetchAPI(url, method, body = null) {
    const res = await fetch(import.meta.env.VITE_API_URL + url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...(!store.getters.isLoggedIn() ? {} : {
                'Authorization': 'Bearer ' + store.state.auth.token,
            })
        },
        ...(!body ? {} : { body: JSON.stringify(body) }),
    })
    return res
}

export default fetchAPI