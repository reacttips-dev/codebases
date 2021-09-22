import { getIsTableConversationRelationPinned, getIsTableItemDataPinned } from './pinningUtils';
import type TableViewConversationRelation from '../store/schema/TableViewConversationRelation';
import type { ClientItem } from 'owa-mail-store';

/**
 * Gets a boolean which indicates whether a table conversation relation is snoozed
 * @param tableConversationRelation which contains the renew time stamp
 * @returns boolean which indicates whether the relation is snoozed
 */
export function getIsTableConversationRelationSnoozed(
    tableConversationRelation: TableViewConversationRelation
): boolean {
    const isPinned = getIsTableConversationRelationPinned(tableConversationRelation);
    const isSnoozed = getIsConversationSnoozed(tableConversationRelation, isPinned);
    return isSnoozed;
}

/**
 * Gets a boolean which indicates whether a table conversation relation is snoozed
 * @param item which contains the renew time stamp
 * @returns boolean which indicates whether the item is snoozed
 */
export function getIsTableItemDataSnoozed(item: ClientItem): boolean {
    const isPinned = getIsTableItemDataPinned(item);
    const isSnoozed = getIsItemSnoozed(item, isPinned);
    return isSnoozed;
}

function getIsConversationSnoozed(
    tableConversationRelation: TableViewConversationRelation,
    isPinned: boolean
) {
    return getIsSnoozed({
        isPinned: isPinned,
        returnTime: tableConversationRelation.returnTime,
        receivedOrRenewedTime: tableConversationRelation.lastDeliveryOrRenewTimeStamp,
        receivedTime: tableConversationRelation.lastDeliveryTimeStamp,
    });
}

function getIsItemSnoozed(item: ClientItem, isPinned: boolean) {
    return getIsSnoozed({
        isPinned: isPinned,
        returnTime: item.ReturnTime,
        receivedOrRenewedTime: item.ReceivedOrRenewTime,
        receivedTime: item.DateTimeReceived,
    });
}

function getIsSnoozed(params: {
    isPinned: boolean;
    returnTime: string;
    receivedOrRenewedTime: string;
    receivedTime: string;
}) {
    const { returnTime, receivedOrRenewedTime, receivedTime, isPinned } = params;
    return (
        !!returnTime ||
        (!isPinned &&
            receivedOrRenewedTime &&
            !isTimestampEqual(receivedOrRenewedTime, receivedTime))
    );
}

// Helper function to normalize and compare date times for isSnoozed calculation. This function is
// required to normalize times returned by search results with millisecond. For the present we will
// simply ignore milliseconds and assume the two times are equal when in search.
function isTimestampEqual(time1: string, time2: string) {
    return new Date(time1).setMilliseconds(0) == new Date(time2).setMilliseconds(0);
}
