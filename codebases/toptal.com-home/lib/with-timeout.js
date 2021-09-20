/**
 * Wraps any function with a timeout for automatic execution.
 * - If the function is called explicitly within the given time, it will call the wrapped function immediately and only once.
 * - If the function is not called explicitly within the given time, it will implicitly call the wrapped function afterward.
 * @param {function} callback
 * @param {number} timeout
 */
const withTimeout = (callback, timeout = 1000) => {
    let called = false
    const fn = () => {
        if (called) {
            return
        }
        called = true
        callback()
    }
    setTimeout(fn, timeout)
    return fn
}

export default withTimeout