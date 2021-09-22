import onCacheUpdated from '../actions/onCacheUpdated';
import { onSpotlightDismissedFromRPProcessed } from '../actions/onSpotlightDismissedFromRP';
import onSpotlightItemsFetched from '../actions/onSpotlightItemsFetched';
import type SpotlightItem from '../store/schema/SpotlightItem';
import SpotlightReason from '../store/schema/SpotlightReason';
import getStore from '../store/store';
import getActionCategory, { ActionCategory } from '../utils/getActionCategory';
import { logSpotlightResultsRendered } from '../utils/instrumentationUtils';
import isSpotlightEnabled from '../utils/isSpotlightEnabled';
import { owaDate } from 'owa-datetime';
import { getGuid } from 'owa-guid';
import { getSelectedTableView, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import { onSpotlightDisabled } from 'owa-mail-spotlight-options';
import { getQueryStringParameter } from 'owa-querystring';
import { mutator } from 'satcheljs';
import {
    isItemInSpotlightItemsCache,
    cleanSpotlightItemsCaches,
    SpotlightCacheType,
} from '../utils/cacheUtils';

mutator(onSpotlightItemsFetched, actionMessage => {
    const {
        spotlightItems: spotlightItemsFromServer,
        isConversationView,
        requestStartTime,
    } = actionMessage;
    const testSpotlightItems = getTestSpotlightItems();
    const spotlightItems = spotlightItemsFromServer.concat(testSpotlightItems);

    /**
     * Ensure there's no duplication between the list of actual Spotlight items
     * returned from the service and items marked as Spotlight via the test param.
     */
    const uniqueIds = [];
    const uniqueSpotlightItems = spotlightItems
        .concat(testSpotlightItems)
        .filter((spotlightItem: SpotlightItem) => {
            const id = isConversationView ? spotlightItem.conversationId : spotlightItem.itemId;

            if (uniqueIds.indexOf(id) > -1) {
                return false;
            }

            uniqueIds.push(id);
            return true;
        });

    // Clean up Spotlght caches.
    cleanSpotlightItemsCaches(uniqueSpotlightItems);

    // Remove Spotlight items that have been dismissed from the client.
    const spotlightItemsToRender = uniqueSpotlightItems.filter(
        (spotlightItem: SpotlightItem) => !spotlightItem.isDismissed
    );

    /**
     * Replace items in store, assign a new logical ID for the set, and store
     * the request start time for the latest request.
     */
    getStore().spotlightItems = spotlightItemsToRender;
    getStore().logicalId = getGuid();
    getStore().requestStartTime = requestStartTime;

    /**
     * If there are no Spotlight items to render, then we'll immediately log the
     * ResultsRendered events (per agreement with 3S).
     */
    if (spotlightItemsToRender.length === 0) {
        logSpotlightResultsRendered();
    }
});

mutator(onSpotlightDismissedFromRPProcessed, actionMessage => {
    const rowKey = actionMessage.rowKey;
    const spotlightItems = getStore().spotlightItems;

    for (let i = 0; i < spotlightItems.length; i++) {
        const spotlightItem = spotlightItems[i];

        if (spotlightItem.rowKey === rowKey) {
            spotlightItems.splice(i, 1);
            break;
        }
    }
});

mutator(onCacheUpdated, actionMessage => {
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

    switch (getActionCategory(interactionType)) {
        // Mark items as acknowledged if a weak action is taken
        case ActionCategory.Weak:
            handleSpotlightItemInteraction({
                itemIds,
                conversationIds,
                rowKeys,
                actionCategory: ActionCategory.Weak,
            });
            break;
        // Remove item from Spotlight items if a strong action is taken
        case ActionCategory.Strong:
            handleSpotlightItemInteraction({
                itemIds,
                conversationIds,
                rowKeys,
                actionCategory: ActionCategory.Strong,
            });
            break;
        // If unknown action is taken, take no action
        case ActionCategory.Unknown:
        default:
            break;
    }
});

mutator(onSpotlightDisabled, () => {
    getStore().spotlightItems = [];
});

const handleSpotlightItemInteraction = (params: {
    itemIds: string[];
    conversationIds: string[];
    rowKeys: string[];
    actionCategory: ActionCategory;
}) => {
    const { itemIds, conversationIds, rowKeys, actionCategory } = params;
    const spotlightItems = getStore().spotlightItems;

    spotlightItems.map((spotlightItem: SpotlightItem, index: number) => {
        if (
            itemIds.indexOf(spotlightItem.itemId) > -1 ||
            conversationIds.indexOf(spotlightItem.conversationId) > -1 ||
            rowKeys.indexOf(spotlightItem.rowKey) > -1
        ) {
            if (actionCategory === ActionCategory.Weak) {
                spotlightItem.isAcknowledged = true;
            } else if (actionCategory === ActionCategory.Strong) {
                spotlightItems.splice(index, 1);
            }
        }
    });
};

const getTestSpotlightItems = (): SpotlightItem[] => {
    const testSpotlightItems: SpotlightItem[] = [];
    const testSpotlightQueryParam = getQueryStringParameter('testSpotlight');

    if (testSpotlightQueryParam) {
        const tableView = getSelectedTableView();
        const testItemsCount = parseInt(testSpotlightQueryParam);

        for (let i = 0; i < testItemsCount; i++) {
            const rowKey = tableView.rowKeys[i];
            const itemId = MailRowDataPropertyGetter.getItemIds(rowKey, tableView)[0];
            const conversationId = MailRowDataPropertyGetter.getConversationId(rowKey, tableView);

            if (rowKey) {
                testSpotlightItems.push({
                    rowKey,
                    itemId,
                    conversationId,
                    isAcknowledged: isItemInSpotlightItemsCache({
                        spotlightCacheType: SpotlightCacheType.Acknowledged,
                        itemId,
                        conversationId,
                        rowKey,
                    }),
                    isDismissed: isItemInSpotlightItemsCache({
                        spotlightCacheType: SpotlightCacheType.Dismissed,
                        itemId,
                        conversationId,
                        rowKey,
                    }),
                    reason: SpotlightReason.None,
                    senderName: MailRowDataPropertyGetter.getLastSenderMailbox(rowKey, tableView)
                        .Name,
                    referenceId: '00000000-0000-0000-0000-000000000000',
                    dateTimeReceived: owaDate(
                        MailRowDataPropertyGetter.getLastDeliveryTimeStamp(rowKey, tableView)
                    ),
                });
            }
        }
    }

    return testSpotlightItems;
};
