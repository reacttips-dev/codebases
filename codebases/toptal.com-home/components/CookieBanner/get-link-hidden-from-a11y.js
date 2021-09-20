const getLinkHiddenFromA11y = link => {
    /**
     * Some links that are not visible in the UI, also have to be hidden from the A11y tree.
     * e.g. The Cookie Policy link in the Cookie Banner message, which becomes not visible
     * after you accept the cookies
     * */
    if (typeof link !== 'string') {
        return null
    }
    const tagEnd = link.indexOf('>')
    if (tagEnd === -1) {
        return null
    }

    const a11ySettings = ` aria-hidden="true" tabindex="-1"`
    return [link.slice(0, tagEnd), a11ySettings, link.slice(tagEnd)].join('')
}

export default getLinkHiddenFromA11y