import getPublicPath from '~/lib/get-public-path'

const groupsWithDelayedScripts = [
    'Skill pages',
    'SEO Skill Pages',
    'City skill'
]
const excludedPages = ['/django', '/designers/sketch']
const DEFAULT_DELAY = 15000

const getScriptDelay = props => {
    if (!props || typeof props !== 'object') {
        return 0
    }

    const {
        publicUrl,
        group
    } = props
    if (!publicUrl || !group) {
        return 0
    }

    if (!groupsWithDelayedScripts.includes(group)) {
        return 0
    }

    const pathname = getPublicPath(publicUrl)

    if (excludedPages.includes(pathname)) {
        return 0
    }

    return DEFAULT_DELAY
}

export default getScriptDelay