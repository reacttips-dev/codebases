import {
    useState,
    useEffect
} from 'react'

import isIE11 from '~/lib/is-ie11'

export function useIsIE11() {
    const [state, setState] = useState(false)
    useEffect(() => {
        setState(isIE11())
    }, [])

    return state
}