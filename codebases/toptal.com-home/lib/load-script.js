/**
 * Loads a 3rd party script only once
 *
 * @param {String} url
 * @returns {Promise}
 */

const queue = {}

const loadScript = url => {
    if (!queue[url]) {
        queue[url] = new Promise((resolve, reject) => {
            const script = document.createElement('script')

            script.type = 'text/javascript'
            script.src = url
            script.async = true

            script.onload = () => {
                resolve()
            }

            script.onerror = e => {
                reject(
                    new URIError('The script ' + e.target.src + " didn't load correctly.")
                )
            }

            document.body.appendChild(script)
        })
    } else {
        // eslint-disable-next-line no-console
        console.warn('Script is already in loading queue: ' + url)
    }

    return queue[url]
}

export default loadScript