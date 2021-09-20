/**
 * Creates a cancellable promise, handy to use with React Hooks.
 * @example
 * ```
 * const wait500ms = makeCancelablePromise(delay(500)).then(() => {
 *   console.log('500ms passed!');
 * })
 * // for whatever reason, we decide to cancel wait500ms promise after 100ms,
 * // so "500ms passed" never logs
 * delay(100).then(() => wait500ms.cancel())
 * ```
 */
export default promise => {
    let isCancelled = false

    const wrappedPromise = new Promise((resolve, reject) =>
        promise.then(val => {
            // eslint-disable-next-line prefer-promise-reject-errors
            isCancelled ? reject('Cancelled') : resolve(val)
        })
    )
    wrappedPromise.cancel = () => (isCancelled = true)

    return wrappedPromise
}