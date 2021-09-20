import {
    useState,
    useEffect,
    useCallback
} from 'react'

import {
    useHorizontalScrollTo,
    ScrollPosition
} from '~/lib/hooks/use-horizontal-scroll-to'
import {
    useToggle,
    useValueByMedia
} from '~/lib/hooks'
import scrollTo from '~/lib/scroll-to'
import increment from '~/lib/increment'
import isVisualRegressionTest from '~/lib/is-visual-regression-test'

import {
    trackCardClick
} from './google-analytics'
import {
    SCROLL_STEP,
    ADVANCE_INTERVAL
} from './constants'

const useTalentSlider = ({
    talents,
    selected,
    onChange
}) => {
    const [loadedImages, setLoadedImages] = useState({})
    const [focusedIndex, setFocusedIndex] = useState()
    const [isUserControlled, toggleIsUserControlled] = useToggle(false)
    const isViewportSupported = useValueByMedia({
        default: false,
        forDesktop: true
    })

    const {
        scrollPosition,
        containerRef,
        itemsRefs,
        scrollToXCenter,
        scrollToLeft,
        scrollToRight
    } = useHorizontalScrollTo(talents.length)

    const [isAtScrollStart, isAtScrollFull] = [
        [ScrollPosition.NoScroll, ScrollPosition.Start].includes(scrollPosition), [ScrollPosition.NoScroll, ScrollPosition.Full].includes(scrollPosition)
    ]

    const handleLeftClick = useCallback(() => {
        !isAtScrollStart && scrollToLeft(SCROLL_STEP)
    }, [isAtScrollStart, scrollToLeft])

    const handleRightClick = useCallback(() => {
        !isAtScrollFull && scrollToRight(SCROLL_STEP)
    }, [isAtScrollFull, scrollToRight])

    const changeFocusedIndex = useCallback(
        index => {
            const focusedCard = itemsRefs.current[index]

            if (focusedCard) {
                setFocusedIndex(index)
                scrollToXCenter(focusedCard)
            }
        }, [setFocusedIndex, scrollToXCenter, itemsRefs]
    )

    const handleSectionKeyDown = useCallback(
        e => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                changeFocusedIndex(focusedIndex - 1)
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault()
                changeFocusedIndex(focusedIndex + 1)
            }
        }, [focusedIndex, changeFocusedIndex]
    )

    const switchToCard = useCallback(
        index => {
            scrollToXCenter(itemsRefs.current[index])
            onChange(index)
        }, [itemsRefs, scrollToXCenter, onChange]
    )

    const handleCardClick = useCallback(
        (_, index) => {
            switchToCard(index)
            scrollTo(window, {
                top: 0,
                left: 0
            })
            trackCardClick(index + 1)
        }, [switchToCard]
    )

    const handlePhotoLoad = useCallback(
        index =>
        setLoadedImages({
            ...loadedImages,
            [index]: true
        }), [loadedImages, setLoadedImages]
    )

    useEffect(() => {
        const isAllowed =
            isViewportSupported && !isUserControlled && !isVisualRegressionTest

        if (isAllowed) {
            const nextIndex = increment(selected, 1, talents.length - 1, true)
            const intervalId = setInterval(
                () => switchToCard(nextIndex),
                ADVANCE_INTERVAL
            )
            return () => clearInterval(intervalId)
        }
    }, [selected, talents, isViewportSupported, isUserControlled, switchToCard])

    return {
        itemsRefs,
        containerRef,
        loadedImages,
        focusedIndex,
        isAtScrollStart,
        isAtScrollFull,
        setFocusedIndex,
        handlePhotoLoad,
        handleCardClick,
        handleLeftClick,
        handleRightClick,
        handleSectionKeyDown,
        toggleIsUserControlled
    }
}

export default useTalentSlider