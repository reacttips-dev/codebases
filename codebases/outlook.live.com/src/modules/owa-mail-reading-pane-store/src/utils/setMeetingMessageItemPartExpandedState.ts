import {
    isMeetingCancellation,
    isMeetingRequest,
    isMeetingMessage,
    isMeetingResponse,
} from 'owa-meeting-message';
import type MeetingMessage from 'owa-service/lib/contract/MeetingMessage';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import type Message from 'owa-service/lib/contract/Message';
import { isStringNullOrWhiteSpace } from 'owa-localize';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import mailStore from 'owa-mail-store/lib/store/Store';
import { getSelectedTableView } from 'owa-mail-list-store';

export default function setMeetingMessageItemPartExpandedState(
    loadedConversationItemParts: ItemPartViewState[]
) {
    const itemPartCount = loadedConversationItemParts.length;

    if (itemPartCount == 0) {
        return;
    }

    for (let itemIndex = 0; itemIndex < itemPartCount; itemIndex++) {
        const itemPartViewState = loadedConversationItemParts[itemIndex];

        const itemId = itemPartViewState ? itemPartViewState.itemId : null;
        const item = mailStore.items.get(itemId) as Message;
        const tableView = getSelectedTableView();

        if (!item || !isMeetingMessage(item) || tableView?.highlightTerms) {
            /* only update the isExpanded state for meeting messages when we are not in search mode */
            continue;
        }

        if (item.IsRead || (item as MeetingMessage).IsOutOfDate) {
            /* anything read or out of date should be collapsed */
            itemPartViewState.isExpanded = false;
            itemPartViewState.isFossilizedTextExpanded = false;
            continue;
        }

        if (isMeetingRequest(item.ItemClass)) {
            const request = item as MeetingRequestMessageType;
            /* unread meeting requests are only expanded if they are new or have updates body content */
            if (
                (request.MeetingRequestType == 'NewMeetingRequest' &&
                    !isStringNullOrWhiteSpace(request.Preview)) ||
                request.ChangeHighlights?.HasBodyChanged
            ) {
                itemPartViewState.isExpanded = true;
            } else {
                itemPartViewState.isExpanded = false;
                itemPartViewState.isFossilizedTextExpanded = false;
            }
        } else if (
            (isMeetingResponse(item.ItemClass) || isMeetingCancellation(item.ItemClass)) &&
            !isStringNullOrWhiteSpace(item.Preview)
        ) {
            /* unread responses or cancellations should only be expanded if there is a message */
            itemPartViewState.isExpanded = true;
        } else {
            itemPartViewState.isExpanded = false;
            itemPartViewState.isFossilizedTextExpanded = false;
        }
    }
}
