import { conversation, conversations, item, items } from './mailListDragUtil.locstring.json';
import loc, { format } from 'owa-localize';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type { MailListItemPartDragData } from 'owa-mail-types/lib/types/MailListItemPartDragData';
import { isBrowserEdge, isBrowserSafari } from 'owa-user-agent/lib/userAgent';

import dragHelperStyles from '../components/MailListDragHelper.scss';

/**
 * Creates and returns a div element containing
 * tooltip text corresponding to the type of
 * item being dragged.
 */
export function getMailListDragPreview(
    dragData: MailListRowDragData | MailListItemPartDragData
): HTMLElement {
    const numDraggableItems =
        (dragData as MailListRowDragData).rowKeys?.length ??
        (dragData as MailListItemPartDragData).itemIds?.length;

    const elem = document.createElement('div');

    // We occasionally render non-mail items as part of the
    // "draggable" MailListContent -- specifically, headers and
    // the pre- and post-row content (such as Search Answers or ads).
    // These items are identifiable by their missing rowKeys/itemIds.
    // We don't want to show tooltips on these items.
    if (numDraggableItems > 0) {
        let stringToShow;
        if (
            (dragData as MailListRowDragData).tableListViewType === ReactListViewType.Conversation
        ) {
            stringToShow = numDraggableItems === 1 ? loc(conversation) : loc(conversations);
        } else {
            // For users without Conversation View enabled
            // or users dragging individual messages from expanded conversations
            stringToShow = numDraggableItems === 1 ? loc(item) : loc(items);
        }

        const innerText = format('{0} {1}', numDraggableItems, stringToShow);

        if (isBrowserEdge()) {
            elem.className = dragHelperStyles.dragHelperStyleEdge;
        } else if (isBrowserSafari()) {
            // Safari has special padding to avoid "Bug#79874 DragUI contains "Outlook" from the suite header
            elem.className = dragHelperStyles.dragHelperStyleSafari;
        } else {
            elem.className = dragHelperStyles.dragHelperStyleOtherBrowsers;
        }

        elem.innerText = innerText;
    }

    return elem;
}

export const MAIL_ITEM_DRAG_XOFFSET = -12;
export const MAIL_ITEM_DRAG_YOFFSET = 5;
