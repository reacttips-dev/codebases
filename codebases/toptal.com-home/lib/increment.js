/**
 * Calculates next/prev index within provided boundaries
 *
 * @param currentIndex
 * @param increment {number}
 * @param maxIndex {number}
 * @param infinite {boolean}
 * @param minIndex {number}
 * @returns {number}
 */
const increment = (
    currentIndex,
    increment,
    maxIndex,
    infinite,
    minIndex = 0
) => {
    const newIndexCandidate = currentIndex + increment

    if (!infinite) {
        if (increment > 0) {
            return Math.min(newIndexCandidate, maxIndex)
        }

        return Math.max(newIndexCandidate, minIndex)
    }

    if (increment > 0) {
        return Math.min(
            newIndexCandidate,
            currentIndex === maxIndex ? minIndex : maxIndex
        )
    }

    return Math.max(newIndexCandidate, !currentIndex ? maxIndex : minIndex)
}

export default increment