import {
    useState,
    useEffect
} from 'react'

import {
    fetchAuthState
} from '~/lib/auth-manager'

import {
    isFinished,
    isSuccess
} from '../fetch-status'

export const AuthState = {
    Loading: 'loading',
    LoggedIn: 'loggedin',
    LoggedOut: 'loggedout'
}

/**
 * Fetches login state from platform endpoint.
 * Does so only once per client-side session, via the FetchJSONWithCache.
 *
 * @param {string} url - Platform auth endpoint URL
 * @return {[boolean, string]}
 */
export function useAuthState(url) {
    const [authState, setAuthState] = useState(AuthState.Loading)

    useEffect(() => {
        let mounted = true

        fetchAuthState(url).subscribe((result, fetchStatus) => {
            if (!mounted) {
                return
            }

            if (isSuccess(fetchStatus) && !!result ? .success) {
                setAuthState(AuthState.LoggedIn)
            } else if (isFinished(fetchStatus)) {
                setAuthState(AuthState.LoggedOut)
            }
        })

        return () => (mounted = false)
    }, [url])

    return [authState]
}