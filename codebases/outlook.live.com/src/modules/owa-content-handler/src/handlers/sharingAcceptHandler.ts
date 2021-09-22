import type { ContentHandler } from 'owa-controls-content-handler-base';
import type Item from 'owa-service/lib/contract/Item';
import {
    lazyAddInteractiveElementsForReadingPane,
    lazyRemoveInteractiveElementsForReadingPane,
    SHARING_HOOK_ID,
    SHARING_MESSAGE_TYPE,
} from 'owa-sharing-accept';

export const SHARING_ACCEPT_HANDLER_NAME = 'sharingAcceptHandler';
const SHARING_ACCEPT_HANDLER_SELECTOR = 'div[id*=' + SHARING_HOOK_ID + ']';

function getProcessElement(item: Item): (element: HTMLElement) => void {
    return (element: HTMLElement) => {
        if (item != null && item.__type == SHARING_MESSAGE_TYPE) {
            lazyAddInteractiveElementsForReadingPane.importAndExecute(element, item);
        }
    };
}

function undoHandler(item: Item): (elements: HTMLElement[]) => void {
    return (elements: HTMLElement[]) => {
        if (item != null && item.__type == SHARING_MESSAGE_TYPE) {
            elements.forEach(element => {
                lazyRemoveInteractiveElementsForReadingPane.importAndExecute(element);
            });
        }
        elements = [];
    };
}

export default function createSharingAcceptHandler(item: Item): ContentHandler {
    return {
        cssSelector: SHARING_ACCEPT_HANDLER_SELECTOR,
        keywords: null,
        handler: getProcessElement(item),
        undoHandler: undoHandler(item),
    };
}
