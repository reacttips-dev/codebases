/**
 * This file was duplicated from Blackfish codebase and slightly modified.
 * A refactor is required once we have everything working and released.
 */

import {
    isBrowser
} from '@toptal/frontier'

const wrap = {
    location: isBrowser() ? window.location : '',
    href() {
        return this.location.href
    },
    hash() {
        return this.location.hash
    },
    setHref(where) {
        this.location.href = where
        return this.location.href
    },
    setHash(hash) {
        this.location.hash = hash
        return this.location.hash
    },
    reload() {
        return this.location.reload()
    }
}

export default wrap