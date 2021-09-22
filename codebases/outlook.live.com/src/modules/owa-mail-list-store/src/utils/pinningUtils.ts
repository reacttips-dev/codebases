import type TableViewConversationRelation from '../store/schema/TableViewConversationRelation';
import type { ClientItem } from 'owa-mail-store';
import { owaDate, userDate, getISOString, getTimestamp } from 'owa-datetime';

// September 1st 4500 (Month starts from 0)
const utcPinnedDate = owaDate('UTC', 4500, 8, 1);

// For sending out the service request, we must use the UTC time when marking the conversation as pinned.
// Drop the 'Z' at the end of the timestamp
// This time is used when sending request to the server to mark items as pinned and we have to send the
// time in EWS format
const utcPinnedEwsTimeStamp = getISOString(utcPinnedDate).slice(0, -1);

/**
 * Gets a boolean which indicates whether a table conversation relation is pinned
 * @param tableConversationRelation which contains the renew time stamp
 * @returns boolean which indicates whether the relation is pinned
 */
export function getIsTableConversationRelationPinned(
    tableConversationRelation: TableViewConversationRelation
): boolean {
    return getIsPinnedTimestamp(tableConversationRelation.lastDeliveryOrRenewTimeStamp);
}

/**
 * Gets a boolean which indicates whether a table conversation relation is pinned
 * @param item which contains the renew time stamp
 * @returns boolean which indicates whether the item is pinned
 */
export function getIsTableItemDataPinned(item: ClientItem): boolean {
    return getIsPinnedTimestamp(item.ReceivedOrRenewTime);
}

/**
 * Get if a time stamp is a pinned time stamp
 * @param renewTimestamp
 * @returns a flag indicating whether the given timestamp is a pinned timestamp
 */
export function getIsPinnedTimestamp(renewTimestamp: string): boolean {
    // When the row has been stamped with the locale pinned time stamp upon user pinning it,
    // we have seen some users who have differnet timezones reporting that its
    // trying to render the return time on the item which means the item/conv was detected as snoozed
    // as per our logic in getMailListItemDataProps.
    // Apart from comparing the renew time with the utc pinned time we need to also compare
    // the renewTimeStamp with the local pinned time stamp as well when deciding whether the item/conv is pinned or not.
    if (renewTimestamp === getLocalPinnedTimeStamp()) {
        return true;
    }

    const renewDate = new Date(renewTimestamp);
    return renewDate.getTime() == getTimestamp(utcPinnedDate);
}

// For updating client upon pinning,
// we need to convert the utc pinned time to local time to compare,
// as server always returns the local time.
function getLocalPinnedTimeStamp(): string {
    try {
        // If browser does not have the timezone set, toLocaleString will throw error
        // in which case we shall not do instant local update and have it update through notification
        new Date(getTimestamp(utcPinnedDate)).toLocaleString();

        return userDate(utcPinnedDate).toString();
    } catch (error) {
        return null;
    }
}

export { utcPinnedEwsTimeStamp, getLocalPinnedTimeStamp };
