import type { ContentHandler } from 'owa-controls-content-handler-base';
import safeGetAttribute from 'owa-inline-image-loader/lib/utils/safeGetAttribute';
import { trace } from 'owa-trace';
import { logUsage } from 'owa-analytics';

export const EXTERNAL_IMAGE_COUNT_HANDLER_NAME = 'externalImageCountHandler';
const EXTERNAL_IMAGE_COUNT_HANDLER_SELECTOR = 'img[data-imagetype="External"]';

const ATTRIBUTE_IMAGEPROXYENDPOINT = 'data-imageproxyendpoint';

function doneProcessingImages(elements: HTMLElement[]) {
    if (!elements || elements.length == 0) {
        return;
    }

    try {
        const externalImageCount = elements.length;

        const httpImages = elements.filter(
            element => safeGetAttribute(element, ATTRIBUTE_IMAGEPROXYENDPOINT).length > 0
        );
        const httpExternalImageCount = httpImages && httpImages.length > 0 ? httpImages.length : 0;

        // Bug 45278: [React] Reduce volume of ExternalImagesCount
        // https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/45278
        // Reduce the loggign to every 20 (5% of all messages)
        logUsage('ExternalImageCounts', [externalImageCount, httpExternalImageCount], {
            logEvery: 20,
        });
    } catch (e) {
        trace.warn(
            'externalImageCountHandler.doneHandlingMatchedElements: Exception occured: ' + e.message
        );
    }
}

function undoHandler(elements: HTMLElement[]) {}

const externalImageCountHandler: ContentHandler = {
    cssSelector: EXTERNAL_IMAGE_COUNT_HANDLER_SELECTOR,
    keywords: null,
    doneHandlingMatchedElements: doneProcessingImages,
    undoHandler: undoHandler,
};

export default externalImageCountHandler;
