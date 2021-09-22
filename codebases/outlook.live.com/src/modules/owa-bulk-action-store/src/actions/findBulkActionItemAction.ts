import findBulkActionItemService from '../services/findBulkActionItemService';
import type FindItemJsonResponse from 'owa-service/lib/contract/FindItemJsonResponse';
import type FindItemResponseMessage from 'owa-service/lib/contract/FindItemResponseMessage';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import indexedPageView from 'owa-service/lib/factory/indexedPageView';
import updateBulkActionStore from '../utils/updateBulkActionStore';
import { trace } from 'owa-trace';

export default function findBulkActionItemAction(startIndex: number = 0, rowsToLoad: number = 10) {
    const bulkActionId = folderNameToId('bulkactions');
    if (!bulkActionId) {
        // Possible for user not to have a bulk action folder if they've never ran a bulk action
        return;
    }
    const paging = indexedPageView({
        BasePoint: 'Beginning',
        Offset: 0 /* startIndex */,
        MaxEntriesReturned: rowsToLoad,
    });

    findBulkActionItemService(startIndex, rowsToLoad, paging, bulkActionId)
        .then((response: FindItemJsonResponse) => {
            const responseMessage: FindItemResponseMessage =
                response.Body.ResponseMessages.Items[0];

            // Update the store if:
            // 1. Response Message is 'Success' and
            // 2. Items are found
            if (
                responseMessage &&
                responseMessage.ResponseClass == 'Success' &&
                responseMessage.RootFolder.Items
            ) {
                updateBulkActionStore(responseMessage.RootFolder.Items);
            }
        })
        .catch(error => {
            trace.warn('Unable to update BulkActionStore via findBulkActionItemAction.');
        });
}
