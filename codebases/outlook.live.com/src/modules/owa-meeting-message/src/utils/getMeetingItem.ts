import type MeetingCancellationMessageType from 'owa-service/lib/contract/MeetingCancellationMessageType';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import { getStore as getListViewStore } from 'owa-mail-list-store';

// Returns the meeting item if all the requirements are met
export default function getMeetingItem(
    itemId: string
): MeetingRequestMessageType | MeetingCancellationMessageType | null {
    const item = getListViewStore().meetingMessageItems.get(itemId);

    // The item is not on store yet (GetItem not completed)
    if (!item) {
        return null;
    }

    const meetingItem: MeetingRequestMessageType | MeetingCancellationMessageType = item;

    // Check these properties since these will indicate that we got the item with all properties that we need
    if (!meetingItem.Start || !meetingItem.End || !meetingItem.CalendarItemType) {
        return null;
    }

    return meetingItem;
}
