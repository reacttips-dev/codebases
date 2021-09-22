import type MouseUpHandler from 'owa-controls-mouseup-handler/lib/store/schema/MouseUpHandler';
import type { ClientItem } from 'owa-mail-store';
import { trace } from 'owa-trace';
import { lazyDestroyPopupDiv, lazyShowUserMarkupPopup } from 'owa-user-highlighting';
import getCoordsOfMarkupSelection from 'owa-user-highlighting/lib/utils/getCoordsOfMarkupSelection';

const LEFT_MOUSE_CLICK_CHARCODE = 0;
const SHOW_USER_MARKUP_POPUP_DELAY = 300;

const handleCreatingNewUserMarkups = (item: ClientItem) => (
    ev: MouseEvent,
    element: HTMLElement
) => {
    if (ev.button == LEFT_MOUSE_CLICK_CHARCODE) {
        setTimeout(
            () => getSelectionAndShowUserMarkupPopup(ev, element, item),
            SHOW_USER_MARKUP_POPUP_DELAY
        );
    }
};

const handleOnContextMenu = () => {
    dismissUserMarkupPopup();
};

async function dismissUserMarkupPopup() {
    const destroyPopupDiv = await lazyDestroyPopupDiv.import();
    destroyPopupDiv();
}

async function getSelectionAndShowUserMarkupPopup(
    ev: MouseEvent,
    element: HTMLElement,
    item: ClientItem
) {
    // VSO 31414: Use try/catch to stop null exception related to rangeCount.
    try {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const selectedText = selection.toString().trim();
            if (selectedText.length > 0) {
                const showUserMarkupPopup = await lazyShowUserMarkupPopup.import();
                const selectionRange = selection.getRangeAt(0);
                const boundingRects = selectionRange.getClientRects();
                showUserMarkupPopup(
                    getCoordsOfMarkupSelection(boundingRects, selectedText),
                    selectedText,
                    element,
                    item,
                    false /* isForExistingUserHighlight */,
                    false /* isForExistingUserNote */,
                    selectionRange,
                    null /* selectionInstance */
                );
            }
        }
    } catch (e) {
        trace.info('Cannot show user markup popup, error: ' + e.message);
    }
}

export default function createUserMarkupCreationHandler(item: ClientItem): MouseUpHandler {
    return {
        onMouseUp: handleCreatingNewUserMarkups(item),
        onContextMenu: handleOnContextMenu,
    };
}
