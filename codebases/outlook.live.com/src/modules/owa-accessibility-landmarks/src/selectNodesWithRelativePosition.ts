// if you pass position === 'before', you'll filter nodes for elements that come
// BEFORE currentElement. The opposite is true if you pass 'after'.
export default function selectNodesWithRelativePosition(
    nodes: HTMLElement[],
    position: 'before' | 'after',
    currentElement: Element
) {
    return nodes.filter(
        e =>
            (currentElement || document.body).compareDocumentPosition(e) &
            (position === 'after'
                ? Node.DOCUMENT_POSITION_FOLLOWING
                : Node.DOCUMENT_POSITION_PRECEDING)
    );
}
