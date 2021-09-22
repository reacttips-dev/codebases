import { getAdapter, CommonAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import saveExtensionCustomProperties from '../../services/saveExtensionCustomProperties';
import ApiErrorCode from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';
import { getExtensionId } from 'owa-addins-store';

export interface SaveCustomPropertiesArgs {
    customProperties: {};
}

export default async function saveCustomPropertiesApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: SaveCustomPropertiesArgs,
    callback: ApiMethodCallback
) {
    const adapter: CommonAdapter = getAdapter(hostItemIndex) as CommonAdapter;
    const extensionId = getExtensionId(controlId);
    const serializedCustomProperties = JSON.stringify(data.customProperties);
    let itemId = await adapter.getItemId();
    let itemOwner;

    try {
        if (returnErrorIfUserCannotEditItem(adapter, callback)) {
            return;
        }

        if (!itemId) {
            const composeAdapter = adapter as MessageComposeAdapter;
            itemId = await composeAdapter.saveItem();
        }

        if (
            adapter.isSharedItem &&
            adapter.getSharedProperties &&
            adapter.isSharedItem() &&
            adapter.isRemoteItem()
        ) {
            const sharedProperties = adapter.getSharedProperties();
            itemOwner = sharedProperties.owner;
        }

        const response = await saveExtensionCustomProperties(
            extensionId,
            itemId,
            itemOwner,
            serializedCustomProperties
        );

        if (response.WasSuccessful) {
            callback(createSuccessResult());
        } else {
            callback(createErrorResult(ApiErrorCode.GenericResponseError));
        }
    } catch (e) {
        callback(createErrorResult(ApiErrorCode.GenericResponseError));
    }
}
