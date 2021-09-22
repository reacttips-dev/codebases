import updateItemInStore from '../actions/updateItemInStore';
import type GetItemRequestData from '../schema/GetItemRequestData';
import type ItemPropertyEntry from '../schema/ItemPropertyEntry';
import { logUsage } from 'owa-analytics';
import type { ClientItem } from 'owa-mail-store';
import getItemService from 'owa-mail-store/lib/services/getItem';
import mailStore from 'owa-mail-store/lib/store/Store';
import type Item from 'owa-service/lib/contract/Item';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import type PropertyPath from 'owa-service/lib/contract/PropertyPath';
import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import { trace, TraceErrorObject } from 'owa-trace';
import { getMailboxRequestOptions } from 'owa-request-options-types';

/**
 * GetItemManager is designed to batch all the GetItem requests for the same item id into
 * just one GetItem request
 *
 * The background is that some features needs additional properties on this item, but these
 * properties are not included in the first GCI(GetConversationItems) or GI(GetItem) due to
 * performance concern in server side. We need to trigger another GetItem request to get the
 * additional properties on item. But different features send GetItem request indiviually which causes
 * a large amount of GetItem requests after a conversation or an item is opened.
 **/

const getItemRequests: { [id: string]: GetItemRequestData } = {};
const itemPropertyEntries: { [id: string]: ItemPropertyEntry } = {};
const FAILURE_DATAPOINT_NAME: string = 'GetItemManagerFailure';

/**
 * This function is used to initialize all the item property entries.
 * Features which need additional properties on item shoud create their own
 * ItemPropertyEntry and register them in GetItemManager before using getItemProperties
 * from GetItemManager.
 */
export function initialize(entries: ItemPropertyEntry[]): void {
    entries.forEach(entry => {
        itemPropertyEntries[entry.featureId] = entry;
    });
}

/**
 * This function is used by the container to get the additional properties for all the
 * registered features after the container is mounted or updated.
 */
export function getAdditionalPropertiesFromServer(
    itemId: string,
    listViewType: ReactListViewType,
    scenarioName?: string
) {
    // Avoid duplicate GetItem request for the same itemId at the same time.
    // If a GetItem request is already completed(whether it's success or error),
    // it's allowed to trigger another GetItem request.
    if (getItemRequests[itemId] && getItemRequests[itemId].requestStatus == 'Pending') {
        return;
    }

    const { itemShape, defaultValues } = buildItemShapeAndDefaultValues(itemId, listViewType);

    // If there is no additional properties matched the condition,
    // don't need to trigger a GetItem service request.
    if (!itemShape) {
        return;
    }

    const item = mailStore.items.get(itemId) as ClientItem;
    // If the item is not existed in store right now which means it may be deleted,
    // there is no need to get additional properties for this item.
    if (!item) {
        return;
    }

    const getItemRequest = <GetItemRequestData>{
        itemId: itemId,
        listViewType: listViewType,
        requestStatus: 'Pending',
        pendingPromise: null,
    };
    getItemRequests[itemId] = getItemRequest;

    const options = getMailboxRequestOptions(item.MailboxInfo);
    getItemRequest.pendingPromise = getItemService(
        itemId,
        itemShape,
        null /*shapeName*/,
        null /*requestServerVersion*/,
        item.MailboxInfo /*mailboxInfo*/,
        options /*RequestOptions*/,
        null /**isDiscovery */,
        null /*internetMessageId*/,
        scenarioName /*scenario name to determine whether we want to use attemptToUseHxResolver*/
    )
        .then(responseMessage => {
            if (responseMessage && !(responseMessage instanceof Error)) {
                getItemRequest.requestStatus = 'Success';
                // Apply default values if there are any
                // We can get multiple responses so need to check if an array or not
                let itemFromResponse;
                if (Array.isArray(responseMessage)) {
                    itemFromResponse = responseMessage[0];
                } else {
                    itemFromResponse = responseMessage;
                }

                const itemResult = { ...defaultValues, ...itemFromResponse };

                // Update the additional properties for this item in mail store
                updateItemInStore(itemId, itemResult);
                return Promise.resolve(mailStore.items.get(itemId));
            } else if (responseMessage) {
                (responseMessage as TraceErrorObject).fetchErrorType = 'ServerFailure';
                return Promise.reject(responseMessage);
            } else {
                return Promise.resolve(null);
            }
        })
        .catch(error => {
            getItemRequest.requestStatus = 'Error';

            logUsage(FAILURE_DATAPOINT_NAME, { errorMessage: error.message });
            trace.warn(
                `[GetItemManager_getAdditionalPropertiesFromServer] Error: ${error.message}`
            );

            return Promise.reject(error);
        });
}

/**
 * This function is used by the features to get additional properties for one item.
 * The additional properties of this feature should be already registered in GetItemManager.
 */
export function getItemProperties(itemId: string, featureId: string): Promise<Item> {
    const entry = itemPropertyEntries[featureId];
    if (!entry) {
        return Promise.reject('GetItemManager: The featureId is not registered in GetItemManager.');
    }

    if (entry.isPropertyExistedOnItem(itemId)) {
        return Promise.resolve(mailStore.items.get(itemId));
    } else if (getItemRequests[itemId]) {
        const getItemRequest = getItemRequests[itemId];
        switch (getItemRequest.requestStatus) {
            case 'Success':
                return Promise.resolve(mailStore.items.get(itemId));
            case 'Pending':
            case 'Error':
                return getItemRequest.pendingPromise;
            default:
                return Promise.reject('GetItemManager: The request status is unknown.');
        }
    } else {
        return Promise.reject(
            'GetItemManager: Please trigger getItem after the container finished loading.'
        );
    }
}

/**
 * This is used to clean up the item id of a message when the message is closed.
 */
export function cleanUpByItemId(itemId: string): void {
    delete getItemRequests[itemId];
}

/**
 * Combine the additional properties based on the conditions for each item property entry.
 */
function buildItemShapeAndDefaultValues(
    itemId: string,
    listViewType: ReactListViewType
): { itemShape: ItemResponseShape; defaultValues: any } {
    const additionalProperties: PropertyPath[] = [];
    let defaultValues = {};

    const keys = Object.keys(itemPropertyEntries);
    keys.forEach(key => {
        const {
            isPropertyExistedOnItem,
            shouldGetItemPropertiesFromServer,
            propertyPaths,
            getDefaultValues,
        } = itemPropertyEntries[key];
        if (
            !isPropertyExistedOnItem(itemId) &&
            shouldGetItemPropertiesFromServer(itemId, listViewType)
        ) {
            additionalProperties.push(...propertyPaths);
            defaultValues = { ...defaultValues, ...getDefaultValues?.() };
        }
    });

    if (additionalProperties.length > 0) {
        return {
            itemShape: itemResponseShape({
                BaseShape: 'IdOnly',
                AdditionalProperties: additionalProperties,
            }),
            defaultValues: defaultValues,
        };
    }

    return { itemShape: null, defaultValues: null };
}
