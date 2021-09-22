export default function createNodeWithContent(
    content: string,
    document: Document,
    domUtils: any
): HTMLElement {
    const contentElements = domUtils.fromHtml(content, document);
    const contentNode =
        !contentElements || contentElements.length == 0
            ? null
            : contentElements.length == 1
            ? contentElements[0]
            : domUtils.wrap(contentElements, 'SPAN');
    return contentNode;
}
