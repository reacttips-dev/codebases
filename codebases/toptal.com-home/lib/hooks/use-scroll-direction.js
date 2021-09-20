import {
    useState,
    useEffect
} from 'react'

export const useScrollDirection = () => {
    const [direction, setDirection] = useState(null)

    useEffect(() => {
        let isScrolling = false
        let start = window.pageYOffset

        const calculate = () => {
            const end = window.pageYOffset

            setDirection(start > end ? 'up' : 'down')
            start = end > 0 ? end : 0
            isScrolling = false
        }

        const handleScroll = () => {
            if (!isScrolling) {
                window.requestAnimationFrame(calculate)
                isScrolling = true
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return [direction]
}