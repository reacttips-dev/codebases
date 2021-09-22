import type { ClientItemId } from 'owa-client-ids';
import type { ContentHandler } from 'owa-controls-content-handler-base';
import {
    lazyTryManageOneDriveLinksState,
    lazyTryProcessOneDriveLink,
    lazyTryUndoProcessOneDriveLink,
} from 'owa-doc-link-click-handler';
import { isFeatureEnabled } from 'owa-feature-flags';

export const ONEDRIVE_LINK_HANDLER_NAME = 'oneDriveLinkHandler';
export const ONEDRIVE_LINK_HANDLER_SELECTOR = 'a';

function processElement(
    itemId: ClientItemId
): (
    element: HTMLElement,
    keyword: string,
    instance: number,
    allElements: NodeListOf<Element>
) => void {
    return async (
        element: HTMLElement,
        keyword: string,
        instance: number,
        allElements: NodeListOf<Element>
    ) => {
        const tryProcessOneDriveLink = await lazyTryProcessOneDriveLink.import();
        tryProcessOneDriveLink(element, itemId, allElements);
    };
}

function undoProcessElements(elements: HTMLElement[]) {
    const tryUndoProcessOneDriveLink = lazyTryUndoProcessOneDriveLink.tryImportForRender();
    if (tryUndoProcessOneDriveLink) {
        tryUndoProcessOneDriveLink(elements);
    }
}

function doneMatchingElements(
    itemId: ClientItemId
): (elements: HTMLElement[], htmlContentRef: HTMLElement) => void {
    return async (elements: HTMLElement[], htmlContentRef: HTMLElement) => {
        if (isFeatureEnabled('doc-SxS-BeautifulLinks-ODC') && elements.length === 0) {
            const tryManageOneDriveLinksState = await lazyTryManageOneDriveLinksState.import();
            tryManageOneDriveLinksState(itemId);
        }
    };
}

export default function getOneDriveLinkHandler(itemId: ClientItemId): ContentHandler {
    return {
        needsAllElements: true,
        cssSelector: ONEDRIVE_LINK_HANDLER_SELECTOR,
        keywords: null,
        handler: processElement(itemId),
        undoHandler: undoProcessElements,
        doneHandlingMatchedElements: doneMatchingElements(itemId),
    };
}
