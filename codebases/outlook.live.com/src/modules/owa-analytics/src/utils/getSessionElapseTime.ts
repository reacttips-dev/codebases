let isWindowDefined = typeof window === 'object';

/**
 * Returns time elapsed since the beginning of the current session in seconds.
 */
export function getSessionElapseTime() {
    if (isWindowDefined && window.performance && window.performance.now) {
        return Math.floor(window.performance.now() / 1000);
    }

    return null;
}
