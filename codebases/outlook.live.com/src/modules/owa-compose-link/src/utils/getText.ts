export default function getText(htmlElement: HTMLElement): string {
    let innerText = '';
    // The i tag where it shows the file icon could contain text node and the text there is intepreted as strange characters so we ignore this container
    if (htmlElement == null || htmlElement.nodeName === 'I') {
        return '';
    }
    if (htmlElement.nodeName === '#text') {
        // ignore some tags with empty string
        return htmlElement.textContent.trim();
    }
    for (let i = 0; i < htmlElement.childNodes.length; i++) {
        innerText += getText(htmlElement.childNodes[i] as HTMLElement);
    }
    return innerText;
}
