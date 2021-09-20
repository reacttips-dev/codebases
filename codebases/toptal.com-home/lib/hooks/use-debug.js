import {
    useEffect,
    useState
} from 'react'

export function useDebug() {
    const [isDebug, setIsDebug] = useState(false)

    useEffect(() => {
        setIsDebug(window.location.href.includes('debug=true'))
    }, [])

    return [isDebug, setIsDebug]
}