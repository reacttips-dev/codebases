import { getApolloClient } from 'owa-apollo';
import type * as Schema from 'owa-graph-schema';
import { GetFullConversationByIdDocument } from '../queries/__generated__/GetFullConversationByID.interface';
import type FolderId from 'owa-service/lib/contract/FolderId';
import deleteConversationItemParts from './deleteConversationItemParts';
import parseConversationResponse from './parseConversationResponse';
import createEmptyConversationItemParts from '../utils/createEmptyConversationItemParts';
import configItemResponseShapeForAmp from 'owa-mail-amp-store/lib/utils/configItemResponseShapeForAmp';
import getErrorResponseCode from '../utils/getErrorResponseCode';
import isActionSourcePrefetch from '../utils/isActionSourcePrefetch';
import type { PerformanceDatapoint } from 'owa-analytics';
import type { ClientItemId } from 'owa-client-ids';
import type { MruCache } from 'owa-mru-cache';
import type ConversationSortOrder from 'owa-service/lib/contract/ConversationSortOrder';
import type GetConversationItemsResponseMessage from 'owa-service/lib/contract/GetConversationItemsResponseMessage';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { action } from 'satcheljs/lib/legacy';
import {
    ConversationItemParts,
    conversationCache,
    LoadConversationItemActionSource,
    PendingConversationRequestState,
} from 'owa-mail-store';
import { getConversationItemResponseShape } from 'owa-mail-store/lib/utils/getConversationItemResponseShape';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import folderId from 'owa-service/lib/factory/folderId';
import { GEEK_FOLDERS_TO_IGNORE } from 'owa-folders-constants';
import legacyGetConversationItemsService from 'owa-mail-get-conversation-items-service/lib/getConversationItemsService';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getMailboxRequestOptions } from 'owa-request-options-types';

const pendingNonPrefetchRequestPromises: { [key: string]: Promise<void> } = {};

function getConversationSortOrderFromSettings(): ConversationSortOrder {
    const userConfiguration = getUserConfiguration();
    const sortOrderFromOptions = userConfiguration.UserOptions.ConversationSortOrderReact;
    let conversationSortOrder: ConversationSortOrder;
    if (sortOrderFromOptions !== undefined && typeof sortOrderFromOptions == 'string') {
        // Convert string to enum
        conversationSortOrder = sortOrderFromOptions;
    } else {
        conversationSortOrder = sortOrderFromOptions as ConversationSortOrder;
    }
    return conversationSortOrder;
}

function setPendingRequestState(
    conversationToLoad: ConversationItemParts,
    actionSource: LoadConversationItemActionSource
) {
    if (!conversationToLoad.pendingRequestState) {
        conversationToLoad.pendingRequestState = <PendingConversationRequestState>{
            shouldUseEmptySyncState: !conversationToLoad.syncState,
        };
    } else {
        // If one of pending requests needs to use empty syncState, keep shouldUseEmptySyncState to be true.
        conversationToLoad.pendingRequestState.shouldUseEmptySyncState =
            conversationToLoad.pendingRequestState.shouldUseEmptySyncState ||
            !conversationToLoad.syncState;
    }

    conversationToLoad.pendingRequestState.actionSource = actionSource;
}

const processResponse = action('processGetConversationItemsResponse')(function processResponse(
    conversationSortOrder: ConversationSortOrder,
    conversationId: ClientItemId,
    responseMessage: GetConversationItemsResponseMessage | Schema.Conversation,
    conversations: MruCache<ConversationItemParts>,
    actionSource: LoadConversationItemActionSource
) {
    parseConversationResponse(responseMessage, conversationSortOrder, conversationId, actionSource);
    const loadedConversation = conversations.get(conversationId.Id);
    loadedConversation.loadingState.isLoading = false;
    delete pendingNonPrefetchRequestPromises[conversationId.Id];
    if (loadedConversation.pendingRequestState) {
        // Issue the pending GCI if has one
        loadConversation(conversationId, loadedConversation.pendingRequestState.actionSource);
    }
});

function getIsGroupMailbox(conversationId: ClientItemId): boolean {
    const mailboxInfo = conversationId.mailboxInfo;
    return mailboxInfo && mailboxInfo.type == 'GroupMailbox';
}

function getFoldersToIgnore(isGroupMailbox: boolean): FolderId[] {
    const foldersToIgnore: FolderId[] = [];

    if (!isGroupMailbox) {
        GEEK_FOLDERS_TO_IGNORE.forEach(folderName => {
            const ignoreFolderId = folderNameToId(folderName);
            if (ignoreFolderId) {
                foldersToIgnore.push(folderId({ Id: ignoreFolderId }));
            }
        });
    }
    return foldersToIgnore;
}

export interface LoadConversationState {
    conversations: MruCache<ConversationItemParts>;
}

const loadConversation = action('loadConversation')(function loadConversation(
    conversationIdToLoad: ClientItemId,
    actionSource: LoadConversationItemActionSource,
    topActionDatapoint?: PerformanceDatapoint,
    state: LoadConversationState = { conversations: conversationCache }
): Promise<void> {
    let promiseToReturn = Promise.resolve();
    const conversationSortOrder = getConversationSortOrderFromSettings();
    const conversationRawIdToLoad = conversationIdToLoad.Id;
    let conversationToLoad = state.conversations.get(conversationRawIdToLoad);
    // If cached conversationSortOrder is different from userOption, delete the cache
    if (conversationToLoad && conversationToLoad.conversationSortOrder != conversationSortOrder) {
        deleteConversationItemParts(conversationRawIdToLoad);
        conversationToLoad = null;
    }
    // If conversation has no cache or previous cache failed, create an empty one
    if (!conversationToLoad || conversationToLoad.loadingState.hasLoadFailed) {
        conversationToLoad = createEmptyConversationItemParts(
            conversationIdToLoad,
            conversationSortOrder
        );
    }
    // Save empty conversationItemPart, or touch conversationCache to reduce the possibility that the conversation got purged from cache
    state.conversations.add(conversationRawIdToLoad, conversationToLoad);
    conversationToLoad = state.conversations.get(conversationRawIdToLoad);
    // For each new coming GCI request, we "queue" it as a pending request to guarantee only one ongoing GCI per conversation.
    // But we don't really queue requests, instead, we just set/update pending request status based on new coming GCI requests.
    setPendingRequestState(conversationToLoad, actionSource);
    let requestStartTime: number;
    if (topActionDatapoint) {
        requestStartTime = topActionDatapoint.addCheckmark('request_start');
    }
    // Send the GCI request immediately in these cases:
    // 1 - Always send GCI when this conversation is not loading right now.
    // 2 - If the conversation is loading, only send GCI when it's not from prefetch and it's not in pendingNonPrefetchRequestPromises,
    // which means it's from real user selects the conversation and there is an ongoing prefetch request.
    if (
        !conversationToLoad.loadingState.isLoading ||
        (!isActionSourcePrefetch(actionSource) &&
            !pendingNonPrefetchRequestPromises[conversationRawIdToLoad])
    ) {
        const shouldUseEmptySyncState =
            conversationToLoad.pendingRequestState.shouldUseEmptySyncState;
        conversationToLoad.loadingState.isLoading = true;
        // Clear pending GCI state
        conversationToLoad.pendingRequestState = null;
        const mailboxInfo = conversationToLoad.conversationId.mailboxInfo;
        // Add action source to the request header 'X-OWA-ActionSource' for diagnostic
        const options: RequestOptions = getMailboxRequestOptions(mailboxInfo) || {};
        options.headers = new Headers();
        options.headers.set('X-OWA-ActionSource', actionSource);
        // Add actionSource in custom data for tracking.
        options.datapoint = {
            customData: {
                actionSource: actionSource,
            },
        };
        const isGroupMailbox = getIsGroupMailbox(conversationToLoad.conversationId);
        const itemResponseShape = getConversationItemResponseShape(actionSource, isGroupMailbox);
        configItemResponseShapeForAmp(itemResponseShape);
        // Until Hx has support for ParentInternetMessageId on the ConversationNode we need to default to the web resolvers for unstacked RP
        if (
            isFeatureEnabled('mon-rp-loadConversationViaGql') &&
            actionSource != 'CreateConversationRelationMap'
        ) {
            promiseToReturn = (async () => {
                const client = getApolloClient();
                const isGroupMailbox = getIsGroupMailbox(conversationToLoad.conversationId);
                const itemResponseShape = getConversationItemResponseShape(
                    actionSource,
                    isGroupMailbox
                );
                configItemResponseShapeForAmp(itemResponseShape);
                try {
                    const responseMessageResult = await client.query({
                        query: GetFullConversationByIdDocument,
                        variables: {
                            id: conversationToLoad.conversationId.Id,
                            limit: conversationToLoad.maxItemsToReturn,
                            mailboxInfo: mailboxInfo,
                            options: {
                                action: 'ReturnRootNode',
                                responseShape: itemResponseShape,
                                folderIdsToIgnore: getFoldersToIgnore(isGroupMailbox).map(
                                    folder => folder.Id
                                ),
                                syncState: conversationToLoad.syncState,
                                conversationSortOrder,
                                shouldUseEmptySyncState,
                                mailboxInfo: mailboxInfo,
                            },
                        },
                        context: {
                            queueOperation: isActionSourcePrefetch(actionSource),
                        },
                    });
                    if (topActionDatapoint) {
                        const requestEndTime = topActionDatapoint.addCheckmark('request_end');
                        topActionDatapoint.addCustomData({
                            requestTime: requestEndTime - requestStartTime,
                        });
                    }
                    const conversationResult: Schema.Conversation =
                        responseMessageResult.data.conversation;
                    processResponse(
                        conversationSortOrder,
                        conversationIdToLoad,
                        conversationResult,
                        state.conversations,
                        actionSource
                    );
                } catch (error) {
                    // If owa-service throws an error, we want to catch it here process as a null responseMessage
                    processResponse(
                        conversationSortOrder,
                        conversationIdToLoad,
                        null /* responseMessage */,
                        state.conversations,
                        actionSource
                    );
                    // Add the action source to the error message
                    error.message += `, ActionSource=${actionSource}`;
                    // If the action source is not prefetch, reject the error.
                    if (!isActionSourcePrefetch(actionSource)) {
                        return Promise.reject(error);
                    } else {
                        return Promise.resolve();
                    }
                }
            })();
        } else {
            promiseToReturn = legacyGetConversationItemsService(
                conversationToLoad.conversationId,
                itemResponseShape,
                conversationToLoad.syncState,
                conversationToLoad.maxItemsToReturn,
                conversationSortOrder,
                shouldUseEmptySyncState,
                'ReturnRootNode',
                getFoldersToIgnore(isGroupMailbox),
                options
            )
                .then(responseMessage => {
                    // Add the request time as the custom data.
                    if (topActionDatapoint) {
                        const requestEndTime = topActionDatapoint.addCheckmark('request_end');
                        topActionDatapoint.addCustomData({
                            requestTime: requestEndTime - requestStartTime,
                        });
                    }
                    processResponse(
                        conversationSortOrder,
                        conversationIdToLoad,
                        responseMessage,
                        state.conversations,
                        actionSource
                    );
                    const [errorResponseCode, stackTrace] = getErrorResponseCode(responseMessage);
                    if (errorResponseCode) {
                        return Promise.reject(
                            new Error(
                                `ErrorResponseCode=${errorResponseCode}, StackTrace=${stackTrace}`
                            )
                        );
                    } else {
                        return Promise.resolve();
                    }
                })
                .catch((error: Error) => {
                    // If owa-service throws an error, we want to catch it here process as a null responseMessage
                    processResponse(
                        conversationSortOrder,
                        conversationIdToLoad,
                        null /* responseMessage */,
                        state.conversations,
                        actionSource
                    );
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
        if (!isActionSourcePrefetch(actionSource)) {
            // Cache the promise in case future calls come in waiting for the same conversation.
            // Only cache the non-prefetch request.
            pendingNonPrefetchRequestPromises[conversationRawIdToLoad] = promiseToReturn;
        }
    } else if (pendingNonPrefetchRequestPromises[conversationRawIdToLoad]) {
        // If we have a cached promise for this conversation, return that for waiting callers.
        // This is particularly important for double-click to open a popout. When the user double-clicks in the listView,
        // a single-click will also trigger and start loading the conversation. We want to return that promise, so
        // the double-click popout code can also wait on it.
        promiseToReturn = pendingNonPrefetchRequestPromises[conversationRawIdToLoad];
        // If the request is in pending request table, add it in custom data.
        if (topActionDatapoint) {
            topActionDatapoint.addCustomData({ pendingRequest: true });
        }
    }
    return promiseToReturn;
});

export { loadConversation };
