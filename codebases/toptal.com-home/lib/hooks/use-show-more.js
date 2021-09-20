import {
    useRef,
    useState,
    useCallback,
    useEffect
} from 'react'

export function useShowMore(rowsNumber) {
    const containerRef = useRef(null)
    const [removedCount, setRemovedCount] = useState(0)
    const [loading, setLoading] = useState(true)

    const isShowMoreNeeded = useCallback(() => {
        const {
            firstChild,
            scrollHeight
        } = containerRef.current
        const {
            marginTop,
            marginBottom
        } = getComputedStyle(firstChild)

        const tagHeight =
            firstChild.offsetHeight + parseInt(marginTop) + parseInt(marginBottom)

        return Math.ceil(scrollHeight / tagHeight) >= rowsNumber + 1
    }, [rowsNumber])

    useEffect(() => {
        /**
         * TODO: revert or refactor these changes after experiment
         * NOTE: tag removal logic borrowed from
         *      https://github.com/toptal/blackfish/blob/master/front/apps/public/shared/components/ui/tags/views/tags.js
         */
        const showMoreLink = containerRef.current.lastChild
        if (!showMoreLink) {
            return
        }

        showMoreLink.style.display = ''

        if (!isShowMoreNeeded()) {
            showMoreLink.style.display = 'none'
            setLoading(false)
            return
        }

        let count = 0

        // limit loop iteration count just in case so that browser doesn't get stuck
        while (isShowMoreNeeded() && count < 50) {
            const {
                childNodes
            } = containerRef.current

            if (childNodes.length > 2) {
                const lastTag = childNodes[childNodes.length - 2]

                containerRef.current.removeChild(lastTag)
            }

            count++
            setRemovedCount(count)
        }

        setLoading(false)
    }, [isShowMoreNeeded, rowsNumber])

    return {
        containerRef,
        loading,
        removedCount
    }
}