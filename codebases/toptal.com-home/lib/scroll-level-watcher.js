import {
    without
} from 'lodash'

import {
    scrollPercentWatcher
} from './scroll-percent-watcher'

/**
 * @typedef {Object} Watcher
 * @property {function(callback)} onLevelReached - Registers a callback to fire when new scroll level is reached
 * @property {function} clean - cleanes resources used by the object
 */

/**
 * Creates a watcher to watch the scroll and notify when it reaches specified percentage levels
 * @param {Array} levels - scroll levels in percents which should be notified about when reached
 * @return {Watcher} watcher
 */
export const scrollLevelWatcher = (levels = [10, 25, 50, 75, 90, 100]) => {
    const percentWatcher = scrollPercentWatcher()
    let levelsToReach = levels

    const handleScrollChange = handler => newPosition => {
        // We need tolerance because some browsers (like Chrome on Android) go only to 99% scroll
        const tolerance = 1
        const reachedLevels = levelsToReach.filter(
            level => newPosition >= level - tolerance
        )

        if (reachedLevels.length) {
            reachedLevels.forEach(level => handler(level))
            levelsToReach = without(levelsToReach, ...reachedLevels)
        }
    }

    const onLevelReached = handler => {
        percentWatcher.onChange(handleScrollChange(handler))
    }

    const clean = () => {
        percentWatcher.clean()
    }

    return {
        onLevelReached,
        clean
    }
}