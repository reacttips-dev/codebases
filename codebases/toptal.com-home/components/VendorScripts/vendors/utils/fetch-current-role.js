import 'whatwg-fetch'

/**
 * This file was duplicated from Blackfish codebase and slightly modified/refactored.
 * A refactor is required once we have everything working and released.
 */

import {
    fetchAuthState
} from '~/lib/auth-manager'
import {
    isFinished
} from '~/lib/fetch-status'
/*
 * Try to get current user.
 * Always resolve this promise so consumers might figure out based on a resolved value.
 */

const fetchCurrentUser = function(apiSessionsUrl) {
    if (!apiSessionsUrl) {
        return Promise.resolve(null)
    }

    return new Promise(resolve => {
        fetchAuthState(apiSessionsUrl).subscribe((result, fetchStatus) => {
            if (isFinished(fetchStatus)) {
                resolve(result ? .user || null)
            }
        })
    })
}

const fetchCurrentRole = (apiSessionsUrl, callbackFn) => {
    // NOTE: Don't return the value returned from the callback:
    // 1. It is not needed, as function is not supposed to work this way.
    // 2. If `callbackFn` returns a rejected promise (by accident) - it goes to a next `catch` block and might result
    // in some unexpected behavior.
    // 3. The `catch` block will properly catch errors happened inside a callback.
    fetchCurrentUser(apiSessionsUrl).then(callbackFn)
}

export default fetchCurrentRole