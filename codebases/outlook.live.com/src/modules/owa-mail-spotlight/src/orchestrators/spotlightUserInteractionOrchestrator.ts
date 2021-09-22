import onCacheUpdated from '../actions/onCacheUpdated';
import onSpotlightFilterLoaded from '../actions/onSpotlightFilterLoaded';
import getSpotlightItem from '../selectors/getSpotlightItem';
import type SpotlightItem from '../store/schema/SpotlightItem';
import getStore from '../store/store';
import getActionCategory, { ActionCategory } from '../utils/getActionCategory';
import { logSpotlightItemUserInteraction } from '../utils/instrumentationUtils';
import isSpotlightEnabled from '../utils/isSpotlightEnabled';
import { userMailInteractionAction } from 'owa-mail-actions';
import { orchestrator } from 'satcheljs';
import {
    isItemInSpotlightItemsCache,
    addItemsToSpotlightItemsCache,
    SpotlightCacheType,
} from '../utils/cacheUtils';

/**
 * This orchestrator subscribes to interactions with mail items and saves item
 * identifying info (itemId, conversationId, rowKey) to local storage so we can
 * later check if a particular Spotlight item has been interacted with or not as
 * well as handles instrumentation necessary for these interactions.
 */
orchestrator(userMailInteractionAction, actionMessage => {
    if (!isSpotlightEnabled()) {
        return;
    }

    const { triageContext = {}, interactionType } = actionMessage;
    let { itemIds = [], conversationIds = [], rowKeys = [] } = triageContext;

    // Remove any bad values
    itemIds = itemIds.filter(id => !!id);
    conversationIds = conversationIds.filter(id => !!id);
    rowKeys = rowKeys.filter(rowKey => !!rowKey);

    if (itemIds.length === 0 && conversationIds.length === 0 && rowKeys.length === 0) {
        return;
    }

    /**
     * Track which items we've already instrumented as some actions may pass
     * multiple identifying values (i.e. itemIds and conversationIds) and we only
     * want to send a single event per action taken.
     */
    const processedSpotlightItems: string[] = [];

    const spotlightCacheType =
        getActionCategory(interactionType) === ActionCategory.Strong
            ? SpotlightCacheType.Dismissed
            : SpotlightCacheType.Acknowledged;

    itemIds.map((itemId: string) => {
        const spotlightItem = getSpotlightItem({ itemId });

        if (
            spotlightItem &&
            !isItemInSpotlightItemsCache({
                spotlightCacheType,
                itemId,
                rowKey: spotlightItem.rowKey,
            })
        ) {
            // Add item to appropriate cache.
            addItemsToSpotlightItemsCache(spotlightCacheType, [
                { itemId, rowKey: spotlightItem.rowKey },
            ]);

            // Log user interaction on Spotlight item.
            processSpotlightItemInstrumentation(
                processedSpotlightItems,
                spotlightItem.referenceId,
                interactionType
            );
        }
    });

    conversationIds.map((conversationId: string) => {
        const spotlightItem = getSpotlightItem({ conversationId });

        if (
            spotlightItem &&
            !isItemInSpotlightItemsCache({
                spotlightCacheType,
                conversationId,
                rowKey: spotlightItem.rowKey,
            })
        ) {
            // Add item to appropriate cache.
            addItemsToSpotlightItemsCache(spotlightCacheType, [
                { conversationId, rowKey: spotlightItem.rowKey },
            ]);

            // Log user interaction on Spotlight item.
            processSpotlightItemInstrumentation(
                processedSpotlightItems,
                spotlightItem.referenceId,
                interactionType
            );
        }
    });

    rowKeys.map((rowKey: string) => {
        const spotlightItem = getSpotlightItem({ rowKey });

        if (
            spotlightItem &&
            !isItemInSpotlightItemsCache({
                spotlightCacheType,
                rowKey,
            })
        ) {
            // Add item to appropriate cache.
            addItemsToSpotlightItemsCache(spotlightCacheType, [{ rowKey }]);

            // Log user interaction on Spotlight item.
            processSpotlightItemInstrumentation(
                processedSpotlightItems,
                spotlightItem.referenceId,
                interactionType
            );
        }
    });

    /**
     * Once caches are updated, dispatch an action so that store updates can
     * be made. These actions are sequenced because there are certain actions
     * that will remove items from the Spotlight store, but those items are
     * required to be in the store when the cache updates are made.
     */
    onCacheUpdated(interactionType, triageContext);
});

/**
 * This orchestrator marks all Spotlight items as acknowledged when Spotlight
 * rollup is loaded.
 */
orchestrator(onSpotlightFilterLoaded, () => {
    addAllSpotlightItemsToAcknowledgedItemsCache();
});

const addAllSpotlightItemsToAcknowledgedItemsCache = () => {
    const spotlightItems = getStore().spotlightItems;

    // Convert SpotlightItems to CachedSpotlightItems before writing to cache.
    const spotlightCacheItems = spotlightItems.map((spotlightItem: SpotlightItem) => {
        const { itemId, conversationId, rowKey } = spotlightItem;

        return {
            itemId,
            conversationId,
            rowKey,
        };
    });

    addItemsToSpotlightItemsCache(SpotlightCacheType.Acknowledged, spotlightCacheItems);
};

const processSpotlightItemInstrumentation = (
    processedSpotlightItems: string[],
    referenceId: string,
    interactionType: string
): void => {
    if (referenceId && processedSpotlightItems.indexOf(referenceId) === -1) {
        logSpotlightItemUserInteraction(referenceId, interactionType);
        processedSpotlightItems.push(referenceId);
    }
};
