const hasDOM = typeof window !== 'undefined'

const isVisualRegressionTest =
    hasDOM && [
        window.__IS_HAPPO_RUN,
        window.navigator.userAgent === 'loki',
        window.location.search.startsWith('?id=loki-')
    ].some(Boolean)

export default isVisualRegressionTest