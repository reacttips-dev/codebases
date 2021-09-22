import { ACKNOWLEDGED_SPOTLIGHT_ITEMS_KEY, DISMISSED_SPOTLIGHT_ITEMS_KEY } from '../cacheConstants';
import { getItem, setItem } from 'owa-local-storage';
import type SpotlightItem from '../store/schema/SpotlightItem';

export enum SpotlightCacheType {
    Acknowledged,
    Dismissed,
}

interface CachedSpotlightItem {
    itemId?: string;
    conversationId?: string;
    rowKey?: string;
}

export const addItemsToSpotlightItemsCache = (
    spotlightCacheType: SpotlightCacheType,
    spotlightItems: CachedSpotlightItem[]
) => {
    // Get existing cache of items.
    const cachedItems = getSpotlightItemsCache(spotlightCacheType);

    // Append target items to cache of items.
    for (const item of spotlightItems) {
        cachedItems.push(item);
    }

    // Update cache in storage.
    setItem(window, getSpotlightCacheKey(spotlightCacheType), JSON.stringify(cachedItems));
};

/**
 * Checks to see if Spotlight item is arleady tracked in localStorage cache.
 */
export const isItemInSpotlightItemsCache = (params: {
    spotlightCacheType: SpotlightCacheType;
    itemId?: string;
    conversationId?: string;
    rowKey?: string;
}): boolean => {
    const { spotlightCacheType, itemId, conversationId, rowKey } = params;

    // Get target cache of items.
    const itemsCache = getSpotlightItemsCache(spotlightCacheType);

    for (const item of itemsCache) {
        if (
            (itemId && item.itemId === itemId) ||
            (conversationId && item.conversationId === conversationId) ||
            (rowKey && item.rowKey === rowKey)
        ) {
            return true;
        }
    }

    return false;
};

/**
 * Cleans up caches of Spotlight items by removing any items in the caches that
 * are no longer considered Spotlight items.
 */
export const cleanSpotlightItemsCaches = (spotlightItems: SpotlightItem[]) => {
    cleanSpotlightItemsCachesInternal(SpotlightCacheType.Acknowledged, spotlightItems);
    cleanSpotlightItemsCachesInternal(SpotlightCacheType.Dismissed, spotlightItems);
};

const cleanSpotlightItemsCachesInternal = (
    spotlightCacheType: SpotlightCacheType,
    spotlightItems: SpotlightItem[]
) => {
    const cachedSpotlightItems = getSpotlightItemsCache(spotlightCacheType);
    const cleanedSpotlightItems = [];

    for (const cachedSpotlightItem of cachedSpotlightItems) {
        const {
            itemId: cachedItemId,
            conversationId: cachedConversationId,
            rowKey: cachedRowKey,
        } = cachedSpotlightItem;

        for (const spotlightItem of spotlightItems) {
            const { itemId, conversationId, rowKey } = spotlightItem;

            if (
                (cachedItemId && cachedItemId === itemId) ||
                (cachedConversationId && cachedConversationId === conversationId) ||
                (cachedRowKey && cachedRowKey === rowKey)
            ) {
                cleanedSpotlightItems.push(spotlightItem);
                break;
            }
        }
    }

    setItem(
        window,
        getSpotlightCacheKey(spotlightCacheType),
        JSON.stringify(cleanedSpotlightItems)
    );
};

export const getSpotlightItemsCache = (
    spotlightCacheType: SpotlightCacheType
): CachedSpotlightItem[] => {
    const spotlightItemsValue = getItem(window, getSpotlightCacheKey(spotlightCacheType));
    return spotlightItemsValue ? JSON.parse(spotlightItemsValue) : [];
};

const getSpotlightCacheKey = (spotlightCacheType: SpotlightCacheType): string => {
    if (spotlightCacheType === SpotlightCacheType.Acknowledged) {
        return ACKNOWLEDGED_SPOTLIGHT_ITEMS_KEY;
    }

    return DISMISSED_SPOTLIGHT_ITEMS_KEY;
};
