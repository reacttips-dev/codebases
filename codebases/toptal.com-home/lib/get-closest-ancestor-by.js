/**
 * Traverses DOM tree trying to find an ancestor matching a specified selector
 *
 * @param {Element} node
 * @param {String} selector
 * @param {number} [legacyTraverseDepth]
 * @returns {HTMLElement|undefined}
 */
const getClosestAncestorBy = (node, selector, legacyTraverseDepth = 5) => {
    if (node.closest) {
        return node.closest(selector)
    }

    // A fallback for IE11 not supporting `closest`
    if (node.msMatchesSelector) {
        for (let i = 0, element = node; i < legacyTraverseDepth; i++) {
            if (!element) {
                break
            }

            if (element.msMatchesSelector(selector)) {
                return element
            }

            element = element.parentElement
        }
    }

    return null
}

export default getClosestAncestorBy