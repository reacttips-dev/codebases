import {
    premiumConsumerSafelinkTooltip,
    enterpriseUserSafelinkTooltip,
} from './safeLinkHandler.locstring.json';
import loc, { format } from 'owa-localize';
import type { ContentHandler } from 'owa-controls-content-handler-base';

import { isConsumer } from 'owa-session-store';

export const SAFELINK_HANDLER_NAME = 'safeLinkHandler';
const SAFELINK_SELECTOR = 'a';
const ORIGINALSRC_ATTTIBUTE_NAME = 'originalsrc';
const SHASH_ATTTIBUTE_NAME = 'shash';
const DATA_AUTH_ATTTIBUTE_NAME = 'data-auth';
const VERIFIED_SAFELINK = 'Verified';

// Handle show originalSrc as tooltip for SafeLink for Premium consumer user.
// SafeLink will add "originalSrc" and "shash" attribute to anchor tag for Premium consumer.
// OWA server side will validate the hash signature and stamp a "data-auth" attribute to the anchor tag.
// If data-auth="Verified", show originalScr as tooltip.
function processElement(element: HTMLElement) {
    if (
        element.hasAttribute(ORIGINALSRC_ATTTIBUTE_NAME) &&
        element.hasAttribute(SHASH_ATTTIBUTE_NAME) &&
        element.hasAttribute(DATA_AUTH_ATTTIBUTE_NAME)
    ) {
        element.title = '';
        if (element.getAttribute(DATA_AUTH_ATTTIBUTE_NAME) === VERIFIED_SAFELINK) {
            element.title = format(
                isConsumer()
                    ? loc(premiumConsumerSafelinkTooltip)
                    : loc(enterpriseUserSafelinkTooltip),
                element.getAttribute(ORIGINALSRC_ATTTIBUTE_NAME)
            );
        }
    }
}

let safeLinkHandler: ContentHandler = {
    cssSelector: SAFELINK_SELECTOR,
    keywords: null,
    handler: processElement,
};

export default safeLinkHandler;
