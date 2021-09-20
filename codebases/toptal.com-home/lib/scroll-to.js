import isVisualRegressionTest from '~/lib/is-visual-regression-test'

export const scrollTo = async (element = window, options = {}) => {
    const hasScrollBehavior = 'scrollBehavior' in document.documentElement.style

    if (!hasScrollBehavior && !isVisualRegressionTest) {
        const smoothScroll = await
        import ('smoothscroll-polyfill')
        smoothScroll.polyfill()
    }

    element.scrollTo({
        behavior: !isVisualRegressionTest ? 'smooth' : 'auto',
        ...options
    })
}

export default scrollTo