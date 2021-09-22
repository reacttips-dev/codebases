import getItemTailoredXpData from './getItemTailoredXpData';
import initializeUndefinedItemProperties from '../utils/initializeUndefinedItemProperties';
import isActionSourcePrefetch from '../utils/isActionSourcePrefetch';
import isYammerEnabled from '../utils/isYammerEnabled';
import { preloadYammerIfitemIsYammerNotification } from '../utils/preloadYammerNotification';
import preserveItemDataInCache from '../utils/preserveItemDataInCache';
import type { PerformanceDatapoint } from 'owa-analytics';
import type { ClientItemId } from 'owa-client-ids';
import { isFeatureEnabled } from 'owa-feature-flags';
import configItemResponseShapeForAmp from 'owa-mail-amp-store/lib/utils/configItemResponseShapeForAmp';
import { configItemResponseShapeForCLP } from 'owa-mail-configure-response-shape-for-clp/lib/configItemResponseShapeForCLP';
import { ClientItem, getItem, LoadConversationItemActionSource, mailStore } from 'owa-mail-store';
import { configItemResponseShapeForRevocation } from 'owa-mail-store/lib/utils/configItemResponseShapeForRevocation';
import { getBaseItemResponseShape } from 'owa-mail-store/lib/utils/getBaseItemResponseShape';
import type Item from 'owa-service/lib/contract/Item';
import isExplicitLogonRequest from 'owa-service/lib/isExplicitLogonRequest';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { lazyMergeSmimeDecodedMessageProperties } from 'owa-smime';
import isSmimeDecoded from 'owa-smime/lib/utils/isSmimeDecoded';
import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';
import {
    SMIME_INSTALLED_HEADER_KEY,
    SMIME_INSTALLED_HEADER_TRUE,
} from 'owa-smime/lib/utils/constants';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import { CardFetchStatus } from 'owa-actionable-message-v2';
import { preloadActionableMessageCardForItemView } from '../utils/preloadActionableMessageCard';

const ACTION_SOURCE_HEADER_KEY = 'X-OWA-ActionSource';
const REDIRECT_TO_OUTLOOK_SERVICE_HEADER_KEY = 'X-RedirectToOutlookService';

async function parseItemResponse(responseItem: Item, itemId: ClientItemId): Promise<void> {
    const cachedItem = mailStore.items.get(itemId.Id);
    if (cachedItem) {
        // If the item already exists in the cache, make sure we preserve any data missing on the response item
        preserveItemDataInCache(responseItem, cachedItem);
    }

    if (isYammerEnabled()) {
        preloadYammerIfitemIsYammerNotification(responseItem);
    }

    // Initialize required properties that could be undefined so they're observable in the store.
    initializeUndefinedItemProperties(responseItem);

    const newItem: ClientItem = {
        Smime: null, // Initialize Smime properties if not already present in responseItem
        TranslationData: {
            isShowingTranslation: false,
            isTranslatable: false,
            isTranslating: false,
            shouldGetFeedback: false,
            isShowingSubjectTranslation: false,
            isShowingForwardContentTranslation: false,
            isForwardContentTranslatable: false,
            manuallyTranslated: false,
            userLanguage: null,
            isWrongLanguage: null,
        },
        AdaptiveCardData: {
            cardDetails: null,
            cardFetchStatus: CardFetchStatus.NotLoaded,
        },
        ...responseItem,
        MailboxInfo: itemId.mailboxInfo,
        SmartReplyData: null,
        SmartTimeData: null,
        SmartTimeExtendedProperty: null,
        smartPillFeedbackSubmitted: false,
        itemCLPInfo: null,
        SIGSData: {
            SmartPillData: null,
        },
    };

    // Prefetch the card payload.
    preloadActionableMessageCardForItemView(newItem);
    mailStore.items.set(itemId.Id, newItem);

    // Use the item reference from the store (http://aka.ms/mobx4)

    const mailStoreItem = mailStore.items.get(itemId.Id);
    getItemTailoredXpData(mailStoreItem);

    if (isSmimeDecoded(cachedItem)) {
        await lazyMergeSmimeDecodedMessageProperties.importAndExecute(mailStoreItem, cachedItem);
    }
}

const parseItemResponseAction = action('parseItemResponse')(parseItemResponse);

export function loadItem(
    itemIdToLoad: ClientItemId,
    actionSource: LoadConversationItemActionSource,
    topActionDatapoint?: PerformanceDatapoint,
    enableSmimeHeader?: boolean,
    isDiscovery?: boolean,
    scenarioName?: string
): Promise<ClientItem> {
    let requestStartTime: number;
    if (topActionDatapoint) {
        requestStartTime = topActionDatapoint.addCheckmark('request_start');
    }

    // Add action source to the request header 'X-OWA-ActionSource' for diagnostic
    const options: RequestOptions = getMailboxRequestOptions(itemIdToLoad.mailboxInfo) || {};
    const headers = new Headers();
    if (enableSmimeHeader) {
        headers.set(SMIME_INSTALLED_HEADER_KEY, SMIME_INSTALLED_HEADER_TRUE);
    }
    headers.set(ACTION_SOURCE_HEADER_KEY, actionSource);

    options.headers = headers;

    if (
        isFeatureEnabled('platform-redirectGetItemToOutlookService') &&
        !isExplicitLogonRequest(options)
    ) {
        options.headers.set(REDIRECT_TO_OUTLOOK_SERVICE_HEADER_KEY, 'true');
    }

    // Add actionSource in custom data for tracking.
    options.datapoint = {
        customData: {
            actionSource: actionSource,
        },
    };

    const itemResponseShape = getBaseItemResponseShape();
    configItemResponseShapeForAmp(itemResponseShape);
    configItemResponseShapeForCLP(itemResponseShape);
    configItemResponseShapeForRevocation(itemResponseShape);
    return getItem(
        itemIdToLoad.Id,
        itemResponseShape,
        'ItemNormalizedBody',
        'V2017_08_18' /* requestServerVersion */,
        itemIdToLoad.mailboxInfo,
        options,
        isDiscovery,
        '',
        scenarioName,
        isActionSourcePrefetch(actionSource)
    )
        .then(responseItem => {
            // Add the request time as the custom data.
            if (topActionDatapoint) {
                const requestEndTime = topActionDatapoint.addCheckmark('request_end');
                topActionDatapoint.addCustomData({
                    requestTime: requestEndTime - requestStartTime,
                });
            }

            if (!(responseItem instanceof Error) && responseItem !== null) {
                let itemFromResponse;
                if (Array.isArray(responseItem)) {
                    itemFromResponse = responseItem[0];
                } else {
                    itemFromResponse = responseItem;
                }

                return parseItemResponseAction(itemFromResponse, itemIdToLoad).then(() =>
                    mailStore.items.get(itemIdToLoad.Id)
                );
            } else {
                switch (actionSource) {
                    case 'PrefetchFirstN':
                    case 'PrefetchSingleRow':
                    case 'PrefetchRowInCache':
                    case 'PrefetchAdjacentRowsOnDelay':
                        break;
                    default:
                        trace.warn(
                            actionSource +
                                ': ' +
                                (responseItem instanceof Error
                                    ? responseItem.message
                                    : responseItem)
                        );
                        break;
                }

                if (responseItem instanceof Error) {
                    return Promise.reject(responseItem);
                } else {
                    return Promise.resolve(null);
                }
            }
        })
        .catch((error: Error) => {
            // Add the action source to the error message
            error.message += `, ActionSource=${actionSource}`;

            // If the action source is not prefetch, reject the error.
            if (!isActionSourcePrefetch(actionSource)) {
                return Promise.reject(error);
            } else {
                return Promise.resolve();
            }
        });
}
