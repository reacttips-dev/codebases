import type { ContentHandler } from 'owa-controls-content-handler-base';

export const ANCHOR_HREF_HANDLER_NAME = 'anchorHrefHandler';
const ANCHOR_HREF_HANDLER_SELECTOR = 'a[href]';
const ANCHOR_HREF_ATTRIBUTE = 'href';
const ANCHOR_BLOCKED_HREF_ATTRIBUTE = 'blockedHref';

// RegExp for image proxy raw or encoded path - case insensitive.
// . raw path: /actions/ei?u=
// . encoded (safelink scenario): %2Factions%2Fei%3Fu%3D
const IMAGE_PROXY_PATH_REGEXP = /\/actions\/ei\?u=|%2Factions%2Fei%3Fu%3D/i;

async function processElement(element: HTMLElement) {
    // When we come across an href that contains the image proxy path, block it since
    // it could be an XSS attack per bug https://outlookweb.visualstudio.com/Outlook%20Web/_queries/edit/42035/?triage=true
    if (!element.hasAttribute(ANCHOR_HREF_ATTRIBUTE)) {
        return;
    }

    const href = element.getAttribute(ANCHOR_HREF_ATTRIBUTE);

    if (href.search(IMAGE_PROXY_PATH_REGEXP) < 0) {
        return;
    }

    // Remove the href to block the link
    element.removeAttribute(ANCHOR_HREF_ATTRIBUTE);
    element.setAttribute(ANCHOR_BLOCKED_HREF_ATTRIBUTE, href);
}

function undoHandler(elements: HTMLElement[]) {}

const anchorHrefHandler: ContentHandler = {
    cssSelector: ANCHOR_HREF_HANDLER_SELECTOR,
    keywords: null,
    handler: processElement,
    undoHandler: undoHandler,
};

export default anchorHrefHandler;
