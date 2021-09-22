import calculateImageProxyPath from 'owa-inline-image-loader/lib/utils/calculateImageProxyPath';
import { isImageProxyEnabled } from 'owa-inline-image-loader';
import type { ContentHandler } from 'owa-controls-content-handler-base';

export const EXTERNAL_IMAGE_HANDLER_NAME = 'externalImageHandler';
const EXTERNAL_IMAGE_HANDLER_SELECTOR =
    'td[background][data-imageproxyendpoint], tr[background][data-imageproxyendpoint], table[background][data-imageproxyendpoint]';

async function processElement(element: HTMLElement) {
    // When we come across a background image, calculate the image proxy path
    const imageProxyPath = await calculateImageProxyPath(element);
    if (!imageProxyPath) {
        return;
    }

    if (isImageProxyEnabled()) {
        //Replace the placeholder background with the image proxy path if External Images setting is enabled.
        element.setAttribute('background', imageProxyPath);
    } else {
        //Replace the placeholder background with empty string if External Images setting is disabled to block the image.
        element.setAttribute('background', '');
    }
}

function undoHandler(elements: HTMLElement[]) {}

const externalImageHandler: ContentHandler = {
    cssSelector: EXTERNAL_IMAGE_HANDLER_SELECTOR,
    keywords: null,
    handler: processElement,
    undoHandler: undoHandler,
};

export default externalImageHandler;
