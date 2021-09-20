/**
 * Fetches JSON from a provided endpoint
 *
 * @param {string} url - endpoint URL
 * @param {object} params - request query params
 * @param {object} config - custom fetch config
 * @returns {Promise<Object>}
 */

const fetchJSON = async (url, params = {}, config = {}) => {
    const searchParams = new URLSearchParams(params).toString()

    if (searchParams) {
        url += `?${searchParams}`
    }

    const response = await fetch(url, {
        ...config,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return response.json()
}

export default fetchJSON