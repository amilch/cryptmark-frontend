function getWholeURL(input) {
    try {
        const urlWithProtocol = input.match('[a-zA-Z]{1,20}:\/\/') ? input : 'https://' + input
        const inputUrl = new URL(urlWithProtocol)
        return inputUrl.href
    } catch (e) {
        if (e instanceof TypeError) {
            return null
        } else throw e
    }
}

function isURL(input) {
    return getWholeURL(input) !== null
}

export const urlUtils = {
    isURL,
    getWholeURL
}