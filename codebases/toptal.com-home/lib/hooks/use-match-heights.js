import {
    useRef,
    useEffect,
    createRef,
    useState
} from 'react'

import {
    useValueByMedia
} from './use-value-by-media'

export function useMatchHeights(
    items,
    refsToMatch, {
        preventSurpass = false,
        defaultDisplay = 'block'
    } = {}
) {
    const itemsRefs = useRef([...Array(items.length)].map(() => createRef()))
    const isDesktop = useValueByMedia({
        default: false,
        forDesktop: true
    })
    const [hiddenCount, setHiddenCount] = useState(0)

    useEffect(() => {
        const getByIndex = i => itemsRefs.current[i]
        const getHeightByRef = ref =>
            ref.current ? ref.current.getBoundingClientRect().height : 0
        const getHeightByIndex = i => getHeightByRef(getByIndex(i))

        itemsRefs.current.map(
            itemRef => (itemRef.current.style.display = defaultDisplay)
        )
        setHiddenCount(0)

        if (isDesktop) {
            const [baseRef, adjustableRef] = refsToMatch
            let lastIndexToDisplay = items.length - 1

            while (
                lastIndexToDisplay >= 0 &&
                getHeightByRef(adjustableRef) - getHeightByRef(baseRef) >
                (preventSurpass ? getHeightByIndex(lastIndexToDisplay) : 0)
            ) {
                getByIndex(lastIndexToDisplay).current.style.display = 'none'
                setHiddenCount(prev => prev + 1)
                lastIndexToDisplay--
            }
        }
    }, [defaultDisplay, isDesktop, items.length, preventSurpass, refsToMatch])

    return [itemsRefs, hiddenCount]
}