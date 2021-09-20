import FetchJSONWithCache from '~/lib/fetch-json-cache'

let request

export const resetAuthState = () => {
    request = null
}

export const fetchAuthState = url => {
    if (!request) {
        request = new FetchJSONWithCache()

        request.fetch(url, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    return request
}