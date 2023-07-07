import _sodium from 'libsodium-wrappers-sumo'

async function packCipherNonce(cipher, nonce) {
    await _sodium.ready
    const sodium = _sodium

    return sodium.to_base64(cipher) + ':' + sodium.to_base64(nonce)
}

async function unpackCipherNonce(str) {
    await _sodium.ready
    const sodium = _sodium

    let [cipherb64, nonceb64] = str.split(':')
    return {
        cipher: sodium.from_base64(cipherb64),
        nonce: sodium.from_base64(nonceb64),
    }
}

async function computeRootKey(username, password, seed = null) {
    await _sodium.ready
    const sodium = _sodium

    if (seed === null) {
        seed = sodium.randombytes_buf(32)
    } else {
        seed = sodium.from_base64(seed)
    }

    const salt = sodium.crypto_generichash(sodium.crypto_pwhash_SALTBYTES, sodium.from_string(username + ':' + seed))

    const derivedKey = sodium.crypto_pwhash(64, password, salt, sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE, sodium.crypto_pwhash_ALG_ARGON2ID13)

    return {
        masterKey: sodium.to_base64(derivedKey.slice(0, 32)),
        serverPassword: sodium.to_base64(derivedKey.slice(32)),
        seed: sodium.to_base64(seed),
    }
}


async function encryptItem(item, masterKey) {
    await _sodium.ready
    const sodium = _sodium

    const itemKey = sodium.crypto_aead_chacha20poly1305_ietf_keygen()
    const nonce = sodium.randombytes_buf(sodium.crypto_aead_chacha20poly1305_IETF_NPUBBYTES)
    const encryptedItem = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
        JSON.stringify(item), nonce, null, nonce, itemKey)

    let keyNonce = sodium.randombytes_buf(sodium.crypto_aead_chacha20poly1305_IETF_NPUBBYTES)
    const encryptedItemKey = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
        itemKey, keyNonce, null, keyNonce, sodium.from_base64(masterKey))

    return {
        encryptedItemKey: await packCipherNonce(encryptedItemKey, keyNonce),
        encryptedItem: await packCipherNonce(encryptedItem, nonce),
    }
}

async function decryptItem(encryptedItem, masterKey) {
    await _sodium.ready
    const sodium = _sodium

    let {cipher, nonce} = await unpackCipherNonce(encryptedItem.encryptedItemKey)
    const itemKey = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
        null, cipher, nonce, nonce, sodium.from_base64(masterKey));

    ({cipher, nonce} = await unpackCipherNonce(encryptedItem.encryptedItem))
    const item = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
        null, cipher, nonce, nonce, itemKey)
    return JSON.parse(sodium.to_string(item))
}

async function decryptBookmark(encryptedBookmark, masterKey) {
    return {
        id: encryptedBookmark.id,
        ...await decryptItem(encryptedBookmark, masterKey)
    }
}

export const exportedForTesting = {
    packCipherNonce,
    unpackCipherNonce,
    decryptItem,
}

export const encryption = {
    computeRootKey,
    encryptItem,
    decryptBookmark,
}
