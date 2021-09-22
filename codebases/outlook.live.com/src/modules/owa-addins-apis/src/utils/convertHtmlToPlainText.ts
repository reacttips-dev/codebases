export default function convertHtmlToPlainText(html: string): string {
    try {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const styleElements = doc.querySelectorAll('style');
        if (styleElements && styleElements.length > 0) {
            for (let i = 0; i < styleElements.length; i++) {
                if (styleElements[i]) {
                    // Since we're setting innerHTML with a hard-coded empty string, there's no security threat here.
                    // tslint:disable-next-line:no-inner-html
                    styleElements[i].innerHTML = '';
                }
            }
        }
        return doc.body.textContent || '';
    } catch (e) {
        return '';
    }
}
