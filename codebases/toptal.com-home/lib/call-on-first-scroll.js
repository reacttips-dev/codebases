const callOnFirstScroll = callback => {
    function listener() {
        window.removeEventListener('scroll', listener, false)
        callback()
    }
    window.addEventListener('scroll', listener, false)
}

export default callOnFirstScroll