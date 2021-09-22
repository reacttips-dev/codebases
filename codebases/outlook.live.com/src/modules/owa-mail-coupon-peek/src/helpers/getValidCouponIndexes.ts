import * as couponPeekMapOperations from './couponPeekMapOperations';
import isValidCoupon from './isValidCoupon';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getMailboxInfoFromTableQuery } from 'owa-mail-mailboxinfo';
import { getStore as getMailStore } from 'owa-mail-store';
import type { ConversationType, ItemRow } from 'owa-graph-schema';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type Message from 'owa-service/lib/contract/Message';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import {
    getStore as getListViewStore,
    isItemOfMessageType,
    TableQuery,
    TableQueryType,
    selectConversationById,
} from 'owa-mail-list-store';

/**
 * Gets the indexes of valid coupons for a given conversation based on client requirements
 * @param conversationType the given conversation
 * @param tableQuery of the table
 * @returns the indexes of valid coupons for a given conversation which are sorted based on the highest rank score
 */
export function getValidCouponIndexesForConversation(
    conversationType: Partial<ConversationType>,
    tableQuery: TableQuery
): number[] {
    const conversationId = conversationType.ConversationId.Id;
    const existingCouponPreview = getListViewStore().couponPeekPreviews.get(conversationId);
    if (existingCouponPreview) {
        // If validCouponIndexes has already been computed and stored in cache, no need to re-compute the value
        const conversation = selectConversationById(conversationId);
        if (conversation) {
            return conversation.validCouponIndexes;
        }
    }

    // only looks at the original sender of the conversation, it is guaranteed that the coupon property is on the first item.
    return getValidCouponIndexesInternal(
        (conversationType.ItemIds[0] as ItemId).Id,
        conversationType.CouponRanks,
        conversationType.CouponExpiryDates,
        tableQuery
    );
}

/**
 * Gets the indexes of valid coupons for a given item based on client requirements
 * @param item the given item
 * @param tableQuery of the table
 * @returns the indexes of valid coupons for a given item which are sorted based on the highest rank score
 */
export function getValidCouponIndexesForItem(item: ItemRow, tableQuery: TableQuery): number[] {
    if (!isItemOfMessageType(item)) {
        // Coupon property is only available on message
        return null;
    }

    const message = item as Message;
    const itemId = item.ItemId.Id;
    const existingCouponPreview = getListViewStore().couponPeekPreviews.get(itemId);
    if (existingCouponPreview) {
        // If coupon count state is already computed and stored in cache, no need to re-compute the value
        const existingItem = getMailStore().items.get(itemId);
        if (existingItem) {
            return existingItem.validCouponIndexes;
        }
    }

    return getValidCouponIndexesInternal(
        item.ItemId.Id,
        message.CouponRanks,
        message.CouponExpiryDates,
        tableQuery
    );
}

/**
 * Gets the valid coupon indexes for a given service data
 * @param itemIdToFetch the itemId to fetch
 * @param couponRanks the ranks of the coupons
 * @param couponExpiryDates the expiry dates of the coupons
 * @param tableQuery of the service data
 * @returns the valid coupon indexes of a given service data which are sorted based on the highest rank score
 */
function getValidCouponIndexesInternal(
    itemIdToFetch: string,
    couponRanks: number[],
    couponExpiryDates: string[],
    tableQuery: TableQuery
): number[] {
    // Coupon data is not passed down from search. If the row hasn't been loaded in any non-search table, we do not show it
    // because we haven't computed the coupon data
    if (tableQuery.type == TableQueryType.Search) {
        return null;
    }

    // Case junk email folder
    if (folderIdToName(tableQuery.folderId) == 'junkemail') {
        return null;
    }

    // If CouponRanks or coupon expiry dates is not on the service data type, it means the email contains no coupon information
    // Or if the rank array length is not the same as expiry dates array length, this means the server data is invalid
    if (!couponRanks || !couponExpiryDates || couponRanks.length != couponExpiryDates.length) {
        return null;
    }

    const validCouponIndexRankEntries = [];
    for (let i = 0; i < couponExpiryDates.length; i++) {
        const expiryDateTimeStamp = couponExpiryDates[i];
        if (isValidCoupon(expiryDateTimeStamp, Date.now())) {
            validCouponIndexRankEntries.push({ index: i, rank: couponRanks[i] });
        }
    }

    // Sort the array based on the second element
    validCouponIndexRankEntries.sort(function (first: any, second: any) {
        return second.rank - first.rank;
    });

    // Add the item id to the fetch list if the flight is enabled and we have entries.
    if (validCouponIndexRankEntries.length > 0 && isFeatureEnabled('tri-coupon-peek')) {
        couponPeekMapOperations.add(
            getMailboxInfoFromTableQuery(tableQuery).mailboxSmtpAddress,
            itemIdToFetch
        );
    }

    return validCouponIndexRankEntries.map(entry => entry.index);
}
