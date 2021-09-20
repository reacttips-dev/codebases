function measureScrollPercent() {
    const scrollTop =
        document.documentElement ? .scrollTop || document.body ? .scrollTop
    const scrollHeight =
        document.documentElement ? .scrollHeight || document.body ? .scrollHeight
    const clientHeight = document.documentElement ? .clientHeight

    if (scrollHeight <= clientHeight) {
        return 100
    }
    return Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
}

/**
 * @typedef {Object} Watcher
 * @property {function(callback)} onChange - Registers a callback to fire when scroll position changes
 * @property {function} clean - cleanes resources used by the object
 */

/**
 * Creates a watcher to whatch the scroll and notify when its position changes
 * @return {Watcher} watcher
 */
export const scrollPercentWatcher = () => {
    let changeHandler = () => {}
    let currentScrollPercent = 0

    const handleScroll = () => {
        const newScrollPercent = measureScrollPercent()
        changeHandler(newScrollPercent, currentScrollPercent)
        currentScrollPercent = newScrollPercent
    }

    document.addEventListener('scroll', handleScroll)

    const onChange = handler => {
        changeHandler = handler
    }

    const clean = () => {
        document.removeEventListener('scroll', handleScroll)
    }

    return {
        onChange,
        clean
    }
}