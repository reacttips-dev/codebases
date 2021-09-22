import { getComposeItemResponseShape } from 'owa-mail-compose-item-response-shape/lib/getComposeItemResponseShape';
import { isFeatureEnabled } from 'owa-feature-flags';
import getPublicFolderMailboxInfoForSmtpAddress from 'owa-public-folder-favorite/lib/services/utils/getPublicFolderMailboxInfoForSmtpAddress';
import publicFolderFavoriteStore from 'owa-public-folder-favorite/lib/store/publicFolderFavoriteStore';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import type BodyType from 'owa-service/lib/contract/BodyType';
import type CreateItemResponse from 'owa-service/lib/contract/CreateItemResponse';
import type Item from 'owa-service/lib/contract/Item';
import type RightsManagementLicenseDataType from 'owa-service/lib/contract/RightsManagementLicenseDataType';
import type TargetFolderId from 'owa-service/lib/contract/TargetFolderId';
import createItemRequest from 'owa-service/lib/factory/createItemRequest';
import folderIdFactory from 'owa-service/lib/factory/folderId';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import targetFolderIdFactory from 'owa-service/lib/factory/targetFolderId';
import createItemOperation from 'owa-service/lib/operation/createItemOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import getOutboundCharset from 'owa-session-store/lib/selectors/getOutboundCharset';
import { getMailboxRequestOptions } from 'owa-request-options-types';

function createRequestBodyFromItem(
    itemType: Item,
    bodyType: BodyType,
    isSend: boolean,
    timeFormat: string,
    isInlineCompose?: boolean,
    IRMData?: RightsManagementLicenseDataType,
    folderId?: string,
    remoteExecute?: boolean,
    suppressServerMarkReadOnReplyOrForward?: boolean
) {
    const composeType: string = itemType.__type == 'PostItem:#Exchange' ? 'newPost' : 'newMail';
    const savedFolderId: TargetFolderId | null = folderId
        ? targetFolderIdFactory({
              BaseFolderId: folderIdFactory({
                  Id: folderId,
              }),
          })
        : null;

    const request = createItemRequest({
        ClientSupportsIrm: true,
        ComposeOperation: composeType,
        MessageDisposition: isSend ? 'SendAndSaveCopy' : 'SaveOnly',
        Items: [itemType],
        TimeFormat: timeFormat,
        SendOnNotFoundError: true,
        RemoteExecute: remoteExecute,
        ItemShape: itemResponseShape({
            // Pass IdOnly as ShapeName here so that the response will contain LastModifiedTime
            BaseShape: 'IdOnly',
            AdditionalProperties: [propertyUri({ FieldURI: 'ItemLastModifiedTime' })],
        }),
        SavedItemFolderId: savedFolderId ?? undefined,
        // Below flag suppresses the server behavior where it marks
        // the parent item to which user is r/R/F ing as read. This creates a problem in scenarios where
        // user is in unread filter and the item accidentally disappears from LV breaking user's workflow
        SuppressMarkAsReadOnReplyOrForward:
            isFeatureEnabled('tri-suppressMarkReadBehaviorOnRF') &&
            suppressServerMarkReadOnReplyOrForward,
        ...getOutboundCharset(),
    });

    if (IRMData?.IsOwner) {
        // If no encryption, need to explicitly set complianceId to '0' to remove any pre set IRM state
        request.ComplianceId = IRMData.RmsTemplateId ? IRMData.RmsTemplateId.toUpperCase() : '0';
    }

    if (!isSend) {
        request.ItemShape = getComposeItemResponseShape(bodyType);
        request.ShapeName = 'MailCompose';
    } else if (isInlineCompose && request.ItemShape) {
        // If sending from inlineCompose, request the internetMessageId in case we don't have it yet.
        request.ItemShape.ReturnOnlyInternetMessageId = true;
    }

    return request;
}

export default function createItem(
    itemType: Item,
    bodyType: BodyType,
    isSend: boolean,
    timeFormat: string,
    isInlineCompose?: boolean,
    IRMData?: RightsManagementLicenseDataType,
    folderId?: string,
    remoteExecute?: boolean,
    suppressServerMarkReadOnReplyOrForward?: boolean
): Promise<CreateItemResponse> {
    const requestBody = createRequestBodyFromItem(
        itemType,
        bodyType,
        isSend,
        timeFormat,
        isInlineCompose,
        IRMData,
        folderId,
        remoteExecute,
        suppressServerMarkReadOnReplyOrForward
    );

    let requestOptions;
    if (itemType.__type == 'PostItem:#Exchange' && folderId) {
        const sourceFolder = publicFolderFavoriteStore.folderTable.get(folderId);
        if (sourceFolder) {
            // Cannot use getPublicFolderMailboxInfo here because of circular dependencies
            const mailboxSmtpAddress = sourceFolder.ReplicaList
                ? sourceFolder.ReplicaList[0]
                : getUserConfiguration().SessionSettings?.DefaultPublicFolderMailbox;
            if (mailboxSmtpAddress) {
                const mailboxInfo = getPublicFolderMailboxInfoForSmtpAddress(mailboxSmtpAddress);
                requestOptions = getMailboxRequestOptions(mailboxInfo);
            }
        }
    }

    return createItemOperation(
        {
            Header: getJsonRequestHeader(),
            Body: requestBody,
        },
        requestOptions
    ).then(response => {
        return response
            ? Promise.resolve(response.Body)
            : Promise.reject(new Error('ErrorSessionTimeout')); // When get HTTP 401/440, the response will be null
    });
}
