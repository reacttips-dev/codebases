import scrollTo from './scroll-to'

export const scrollToElement = (id, offset = 0, behaviour = 'smooth') => {
    const node = document.getElementById(id)

    if (node) {
        const top = window.scrollY + node.getBoundingClientRect().top + offset

        scrollTo(window, {
            top,
            behaviour
        })
    }
}

export default scrollToElement