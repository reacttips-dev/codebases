import {
    groupsLeftNav_MoveFailedTitleSingular,
    groupsLeftNav_MoveFailedSubtitleSingular,
    groupsLeftNav_MoveFailedSubtitlePlural,
} from './moveMailListRowsToGroup.locstring.json';
import { groupsLeftNav_MoveFailedTitlePlural } from '../strings.locstring.json';
import loc, { format } from 'owa-localize';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import { confirm } from 'owa-confirm-dialog';
import setGroupDragDropActionState from 'owa-group-left-nav/lib/mutators/setGroupDragDropActionState';
import { createGroupMailTableQuery, getListViewTypeForGroup } from 'owa-group-mail-list-actions';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import getBaseFolderId from 'owa-mail-list-store/lib/utils/getBaseFolderId';
import isConversationView from 'owa-mail-list-store/lib/utils/isConversationView';
import getItemIdsFromConversations from 'owa-mail-list-store/lib/utils/getItemIdsFromConversations';
import getRowIdsFromRowKeys from 'owa-mail-list-store/lib/utils/getRowIdsFromRowKeys';
import deleteItemService from 'owa-mail-store/lib/services/deleteItemService';
import copyItemsService from 'owa-mail-triage-action/lib/services/copyItemsService';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import type CopyItemResponse from 'owa-service/lib/contract/CopyItemResponse';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import targetFolderIdFactory from 'owa-service/lib/factory/targetFolderId';

interface CopyItemResponseInfo {
    successfulItems: string[];
    failedItemCount: number;
    lastResponseCode?: string;
}

function handleMoveError(
    groupId: string,
    numMessages: number,
    datapoint: PerformanceDatapoint,
    error: string
) {
    datapoint.addCustomData({ error: error });
    datapoint.endWithError(DatapointStatus.ServerError, new Error(error));

    confirm(
        numMessages == 1
            ? loc(groupsLeftNav_MoveFailedTitleSingular)
            : loc(groupsLeftNav_MoveFailedTitlePlural),
        numMessages == 1
            ? format(loc(groupsLeftNav_MoveFailedSubtitleSingular), groupId)
            : format(loc(groupsLeftNav_MoveFailedSubtitlePlural), groupId),
        false,
        {
            hideCancelButton: true,
        }
    );
    setGroupDragDropActionState(groupId, false);
}

function extractResponseInfo(response: CopyItemResponse): CopyItemResponseInfo {
    if (!response || !response.ResponseMessages || !response.ResponseMessages.Items) {
        return null;
    }

    const copyItemResponseInfo: CopyItemResponseInfo = { successfulItems: [], failedItemCount: 0 };
    for (let i = 0; i < response.ResponseMessages.Items.length; i++) {
        const responseMessage = response.ResponseMessages.Items[i] as ItemInfoResponseMessage;
        if (responseMessage && responseMessage.ResponseClass == 'Success') {
            copyItemResponseInfo.successfulItems.push(responseMessage.Items[0].ItemId.Id);
        } else {
            copyItemResponseInfo.failedItemCount++;
            if (responseMessage) {
                copyItemResponseInfo.lastResponseCode = responseMessage.ResponseCode;
            }
        }
    }

    return copyItemResponseInfo;
}

export default function moveMailListRowsToGroup(
    mailListRowDragData: MailListRowDragData,
    groupId: string
): Promise<void> {
    const datapoint = new PerformanceDatapoint('dragDropToGroup');
    setGroupDragDropActionState(groupId, true);

    const rowKeys = mailListRowDragData.rowKeys;
    const originalTableViewId = mailListRowDragData.tableViewId;
    const originalTableView = listViewStore.tableViews.get(originalTableViewId);

    const destinationTableQuery = createGroupMailTableQuery(groupId, getListViewTypeForGroup());

    const itemIdStringArray = isConversationView(originalTableView)
        ? getItemIdsFromConversations(rowKeys, originalTableViewId)
        : getRowIdsFromRowKeys(rowKeys, originalTableViewId);

    const requestOptions = {
        headers: <any>{
            'X-OWA-ExplicitLogonUser': destinationTableQuery.folderId,
            'X-AnchorMailbox': destinationTableQuery.folderId,
            'X-OWA-ActionName': 'GroupMailbox',
        },
    };

    return copyItemsService(
        itemIdStringArray,
        targetFolderIdFactory({
            BaseFolderId: getBaseFolderId(destinationTableQuery),
        }),
        true /* RemoteExecute */,
        requestOptions
    )
        .then(response => {
            const copyItemResponseInfo = extractResponseInfo(response);
            if (copyItemResponseInfo && copyItemResponseInfo.failedItemCount < 1) {
                datapoint.end();
                const itemIdsArray = itemIdStringArray.map(itemIdValue => {
                    return {
                        Id: itemIdValue,
                    };
                });

                // If CopyItem succeeds, we delete the item from the user mailbox to complete the move
                deleteItemService(itemIdsArray, 'HardDelete');
                setGroupDragDropActionState(groupId, false);
            } else {
                handleMoveError(
                    groupId,
                    itemIdStringArray.length,
                    datapoint,
                    copyItemResponseInfo.lastResponseCode
                        ? copyItemResponseInfo.lastResponseCode
                        : 'UnknownError'
                );
            }
        })
        .catch(exception => {
            handleMoveError(
                groupId,
                itemIdStringArray.length,
                datapoint,
                JSON.stringify(exception)
            );
        });
}
