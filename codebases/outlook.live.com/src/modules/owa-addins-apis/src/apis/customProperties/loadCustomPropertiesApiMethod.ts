import ApiErrorCode from '../ApiErrorCode';
import loadExtensionCustomProperties from '../../services/loadExtensionCustomProperties';
import type { ApiMethodCallback } from '../ApiMethod';
import { createCustomPropertiesResult } from './CustomPropertiesResult';
import { createErrorResult } from '../ApiMethodResponseCreator';
import { getAdapter, CommonAdapter } from 'owa-addins-adapters';
import { getExtensionId } from 'owa-addins-store';

export default async function loadCustomPropertiesApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: null,
    callback: ApiMethodCallback
) {
    const adapter: CommonAdapter = getAdapter(hostItemIndex) as CommonAdapter;
    // Is there a way to early exit here for falsy IDs without
    // calling to the backend to convert an immutableID to an ews ID?
    const itemId = await adapter.getItemId();
    if (!itemId) {
        callback(createCustomPropertiesResult('', true, '{}'));
        return;
    }
    const extensionId = getExtensionId(controlId);
    let itemOwner;

    try {
        if (
            adapter.isSharedItem &&
            adapter.getSharedProperties &&
            adapter.isSharedItem() &&
            adapter.isRemoteItem()
        ) {
            const sharedProperties = adapter.getSharedProperties();
            itemOwner = sharedProperties.owner;
        }

        const result = await loadExtensionCustomProperties(extensionId, itemId, itemOwner);
        let CustomProperties = result.CustomProperties;
        if (CustomProperties) {
            CustomProperties = CustomProperties.trim();
        }

        // In case of string with multiple whitespaces, above condition will also be true and then after trim,
        // this condition will also become true. So this is not added as else condition.
        if (!CustomProperties) {
            CustomProperties = '{}'; // Instead of empty string return empty dict
        }

        callback(
            createCustomPropertiesResult(
                result.ErrorMessage,
                result.WasSuccessful,
                CustomProperties
            )
        );
    } catch (e) {
        callback(createErrorResult(ApiErrorCode.GenericResponseError));
    }
}
