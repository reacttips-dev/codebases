import type { ContentHandler } from 'owa-controls-content-handler-base';
import { lazyStoreLinkHandler } from 'owa-addins-marketplace';

export const STORE_LINK_HANDLER_NAME = 'storeLinkHandler';
const STORE_LINK_HANDLER_SELECTOR = "a[href*='store.office.'], a[href*='appsource.microsoft.']";
const CLICK_EVENT_NAME = 'click';
export const EVENT_KEY = 'storeLink.evts';

function processElement(element: HTMLElement) {
    const clickHandler = (evt: MouseEvent) => {
        let preventEvent = true;
        lazyStoreLinkHandler.import().then(storeLinkHandler => {
            preventEvent = storeLinkHandler(<HTMLAnchorElement>element);
        });
        if (preventEvent) {
            evt.preventDefault();
        }
    };

    // Remember the listener added on the element so that it can be removed later
    element.addEventListener(CLICK_EVENT_NAME, clickHandler);
    element[EVENT_KEY] = clickHandler;
}

function undoHandler(elements: HTMLElement[]) {
    if (elements && elements.length > 0) {
        elements.forEach((element: HTMLElement) => {
            const clickHandler: any = element[EVENT_KEY];
            if (clickHandler) {
                element.removeEventListener(CLICK_EVENT_NAME, clickHandler);
                element[EVENT_KEY] = null;
            }
        });
    }
}

const storeLinkHandler: ContentHandler = {
    cssSelector: STORE_LINK_HANDLER_SELECTOR,
    keywords: null,
    handler: processElement,
    undoHandler: undoHandler,
};

export default storeLinkHandler;
