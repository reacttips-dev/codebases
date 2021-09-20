export function getTransitionStyles(styles) {
    const {
        collapsed,
        expanded,
        collapsing,
        expanding
    } = styles

    return {
        appear: collapsed,
        enter: collapsed,
        enterActive: expanding,
        appearActive: expanding,
        enterDone: expanded,
        exitActive: collapsing,
        exitDone: collapsed
    }
}

export const mixSocialLinks = (sidebar, footerSection) => {
    const {
        socialShareSection
    } = sidebar
    const {
        socialMedia
    } = footerSection

    if (!socialShareSection ||
        socialShareSection.links ? .length ||
        !socialMedia ? .links ? .length
    ) {
        return sidebar
    }

    const {
        links
    } = socialMedia

    return {
        ...sidebar,
        socialShareSection: {
            ...socialShareSection,
            links
        }
    }
}