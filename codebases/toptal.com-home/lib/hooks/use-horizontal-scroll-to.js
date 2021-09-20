import {
    useRef,
    createRef,
    useCallback,
    useState,
    useEffect
} from 'react'
import {
    debounce
} from 'lodash'

import scrollTo from '~/lib/scroll-to'

const scrollHorizontally = (element, left, top = 0) => {
    scrollTo(element, {
        top,
        left
    })
}

export const ScrollPosition = {
    Start: 0,
    Full: 1,
    NoScroll: null
}

/**
 * React hook for auto scrolling element inside parent element
 * @param {number} count length of inner child elements
 * @description "containerRef" should have CSS "position" property set in order to calculate scroll correctly
 */

export const useHorizontalScrollTo = count => {
    const [scrollPosition, setScrollPosition] = useState(ScrollPosition.NoScroll)
    const [maxScroll, setMaxScroll] = useState(0)

    const containerRef = useRef(null)
    const itemsRefs = useRef([...new Array(count)].map(() => createRef()))

    const updateScrollPosition = useCallback(
        scrollLeft => {
            if (maxScroll === 0) {
                return
            }
            let position = scrollLeft / maxScroll
            if (position <= 0) {
                position = ScrollPosition.Start
            } else if (position >= 1) {
                position = ScrollPosition.Full
            }
            setScrollPosition(position)
        }, [maxScroll, setScrollPosition]
    )

    useEffect(() => {
        const container = containerRef.current
        const {
            scrollWidth,
            clientWidth
        } = container
        setMaxScroll(scrollWidth - clientWidth)
        updateScrollPosition(0)

        const handleScroll = debounce(() => {
            updateScrollPosition(container.scrollLeft)
        }, 50)

        container.addEventListener('scroll', handleScroll)

        return () => container.removeEventListener('scroll', handleScroll)
    }, [setMaxScroll, updateScrollPosition])

    const scrollContainerTo = useCallback(scrollLeft => {
        scrollHorizontally(containerRef.current, scrollLeft)
    }, [])

    const scrollByOffset = useCallback(
        value => {
            const {
                scrollLeft
            } = containerRef.current
            return scrollContainerTo(scrollLeft + value)
        }, [scrollContainerTo]
    )

    const scrollToLeft = useCallback(
        value => {
            scrollByOffset(-value)
        }, [scrollByOffset]
    )

    const scrollToRight = useCallback(
        value => {
            scrollByOffset(value)
        }, [scrollByOffset]
    )

    const scrollToXCenter = useCallback(
        ref => {
            const {
                clientWidth,
                offsetLeft
            } = ref.current
            const diff = containerRef.current.offsetWidth - clientWidth
            const scrollLeft = offsetLeft - diff / 2
            scrollContainerTo(scrollLeft)
        }, [scrollContainerTo]
    )

    return {
        scrollPosition,
        containerRef,
        itemsRefs,
        scrollToXCenter,
        scrollToLeft,
        scrollToRight
    }
}