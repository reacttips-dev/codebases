import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import mailStore from 'owa-mail-store/lib/store/Store';
import truncateCountForDataPointAggregation from 'owa-mail-store/lib/utils/truncateCountForDataPointAggregation';
import { isMeetingMessage } from 'owa-meeting-message';
import type Item from 'owa-service/lib/contract/Item';
import type Message from 'owa-service/lib/contract/Message';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';

const MEETING_MESSAGE_CATEGORY = 'Meeting';
const MESSAGE_CATEGORY = 'Message';

export function getConversationReadingPaneStateCustomData(
    conversationId: string,
    cacheState: string
) {
    let unreadCount = 0;
    let draftCount = 0;
    let calendarCount = 0;
    let expandedCount = 0;
    let itemPartsCount = 0;
    const conversationReadingPaneViewState = getConversationReadingPaneViewState(conversationId);
    if (conversationReadingPaneViewState) {
        const itemPartsMap = conversationReadingPaneViewState.itemPartsMap;
        itemPartsMap.forEach(itemPart => {
            if (itemPart.isExpanded) {
                expandedCount++;
            }
            const message = mailStore.items.get(itemPart.itemId) as Message;
            if (message) {
                if (!message.IsRead) {
                    unreadCount++;
                }
                if (message.IsDraft) {
                    draftCount++;
                }
                if (isMeetingMessage(message)) {
                    calendarCount++;
                }
            }
        });
        itemPartsCount = itemPartsMap.size;
    }

    return {
        owa_1: getReadingPanePosition(),
        owa_2: isNewestOnBottom(),
        owa_3: truncateCountForDataPointAggregation(itemPartsCount),
        owa_4: truncateCountForDataPointAggregation(expandedCount),
        owa_5: truncateCountForDataPointAggregation(unreadCount),
        owa_6: truncateCountForDataPointAggregation(calendarCount),
        owa_7: truncateCountForDataPointAggregation(draftCount),
        owa_8: cacheState,
    };
}

export function getItemReadingPaneStateDatapoint(
    item: Item,
    isPreviewPane: boolean,
    isPrint: boolean
) {
    return {
        owa_1: getReadingPanePosition(),
        owa_2: getItemCategory(item),
        owa_3: isPreviewPane,
        owa_4: isPrint,
        owa_5: isSMIMEItem(item),
    };
}

function getItemCategory(item: Item): string {
    // Items of type appointment, contact, DL, or task are unsupported and will therefore load the
    // unsupportedReadingPane and NOT call logItemReadingPaneStateDatapoint.

    if (isMeetingMessage(item)) {
        return MEETING_MESSAGE_CATEGORY;
    }

    return MESSAGE_CATEGORY;
}

function getReadingPanePosition(): number {
    const userConfiguration = getUserConfiguration();
    return userConfiguration.UserOptions.GlobalReadingPanePositionReact;
}
