import * as meetingRSVPMapOperations from './meetingRSVPMapOperations';
import { isGroupTableQuery } from 'owa-group-utils';
import { TableView, getStore as getListViewStore } from 'owa-mail-list-store';
import { isMeetingCancellation, isMeetingRequest } from 'owa-meeting-message';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import tombstoneOperations, { TombstoneReasonType } from 'owa-mail-list-tombstone';

const requiredMeetingCommonProperties = [
    propertyUri({ FieldURI: 'Start' }),
    propertyUri({ FieldURI: 'End' }),
    propertyUri({ FieldURI: 'CalendarItemType' }),
];

const requiredMeetingRequestDetailsProperties = [
    propertyUri({ FieldURI: 'ConflictingMeetings' }),
    propertyUri({ FieldURI: 'IsResponseRequested' }),
    propertyUri({ FieldURI: 'Organizer' }),
];

/**
 * Determines whether the item should show the RSVP. This is based on the partial item and does
 * only the basic checks. shouldMeetingItemShowRSVP.ts does the check for the complete item (with all the properties)
 */
export function shouldShowRSVP(
    rowKey: string,
    itemId: string,
    itemClass: string,
    tableView: TableView
) {
    // If this row is tombstoned, just dont show any RSVP Info
    if (
        tombstoneOperations
            .getTombstonedReasons(rowKey, tableView.serverFolderId)
            .indexOf(TombstoneReasonType.MeetingRemove) > -1
    ) {
        return false;
    }

    // FolderId might be null (i.e. search)
    // We will show a RSVP placeholder for these scenarios and call GetItem
    // Depending on the parent folder of the item, we will hide the button
    const folderName = tableView.tableQuery.folderId
        ? folderIdToName(tableView.tableQuery.folderId)
        : null;
    if (
        itemId &&
        !isGroupTableQuery(tableView.tableQuery) &&
        itemClass &&
        (folderName || (folderName !== 'deleteditems' && folderName !== 'sentitems')) &&
        (isMeetingRequest(itemClass) || isMeetingCancellation(itemClass))
    ) {
        return true;
    }

    return false;
}

export function prepareRSVPItemIfNeeded(
    rowKey: string,
    itemId: string,
    itemClass: string,
    tableView: TableView
) {
    if (
        shouldShowRSVP(rowKey, itemId, itemClass, tableView) &&
        shouldItemBeFetched(itemId, itemClass)
    ) {
        meetingRSVPMapOperations.add(tableView, rowKey, itemId);
    }
}

/**
 * Determines whether the item should be fetched based on what we have in the cache and
 * the itemclass of the item
 */
function shouldItemBeFetched(itemId: string, itemClass: string): boolean {
    const cachedItem = getListViewStore().meetingMessageItems.get(itemId);

    // 1 - If the cached item is not in cache we should fetch it
    if (!cachedItem) {
        return true;
    }

    let propertiesNeeded = requiredMeetingCommonProperties;
    if (isMeetingRequest(itemClass)) {
        propertiesNeeded = propertiesNeeded.concat(requiredMeetingRequestDetailsProperties);
    }

    // 3- If any of the property needed is undefined, return true
    return propertiesNeeded.some(property => typeof cachedItem[property.FieldURI] === 'undefined');
}
