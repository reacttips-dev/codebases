import { trace } from 'owa-trace';

/* List to store the item ids to get the Coupon information */
const couponPeekItemIdMap: IdMap = {}; // Map<mailboxId, ItemId[]>

export interface IdMap {
    [mailboxId: string]: string[];
}

/**
 * Add an item id to the coupon peek item id map
 * @param mailboxId the mailbox id of the user
 * @param itemId the item id to be fetched
 */
export let add = function addToCouponPeekItemIdMap(mailboxId: string, itemId: string) {
    if (contains(mailboxId, itemId)) {
        trace.warn('couponPeekOperations: duplicate itemId should not be fetched again');
        return;
    }

    const itemIds = couponPeekItemIdMap[mailboxId];
    if (itemIds) {
        couponPeekItemIdMap[mailboxId].push(itemId);
    } else {
        couponPeekItemIdMap[mailboxId] = [itemId];
    }
};

/**
 * Whether an item is already added to the fetch list of the mailbox
 * @param mailboxId the mailbox id of the user
 * @param itemId the item id to be fetched
 * @returns true if an item is already added to the fetch list, false otherwise
 */
export let contains = function containsInCouponPeekItemIdMap(
    mailboxId: string,
    itemId: string
): boolean {
    const itemIdsToFetch = couponPeekItemIdMap[mailboxId];
    return itemIdsToFetch && itemIdsToFetch.indexOf(itemId) > 0;
};

/**
 * Remove the coupon fetch list of the specified user mailbox
 * @param mailboxId the mailbox id of the user
 */
export let removeFetchList = function removeFetchListForMailbox(mailboxId: string) {
    delete couponPeekItemIdMap[mailboxId];
};

/**
 * Get the coupon fetch list of the specified user mailbox
 * @param mailboxId the mailbox id of the user
 * @return an array of item ids that to be fetched for coupon information
 */
export let getFetchList = function getFetchListForMailbox(mailboxId: string): string[] {
    return couponPeekItemIdMap[mailboxId];
};
