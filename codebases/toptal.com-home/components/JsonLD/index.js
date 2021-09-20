import {
    isBrowser
} from '@toptal/frontier'

import BreadcrumbList from './BreadcrumbList'

const JsonLD = ({
    children
}) => {
    // Only generated in case of SSR
    if (isBrowser()) {
        return null
    }

    return children
}

JsonLD.BreadcrumbList = BreadcrumbList

export default JsonLD