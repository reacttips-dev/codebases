/**
 * This is a helper function to get an attribute value from an element, and return an empty string
 * when the attribute is not present
 * @param element The element
 * @param attributeName The attribute name
 */
export default function safeGetAttribute(element: HTMLElement, attributeName: string) {
    return element.hasAttribute(attributeName) ? element.getAttribute(attributeName) : '';
}
