import React from 'react'

import {
    scrollLevelWatcher
} from '~/lib/scroll-level-watcher'

/**
 * Takes array of levels (in percents, default is [10, 25, 50, 75, 90, 100]) and watches the scroll on the page.
 * When the page unloads, reports the max level in levels which was reached
 * @param {function(int)} onFinalLevelReached - callback fires with reached level passed in when the page unloads
 * @param {Array} levels - scroll levels to watch for
 */
export const useScrollLevelReached = (onFinalLevelReached, levels) => {
    const ref = React.useRef({
        onFinalLevelReached,
        levels,
        currentLevel: 0
    })

    const handleFinalLevelReached = () => {
        // Don’t need to track scroll depth 0.
        if (ref.current.currentLevel > 0) {
            ref.current.onFinalLevelReached(ref.current.currentLevel)
        }
    }

    React.useEffect(() => {
        const scrollWatcher = scrollLevelWatcher(ref.current.levels)

        window.addEventListener('beforeunload', handleFinalLevelReached, false)

        scrollWatcher.onLevelReached(level => {
            ref.current.currentLevel = level
        })

        return () => {
            scrollWatcher.clean()
            window.removeEventListener('beforeunload', handleFinalLevelReached)
        }
    }, [])
}