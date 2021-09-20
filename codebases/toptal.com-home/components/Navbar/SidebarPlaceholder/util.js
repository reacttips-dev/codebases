import {
    isSearchEnabled
} from '~/components/SearchWidget/lib/util'
import {
    mixSocialLinks
} from '~/components/Sidebar/lib/utils'

export const getSidebarProps = (sidebar, data) => {
    const {
        footerSection,
        ...sidebarData
    } = sidebar
    const {
        searchSection,
        ...sections
    } = data
    const props = {
        ...sidebarData,
        ...sections
    }

    if (searchSection && isSearchEnabled()) {
        Object.assign(props, {
            searchSection
        })
    }

    if (!footerSection) {
        return props
    }

    return mixSocialLinks(props, footerSection)
}